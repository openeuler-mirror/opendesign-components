#!/usr/bin/env node

/**
 * @description 同步各 AI coding agent 目录/文件，执行：
 *   1. 确保 .agents/{dir} 存在
 *   2. 创建 .claude/{dir} → .agents/{dir} 的符号链接
 *   3. 将 packages/{dir} 下的子目录注入 .agents/{dir}
 *   4. 将各 AGENTS.md → 对应 CLAUDE.md 的文件级符号链接
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/** 项目根目录 */
const ROOT = path.resolve(import.meta.dirname, '..');

/**
 * @description 需要同步的子目录名列表，后续新增只需追加即可
 * @type {string[]}
 */
const SYNC_DIRS = ['skills'];

/**
 * @description agent 源目录名（存放互联网下载 + 项目注入的内容）
 *   各 AI coding agent 通过符号链接指向此目录下的子目录
 */
const AGENTS_DIR_NAME = '.agents';

/**
 * @description Claude Code 的目录名，其子目录通过符号链接指向 AGENTS_DIR_NAME
 */
const CLAUDE_DIR_NAME = '.claude';

/**
 * @description 项目专属内容的源目录名（随代码提交）
 *   其子目录通过符号链接注入 AGENTS_DIR_NAME
 */
const PKG_DIR_NAME = 'packages';

// ─── 符号链接工具 ────────────────────────────────────────────

/**
 * @description 获取链接路径当前的 lstat，不存在返回 null
 * @param {string} linkPath - 要检查的路径（绝对路径）
 * @returns {fs.Stats | null} lstat 结果，ENOENT 时返回 null
 */
function readLinkStat(linkPath) {
  try {
    return fs.lstatSync(linkPath);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

/**
 * @description 删除链接路径上的现有条目（symlink / 目录 / 文件均可）
 * @param {fs.Stats} stat - lstat 结果，用于判断删除策略
 * @param {string} linkPath - 要删除的路径（绝对路径）
 */
function removeExistingEntry(stat, linkPath) {
  if (stat.isSymbolicLink() || stat.isFile()) {
    fs.unlinkSync(linkPath);
  } else if (stat.isDirectory()) {
    fs.rmSync(linkPath, { recursive: true, force: true });
  }
}

/**
 * @description 判断已有符号链接是否指向预期目标
 * @param {string} linkPath - 符号链接路径（绝对路径）
 * @param {string} target - 预期目标路径（绝对路径）
 * @returns {boolean} 已指向正确目标则返回 true
 */
function isSymlinkCorrect(linkPath, target) {
  const existingTarget = fs.realpathSync(linkPath);
  return path.resolve(existingTarget) === path.resolve(target);
}

/**
 * @description 安全创建符号链接，处理已存在目录 / 链接 / dangling symlink 等边界条件
 * @param {string} target - 符号链接指向的源路径（绝对路径）
 * @param {string} linkPath - 要创建的符号链接路径（绝对路径）
 * @param {'dir'|'file'} kind - 链接类型，目录用 'dir'，文件用 'file'
 */
function ensureSymlink(target, linkPath, kind = 'dir') {
  if (!fs.existsSync(target)) {
    console.warn(`[sync-agents] 源路径不存在，跳过: ${target}`);
    return;
  }

  const stat = readLinkStat(linkPath);

  // 路径不存在 → 直接创建
  if (!stat) {
    fs.mkdirSync(path.dirname(linkPath), { recursive: true });
    createSymlink(target, linkPath, kind);
    return;
  }

  // 已是正确的符号链接 → 无需操作
  if (stat.isSymbolicLink() && isSymlinkCorrect(linkPath, target)) {
    return;
  }

  // 其他情况（错误链接 / 真实目录 / 文件）→ 删除后重建
  removeExistingEntry(stat, linkPath);
  createSymlink(target, linkPath, kind);
}

/**
 * @description 创建符号链接并打印日志
 *   目录链接：Windows 用 junction，Unix 用 dir
 *   文件链接：Windows 用 file，Unix 也用 file
 * @param {string} target - 链接目标路径
 * @param {string} linkPath - 链接路径
 * @param {'dir'|'file'} kind - 链接类型，目录用 'dir'，文件用 'file'
 */
function createSymlink(target, linkPath, kind = 'dir') {
  let linkType;
  if (kind === 'file') {
    linkType = 'file';
  } else {
    linkType = process.platform === 'win32' ? 'junction' : 'dir';
  }
  fs.symlinkSync(target, linkPath, linkType);
  console.log(`[sync-agents] 创建链接: ${linkPath} → ${target}`);
}

// ─── 同步单个子目录 ──────────────────────────────────────────

/**
 * @description 计算 packages/{dir} 下某个子目录的链接目标路径
 *   Windows junction 需绝对路径，Unix symlink 用相对路径更健壮
 * @param {string} dirName - 同步的子目录名（如 skills）
 * @param {string} subName - packages/{dir} 下的子目录名
 * @returns {string} 链接应指向的目标路径
 */
function computeLinkTarget(dirName, subName) {
  const pkgSubPath = path.join(ROOT, PKG_DIR_NAME, dirName, subName);
  if (process.platform === 'win32') return pkgSubPath;

  const agentsSubPath = path.join(ROOT, AGENTS_DIR_NAME, dirName, subName);
  return path.relative(path.dirname(agentsSubPath), pkgSubPath);
}

/**
 * @description 扫描 packages/{dir} 子目录，逐个在 .agents/{dir} 创建符号链接
 * @param {string} dirName - 同步的子目录名（如 skills）
 */
function injectPackageSubs(dirName) {
  const pkgDir = path.join(ROOT, PKG_DIR_NAME, dirName);
  if (!fs.existsSync(pkgDir)) return;

  const subDirs = fs
    .readdirSync(pkgDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const subName of subDirs) {
    const linkTarget = computeLinkTarget(dirName, subName);
    const linkPath = path.join(ROOT, AGENTS_DIR_NAME, dirName, subName);
    ensureSymlink(linkTarget, linkPath);
  }
}

/**
 * @description 对单个子目录执行完整同步：确保目录存在 → 链接到 .claude → 注入 packages
 * @param {string} dirName - 同步的子目录名（如 skills）
 */
function syncDir(dirName) {
  const agentsDir = path.join(ROOT, AGENTS_DIR_NAME, dirName);
  const claudeDir = path.join(ROOT, CLAUDE_DIR_NAME, dirName);

  // 确保 {AGENTS_DIR_NAME}/{dir} 存在
  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
    console.log(`[sync-agents] 创建目录: ${AGENTS_DIR_NAME}/${dirName}`);
  }

  // {CLAUDE_DIR_NAME}/{dir} → {AGENTS_DIR_NAME}/{dir}
  ensureSymlink(agentsDir, claudeDir);

  // {PKG_DIR_NAME}/{dir} 子目录注入 {AGENTS_DIR_NAME}/{dir}
  injectPackageSubs(dirName);
}

// ─── 同步根目录文件级符号链接 ───────────────────────────────────

/**
 * @description 文件级符号链接配置
 *   source: 源文件路径（相对于项目根目录）
 *   target: 链接文件路径（相对于项目根目录）
 * @type {{ source: string, target: string }[]}
 */
const FILE_SYMLINKS = [
  { source: 'AGENTS.md', target: 'CLAUDE.md' },
  { source: 'packages/docs/AGENTS.md', target: 'packages/docs/CLAUDE.md' },
  { source: 'packages/opendesign/AGENTS.md', target: 'packages/opendesign/CLAUDE.md' },
  { source: 'packages/scripts/AGENTS.md', target: 'packages/scripts/CLAUDE.md' },
];

for (const { source, target } of FILE_SYMLINKS) {
  const sourcePath = path.join(ROOT, source);
  const targetPath = path.join(ROOT, target);
  // 文件符号链接：Windows 用绝对路径，Unix 用相对路径更健壮
  const linkTarget = process.platform === 'win32' ? sourcePath : path.relative(path.dirname(targetPath), sourcePath);
  ensureSymlink(linkTarget, targetPath, 'file');
}

// ─── 主流程 ──────────────────────────────────────────────────

for (const dirName of SYNC_DIRS) {
  syncDir(dirName);
}
console.log('[sync-agents] ✅ 同步完成');
