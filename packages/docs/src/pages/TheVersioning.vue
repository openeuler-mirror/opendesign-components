<script setup lang="ts">
import { watchEffect } from 'vue';
import { OCard, OTag, useI18n } from '@opensig/opendesign';

const { t } = useI18n();

// 页面标题跟随语言切换（路由 meta 无 sidebar，需自行维护 document.title）
watchEffect(() => {
  document.title = `${t('versioning.title')} - OpenDesign`;
});

/**
 * @description 版本维护规则卡片数据（编号 / 标题 / 描述）
 */
const rules = [
  { title: '版本命名', desc: 'MAJOR.MINOR.PATCH-SUFFIX（语义化版本；SUFFIX 仅例外时启用）' },
  { title: '发布节奏', desc: '每 2 个月（最后一个工作日）发布一个新 MAJOR.MINOR；无 feature 则取消，版本号由下一版顺延使用' },
  { title: '维护周期', desc: '每个 MAJOR.MINOR 维护 6 个月；EOL 当天截止，同日新版接管' },
  { title: '补丁交付', desc: '每月月中为补丁发版节点（弱规定，可按需调整）；常规补丁以 PATCH 递增（1.3.0 → 1.3.1）' },
  { title: '常态水位', desc: '最多并行维护 3 个 MAJOR.MINOR（6 个月 ÷ 2 个月；版本取消时少于 3，接受缺口）' },
  { title: '过渡方案', desc: '1.2.5 / 1.2.7 为主力，1.2.6 停维迁移，1.3.0（GEO）为新节奏锚点' },
  { title: '紧急补丁', desc: '安全漏洞 / 阻断主流程的补丁不受月中节点约束，不影响常规节点' },
];

/**
 * @description 图例条目（label 为文案，class 对应色样样式）
 */
const legendItems = [
  { label: '过渡期主力版本（实际日期）', cls: 'sw-blue' },
  { label: 'GEO 版本 · 新节奏锚点', cls: 'sw-green' },
  { label: '预排版本', cls: 'sw-plan' },
  { label: '停止维护', cls: 'sw-gray' },
  { label: 'EOL 结束支持', cls: 'sw-eol' },
  { label: '方案启动线', cls: 'sw-launch' },
  { label: '并行上限 3', cls: 'sw-steady' },
  { label: '月中补丁节点（弱规定）', cls: 'sw-patch' },
];
</script>

<template>
  <div class="versioning">
    <h1 class="page-title">{{ t('versioning.title') }}</h1>
    <p class="subtitle">
      版本命名遵循语义化版本：<code>MAJOR.MINOR.PATCH-SUFFIX</code>（SUFFIX 仅例外时启用） · 每 2 个月（月末）发布一个新 MAJOR.MINOR · 每版维护 6 个月 ·
      每月月中为补丁发版节点（弱规定）
    </p>

    <!-- 规则卡片：编号圆 + 标题走 header 插槽，描述走 detail 插槽（OCard 标准排版） -->
    <div class="rules">
      <OCard v-for="rule in rules" :key="rule.title" :title="rule.title" :detail="rule.desc" />
    </div>

    <!-- 图例：色样与 SVG 图形共享同一套 token -->
    <div class="legend">
      <span v-for="item in legendItems" :key="item.cls" class="lg"> <i class="sw" :class="item.cls"></i>{{ item.label }} </span>
    </div>

    <!-- 版本节奏甘特图 + 并行版本数水位图（颜色全部走 opendesign token，随主题自动适配） -->
    <OCard class="chart-card">
      <div class="chart-scroll">
        <svg viewBox="0 0 1700 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="版本维护节奏甘特图与并行版本数水位图">
          <defs>
            <pattern id="hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" class="hatch-ln" />
            </pattern>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" class="mig-arrow" />
            </marker>
          </defs>
          <rect class="steady-tint" x="970" y="64" width="684" height="706" />
          <line class="grid" x1="210" y1="64" x2="210" y2="770" />
          <line class="grid-q" x1="286" y1="64" x2="286" y2="770" />
          <line class="grid" x1="362" y1="64" x2="362" y2="770" />
          <line class="grid" x1="438" y1="64" x2="438" y2="770" />
          <line class="grid-q" x1="514" y1="64" x2="514" y2="770" />
          <line class="grid" x1="590" y1="64" x2="590" y2="770" />
          <line class="grid" x1="666" y1="64" x2="666" y2="770" />
          <line class="grid-q" x1="742" y1="64" x2="742" y2="770" />
          <line class="grid" x1="818" y1="64" x2="818" y2="770" />
          <line class="grid" x1="894" y1="64" x2="894" y2="770" />
          <line class="grid-q" x1="970" y1="64" x2="970" y2="770" />
          <line class="grid" x1="1046" y1="64" x2="1046" y2="770" />
          <line class="grid" x1="1122" y1="64" x2="1122" y2="770" />
          <line class="grid-q" x1="1198" y1="64" x2="1198" y2="770" />
          <line class="grid" x1="1274" y1="64" x2="1274" y2="770" />
          <line class="grid" x1="1350" y1="64" x2="1350" y2="770" />
          <line class="grid-q" x1="1426" y1="64" x2="1426" y2="770" />
          <line class="grid" x1="1502" y1="64" x2="1502" y2="770" />
          <line class="grid" x1="1578" y1="64" x2="1578" y2="770" />
          <line class="grid-q" x1="1654" y1="64" x2="1654" y2="770" />
          <rect class="yearband" x="210" y="8" width="532" height="26" />
          <rect class="yearband" x="742" y="8" width="912" height="26" />
          <text class="t-year" x="218" y="25">2026</text>
          <text class="t-year" x="752" y="25">2027</text>
          <text class="t-launch" x="625.5" y="25" text-anchor="middle">新维护方案启动 · 2026/11</text>
          <text class="t-steady" x="1646" y="25" text-anchor="end">2027/03 起稳态 · 最多 3 版并行</text>
          <line class="launch-line" x1="625.5" y1="34" x2="625.5" y2="770" />
          <text class="t-month" x="248" y="56" text-anchor="middle">6</text>
          <text class="t-month" x="248" y="790" text-anchor="middle">6</text>
          <text class="t-month" x="324" y="56" text-anchor="middle">7</text>
          <text class="t-month" x="324" y="790" text-anchor="middle">7</text>
          <text class="t-month" x="400" y="56" text-anchor="middle">8</text>
          <text class="t-month" x="400" y="790" text-anchor="middle">8</text>
          <text class="t-month" x="476" y="56" text-anchor="middle">9</text>
          <text class="t-month" x="476" y="790" text-anchor="middle">9</text>
          <text class="t-month" x="552" y="56" text-anchor="middle">10</text>
          <text class="t-month" x="552" y="790" text-anchor="middle">10</text>
          <text class="t-month" x="628" y="56" text-anchor="middle">11</text>
          <text class="t-month" x="628" y="790" text-anchor="middle">11</text>
          <text class="t-month" x="704" y="56" text-anchor="middle">12</text>
          <text class="t-month" x="704" y="790" text-anchor="middle">12</text>
          <text class="t-month" x="780" y="56" text-anchor="middle">1</text>
          <text class="t-month" x="780" y="790" text-anchor="middle">1</text>
          <text class="t-month" x="856" y="56" text-anchor="middle">2</text>
          <text class="t-month" x="856" y="790" text-anchor="middle">2</text>
          <text class="t-month" x="932" y="56" text-anchor="middle">3</text>
          <text class="t-month" x="932" y="790" text-anchor="middle">3</text>
          <text class="t-month" x="1008" y="56" text-anchor="middle">4</text>
          <text class="t-month" x="1008" y="790" text-anchor="middle">4</text>
          <text class="t-month" x="1084" y="56" text-anchor="middle">5</text>
          <text class="t-month" x="1084" y="790" text-anchor="middle">5</text>
          <text class="t-month" x="1160" y="56" text-anchor="middle">6</text>
          <text class="t-month" x="1160" y="790" text-anchor="middle">6</text>
          <text class="t-month" x="1236" y="56" text-anchor="middle">7</text>
          <text class="t-month" x="1236" y="790" text-anchor="middle">7</text>
          <text class="t-month" x="1312" y="56" text-anchor="middle">8</text>
          <text class="t-month" x="1312" y="790" text-anchor="middle">8</text>
          <text class="t-month" x="1388" y="56" text-anchor="middle">9</text>
          <text class="t-month" x="1388" y="790" text-anchor="middle">9</text>
          <text class="t-month" x="1464" y="56" text-anchor="middle">10</text>
          <text class="t-month" x="1464" y="790" text-anchor="middle">10</text>
          <text class="t-month" x="1540" y="56" text-anchor="middle">11</text>
          <text class="t-month" x="1540" y="790" text-anchor="middle">11</text>
          <text class="t-month" x="1616" y="56" text-anchor="middle">12</text>
          <text class="t-month" x="1616" y="790" text-anchor="middle">12</text>
          <text class="t-month" x="24" y="56">版本</text>
          <line class="hairline" x1="16" y1="64" x2="1654" y2="64" />
          <line class="hairline" x1="16" y1="136" x2="1654" y2="136" />
          <line class="hairline" x1="16" y1="208" x2="1654" y2="208" />
          <line class="hairline" x1="16" y1="384" x2="1654" y2="384" />
          <line class="hairline" x1="16" y1="456" x2="1654" y2="456" />
          <line class="hairline" x1="16" y1="528" x2="1654" y2="528" />
          <line class="hairline" x1="16" y1="600" x2="1654" y2="600" />
          <line class="hairline" x1="16" y1="770" x2="1654" y2="770" />

          <!-- 1.2.5 · 过渡期主力 -->
          <text class="t-ver" x="24" y="98">1.2.5</text>
          <foreignObject x="24" y="102" width="150" height="24">
            <div class="tag-fo"><OTag color="primary" variant="outline" round="pill" size="medium">过渡 · 主力</OTag></div>
          </foreignObject>
          <rect class="bar-blue" x="283.5" y="78" width="458.5" height="34" rx="6" />
          <text class="ink-blue" x="512.7" y="100" text-anchor="middle">1.2.5 · 2026/06/30 → 2026/12/31 · 维护 6 个月</text>
          <circle class="dot-blue" cx="283.5" cy="95" r="5" />
          <rect class="eol-cap" x="740" y="78" width="5" height="34" rx="2" />
          <text class="t-eol" x="754" y="100">EOL</text>
          <path class="patch-dot patch-blue" d="M 321.5 73.5 L 326 78 L 321.5 82.5 L 317 78 Z" />
          <path class="patch-dot patch-blue" d="M 397.5 73.5 L 402 78 L 397.5 82.5 L 393 78 Z" />
          <path class="patch-dot patch-blue" d="M 473.5 73.5 L 478 78 L 473.5 82.5 L 469 78 Z" />
          <path class="patch-dot patch-blue" d="M 549.5 73.5 L 554 78 L 549.5 82.5 L 545 78 Z" />
          <path class="patch-dot patch-blue" d="M 625.5 73.5 L 630 78 L 625.5 82.5 L 621 78 Z" />
          <path class="patch-dot patch-blue" d="M 701.5 73.5 L 706 78 L 701.5 82.5 L 697 78 Z" />
          <text class="t-sub" x="283.5" y="128">首次发布 2026/06/30 · 过渡期主力版本</text>

          <!-- 1.2.6 · 停维迁移 -->
          <text class="t-ver" x="24" y="170">1.2.6</text>
          <foreignObject x="24" y="174" width="150" height="24">
            <div class="tag-fo"><OTag color="disabled" variant="outline" round="pill" size="medium">停维迁移</OTag></div>
          </foreignObject>
          <rect class="bar-gray" x="260" y="150" width="365.5" height="34" rx="6" />
          <text class="ink-gray" x="442.7" y="172" text-anchor="middle">1.2.6 · 无主要使用方</text>
          <line class="bar-gray-edge" x1="260" y1="150" x2="260" y2="184" />
          <rect class="eol-cap" x="623.5" y="150" width="5" height="34" rx="2" />
          <text class="t-eol" x="637.5" y="172">EOL</text>
          <text class="t-sub" x="260" y="200">方案启动后停止维护</text>

          <!-- 1.2.7 · 过渡期主力 -->
          <text class="t-ver" x="24" y="242">1.2.7</text>
          <foreignObject x="24" y="246" width="150" height="24">
            <div class="tag-fo"><OTag color="primary" variant="outline" round="pill" size="medium">过渡 · 主力</OTag></div>
          </foreignObject>
          <rect class="bar-blue" x="440.5" y="222" width="445.9" height="34" rx="6" />
          <text class="ink-blue" x="663.5" y="244" text-anchor="middle">1.2.7 · 2026/09/02 → 2027/02/28 · 约 6 个月</text>
          <circle class="dot-blue" cx="440.5" cy="239" r="5" />
          <rect class="eol-cap" x="884.4" y="222" width="5" height="34" rx="2" />
          <text class="t-eol" x="898.4" y="244">EOL</text>
          <path class="patch-dot patch-blue" d="M 473.5 217.5 L 478 222 L 473.5 226.5 L 469 222 Z" />
          <path class="patch-dot patch-blue" d="M 549.5 217.5 L 554 222 L 549.5 226.5 L 545 222 Z" />
          <path class="patch-dot patch-blue" d="M 625.5 217.5 L 630 222 L 625.5 226.5 L 621 222 Z" />
          <path class="patch-dot patch-blue" d="M 701.5 217.5 L 706 222 L 701.5 226.5 L 697 222 Z" />
          <path class="patch-dot patch-blue" d="M 777.5 217.5 L 782 222 L 777.5 226.5 L 773 222 Z" />
          <path class="patch-dot patch-blue" d="M 853.5 217.5 L 858 222 L 853.5 226.5 L 849 222 Z" />
          <text class="t-sub" x="440.5" y="272">首次发布 2026/09/02 · 维护约 6 个月</text>

          <!-- 1.3.0 · GEO 节奏锚点 -->
          <text class="t-ver" x="24" y="346">1.3.0</text>
          <foreignObject x="24" y="350" width="150" height="24">
            <div class="tag-fo"><OTag color="success" variant="outline" round="pill" size="medium">GEO · 节奏锚点</OTag></div>
          </foreignObject>
          <rect class="bar-green" x="625.5" y="326" width="496.5" height="34" rx="6" />
          <text class="ink-green" x="873.7" y="348" text-anchor="middle">1.3.0 · 2026/11/15 → 2027/05/31 · 维护 6.5 个月</text>
          <circle class="dot-green" cx="625.5" cy="343" r="5" />
          <rect class="eol-cap" x="1120" y="326" width="5" height="34" rx="2" />
          <text class="t-eol" x="1134" y="348">EOL</text>
          <path class="patch-dot patch-green" d="M 701.5 321.5 L 706 326 L 701.5 330.5 L 697 326 Z" />
          <path class="patch-dot patch-green" d="M 777.5 321.5 L 782 326 L 777.5 330.5 L 773 326 Z" />
          <path class="patch-dot patch-green" d="M 853.5 321.5 L 858 326 L 853.5 330.5 L 849 326 Z" />
          <path class="patch-dot patch-green" d="M 929.5 321.5 L 934 326 L 929.5 330.5 L 925 326 Z" />
          <path class="patch-dot patch-green" d="M 1005.5 321.5 L 1010 326 L 1005.5 330.5 L 1001 326 Z" />
          <path class="patch-dot patch-green" d="M 1081.5 321.5 L 1086 326 L 1081.5 330.5 L 1077 326 Z" />
          <text class="t-sub" x="625.5" y="376">GEO 优化版本 · 新节奏锚点 · 月中发布多享半个月维护</text>

          <!-- 1.4.0 · 预排 -->
          <text class="t-ver" x="24" y="418">1.4.0</text>
          <foreignObject x="24" y="422" width="150" height="24">
            <div class="tag-fo"><OTag color="pending" variant="outline" round="pill" size="medium">预排</OTag></div>
          </foreignObject>
          <rect class="bar-plan-bg" x="818" y="398" width="456" height="34" rx="6" />
          <rect class="bar-plan" x="818" y="398" width="456" height="34" rx="6" />
          <rect class="bar-plan-edge" x="818" y="398" width="456" height="34" rx="6" />
          <text class="ink-plan" x="1046" y="420" text-anchor="middle">1.4.0 · 2027/01/31 → 2027/07/31（预排）</text>
          <circle class="dot-plan" cx="818" cy="415" r="5" />
          <rect class="eol-cap" x="1272" y="398" width="5" height="34" rx="2" />
          <text class="t-eol" x="1286" y="420">EOL</text>
          <path class="patch-dot patch-plan" d="M 853.5 393.5 L 858 398 L 853.5 402.5 L 849 398 Z" />
          <path class="patch-dot patch-plan" d="M 929.5 393.5 L 934 398 L 929.5 402.5 L 925 398 Z" />
          <path class="patch-dot patch-plan" d="M 1005.5 393.5 L 1010 398 L 1005.5 402.5 L 1001 398 Z" />
          <path class="patch-dot patch-plan" d="M 1081.5 393.5 L 1086 398 L 1081.5 402.5 L 1077 398 Z" />
          <path class="patch-dot patch-plan" d="M 1157.5 393.5 L 1162 398 L 1157.5 402.5 L 1153 398 Z" />
          <path class="patch-dot patch-plan" d="M 1233.5 393.5 L 1238 398 L 1233.5 402.5 L 1229 398 Z" />
          <text class="t-sub" x="818" y="448">按节奏每 2 个月月末发布</text>

          <!-- 1.5.0 · 预排 -->
          <text class="t-ver" x="24" y="490">1.5.0</text>
          <foreignObject x="24" y="494" width="150" height="24">
            <div class="tag-fo"><OTag color="pending" variant="outline" round="pill" size="medium">预排</OTag></div>
          </foreignObject>
          <rect class="bar-plan-bg" x="970" y="470" width="453.5" height="34" rx="6" />
          <rect class="bar-plan" x="970" y="470" width="453.5" height="34" rx="6" />
          <rect class="bar-plan-edge" x="970" y="470" width="453.5" height="34" rx="6" />
          <text class="ink-plan" x="1196.7" y="492" text-anchor="middle">1.5.0 · 2027/03/31 → 2027/09/30（预排）</text>
          <circle class="dot-plan" cx="970" cy="487" r="5" />
          <rect class="eol-cap" x="1421.5" y="470" width="5" height="34" rx="2" />
          <text class="t-eol" x="1435.5" y="492">EOL</text>
          <path class="patch-dot patch-plan" d="M 1005.5 465.5 L 1010 470 L 1005.5 474.5 L 1001 470 Z" />
          <path class="patch-dot patch-plan" d="M 1081.5 465.5 L 1086 470 L 1081.5 474.5 L 1077 470 Z" />
          <path class="patch-dot patch-plan" d="M 1157.5 465.5 L 1162 470 L 1157.5 474.5 L 1153 470 Z" />
          <path class="patch-dot patch-plan" d="M 1233.5 465.5 L 1238 470 L 1233.5 474.5 L 1229 470 Z" />
          <path class="patch-dot patch-plan" d="M 1309.5 465.5 L 1314 470 L 1309.5 474.5 L 1305 470 Z" />
          <path class="patch-dot patch-plan" d="M 1385.5 465.5 L 1390 470 L 1385.5 474.5 L 1381 470 Z" />
          <text class="t-sub" x="970" y="520">按节奏每 2 个月月末发布</text>

          <!-- 1.6.0 · 预排 -->
          <text class="t-ver" x="24" y="562">1.6.0</text>
          <foreignObject x="24" y="566" width="150" height="24">
            <div class="tag-fo"><OTag color="pending" variant="outline" round="pill" size="medium">预排</OTag></div>
          </foreignObject>
          <rect class="bar-plan-bg" x="1122" y="542" width="453.5" height="34" rx="6" />
          <rect class="bar-plan" x="1122" y="542" width="453.5" height="34" rx="6" />
          <rect class="bar-plan-edge" x="1122" y="542" width="453.5" height="34" rx="6" />
          <text class="ink-plan" x="1348.7" y="564" text-anchor="middle">1.6.0 · 2027/05/31 → 2027/11/30（预排）</text>
          <circle class="dot-plan" cx="1122" cy="559" r="5" />
          <rect class="eol-cap" x="1573.5" y="542" width="5" height="34" rx="2" />
          <text class="t-eol" x="1587.5" y="564">EOL</text>
          <path class="patch-dot patch-plan" d="M 1157.5 537.5 L 1162 542 L 1157.5 546.5 L 1153 542 Z" />
          <path class="patch-dot patch-plan" d="M 1233.5 537.5 L 1238 542 L 1233.5 546.5 L 1229 542 Z" />
          <path class="patch-dot patch-plan" d="M 1309.5 537.5 L 1314 542 L 1309.5 546.5 L 1305 542 Z" />
          <path class="patch-dot patch-plan" d="M 1385.5 537.5 L 1390 542 L 1385.5 546.5 L 1381 542 Z" />
          <path class="patch-dot patch-plan" d="M 1461.5 537.5 L 1466 542 L 1461.5 546.5 L 1457 542 Z" />
          <path class="patch-dot patch-plan" d="M 1537.5 537.5 L 1542 542 L 1537.5 546.5 L 1533 542 Z" />
          <text class="t-sub" x="1122" y="592">按节奏每 2 个月月末发布</text>

          <text class="t-sub" x="805" y="95">◇ 月中补丁节点（弱规定）· 避免补丁发版无时间规律</text>
          <line class="hairline dash" x1="16" y1="296" x2="1654" y2="296" />
          <text class="t-div" x="932" y="309" text-anchor="middle">新维护节奏 · 以 1.3.0 为锚点，每 2 个月发布一个 MAJOR.MINOR</text>
          <path class="mig" d="M 625.5 186 C 605 214, 520 200, 455 221" marker-end="url(#arrow)" />
          <text class="t-launch" x="565" y="212" text-anchor="middle">迁移至 1.2.7-x</text>

          <!-- 并行版本数水位图 -->
          <text class="t-h" x="24" y="618">并行维护的 MAJOR.MINOR 版本数</text>
          <text class="t-month" x="200" y="774" text-anchor="end">0</text>
          <text class="t-month" x="200" y="741" text-anchor="end">1</text>
          <text class="t-month" x="200" y="708" text-anchor="end">2</text>
          <text class="t-month" x="200" y="675" text-anchor="end">3</text>
          <text class="t-month" x="200" y="642" text-anchor="end">4</text>
          <line class="steady-line" x1="210" y1="671" x2="1654" y2="671" />
          <text class="t-steady" x="1646" y="663" text-anchor="end">并行上限 3</text>
          <path
            class="step-area"
            d="M 210 770 L 283.5 770 L 283.5 737 L 440.5 737 L 440.5 704 L 625.5 704 L 625.5 671 L 742 671 L 742 704 L 818 704 L 818 671 L 886.4 671 L 886.4 704 L 970 704 L 970 671 L 1654 671 L 1654 770 L 210 770 Z"
          />
          <path
            class="step-line"
            d="M 210 770 L 283.5 770 L 283.5 737 L 440.5 737 L 440.5 704 L 625.5 704 L 625.5 671 L 742 671 L 742 704 L 818 704 L 818 671 L 886.4 671 L 886.4 704 L 970 704 L 970 671 L 1654 671"
          />
          <text class="t-stepnum" x="362" y="725" text-anchor="middle">1</text>
          <text class="t-stepnum" x="533" y="692" text-anchor="middle">2</text>
          <text class="t-stepnum" x="683.7" y="659" text-anchor="middle">3</text>
          <text class="t-stepnum" x="780" y="692" text-anchor="middle">2</text>
          <text class="t-stepnum" x="852.2" y="659" text-anchor="middle">3</text>
          <text class="t-stepnum" x="928.2" y="692" text-anchor="middle">2</text>
          <text class="t-stepnum" x="1312" y="659" text-anchor="middle">3（稳态）</text>
          <text class="t-sub" x="858" y="724" text-anchor="middle">过渡期波动</text>
        </svg>
      </div>
    </OCard>

    <ul class="notes">
      <li>
        <b>过渡期版本：</b>1.2.5 维护 6 个月（2026/06/30 → 2026/12/31）；1.2.7 维护约 6 个月（2026/09/02 → 2027/02/28）；1.2.6
        无主要使用方，方案启动后停止维护，引导迁移至 1.2.7-x（图中左端虚线表示无固定起点）。
      </li>
      <li>
        <b>发布节奏：</b>MAJOR.MINOR 于每 2 个月的最后一个工作日发布（图中按月末示意）；1.3.0 为 GEO 优化版本，2026/11
        中旬发布、作为新节奏锚点，因月中发布维护窗口多出半个月（EOL 2027/05/31）；1.4.0 及之后均为预排。
      </li>
      <li>
        <b>补丁节点：</b>为避免补丁发版完全无时间规律，每月月中设一个补丁发版节点，为弱规定——当月无补丁需求则跳过、可按实际情况调整。常规补丁以 PATCH
        递增（1.3.0 → 1.3.1）；过渡期 1.2.5 / 1.2.7 因 PATCH 号历史上均为独立版本，补丁沿用 -x
        形式（1.2.5-1）。发版计划按「前一月定后一月」滚动确定。图中以条形上沿的空心菱形 ◇ 标注（落在维护窗口内的每月月中均设节点）。
      </li>
      <li>
        <b>水位解读：</b>过渡期（2026/11 – 2027/03）并行版本数在 2–3 之间波动；2027/03/31（1.5.0 发布）起进入稳态，按预排恒为 3（若某版本因无 feature
        取消，则当期少于 3，故规则口径为「最多并行 3 个」）；2027/05/31 出现同日交接（1.3.0 EOL / 1.6.0 发布），EOL 当天截止维护、新版同日接管，水位不受影响。
      </li>
      <li>
        <b>取消规则：</b>若某发布窗口无 feature，该 MAJOR.MINOR 取消；版本号不跳过，由下一个实际发布的版本顺延使用（版本号与时间窗口无强绑定，图中 1.4.0
        及之后为预排编号）。
      </li>
      <li>
        <b>MAJOR 版本：</b>破坏性变更（如 2.0.0）占用最近的常规发布窗口，不临时加塞；MAJOR 变更后 MINOR 自 0 重新计数，按 2.1.0、2.2.0 继续每 2 个月一版。
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.versioning {
  font-family: var(--o-font_family);
  color: var(--o-color-info1);
  padding: var(--o-r-gap-6) var(--o-r-gap-5) var(--o-r-gap-8);
}

.page-title {
  font-size: var(--o-r-font_size-h2);
  line-height: var(--o-r-line_height-h2);
  font-weight: var(--o-font_weight-semibold);
  margin: 0 0 var(--o-r-gap-1);
}

.subtitle {
  color: var(--o-color-info3);
  font-size: var(--o-r-font_size-tip1);
  line-height: var(--o-r-line_height-tip1);
  margin: 0 0 var(--o-r-gap-5);

  code {
    font-family: var(--o-font_family-code);
    background-color: var(--o-color-fill3);
    padding: 2px var(--o-gap-2);
    border-radius: var(--o-radius-xs);
  }
}

/* ---- 规则卡片 ---- */
.rules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--o-r-gap-3);
  margin-bottom: var(--o-r-gap-4);
}

/* ---- 图例 ---- */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--o-r-gap-3) var(--o-r-gap-5);
  align-items: center;
  margin: 0 0 var(--o-r-gap-3);
  font-size: var(--o-r-font_size-tip2);
  line-height: var(--o-r-line_height-tip2);
  color: var(--o-color-info3);
}

.lg {
  display: inline-flex;
  align-items: center;
  gap: var(--o-gap-2);
}

.sw {
  display: inline-block;
  width: 18px;
  height: 12px;
  border-radius: var(--o-radius-xs);
}

.sw-blue {
  background: var(--o-color-primary1);
}

.sw-green {
  background: var(--o-color-success1);
}

.sw-plan {
  background: repeating-linear-gradient(45deg, transparent, transparent 3px, var(--o-color-auxiliary6) 3px, var(--o-color-auxiliary6) 5px);
  border: 1px solid var(--o-color-auxiliary6);
}

.sw-gray {
  background: var(--o-color-info4);
  opacity: 0.55;
}

.sw-eol {
  width: auto;
  height: auto;
  background: none;
  color: var(--o-color-danger1);
  font-weight: var(--o-font_weight-bold);
  font-size: var(--o-font_size-tip2);
}

.sw-launch {
  width: 22px;
  height: 0;
  background: none;
  border-top: 2px dashed var(--o-color-auxiliary2);
  border-radius: 0;
}

.sw-steady {
  width: 22px;
  height: 0;
  background: none;
  border-top: 2px dashed var(--o-color-success3);
  border-radius: 0;
}

.sw-patch {
  width: 9px;
  height: 9px;
  background: var(--o-color-fill2);
  border: 1.5px solid var(--o-color-info3);
  transform: rotate(45deg);
  border-radius: 2px;
}

/* ---- 图表卡片 ---- */
.chart-scroll {
  overflow-x: auto;
}

svg {
  display: block;
  min-width: 1700px;
  width: 100%;
  height: auto;
}

/* foreignObject 内的 OTag 垂直居中 */
.tag-fo {
  height: 100%;
  display: flex;
  align-items: center;
}

/* ---- SVG 元素样式（字号保持像素值以维持 1700px 画布的手工对位） ---- */
text {
  font-family: inherit;
}

.grid {
  stroke: var(--o-color-control4);
  stroke-width: 1;
}

.grid-q {
  stroke: var(--o-color-control1);
  stroke-width: 1;
}

.hairline {
  stroke: var(--o-color-control1);
  stroke-width: 1;

  &.dash {
    stroke-dasharray: 5 5;
  }
}

.yearband {
  fill: var(--o-color-fill3);
}

.t-year {
  font-size: 13px;
  font-weight: 600;
  fill: var(--o-color-info3);
}

.t-month {
  font-size: 12px;
  fill: var(--o-color-info3);
}

.t-ver {
  font-size: 17px;
  font-weight: 700;
  fill: var(--o-color-info1);
}

.t-sub {
  font-size: 12px;
  fill: var(--o-color-info3);
}

/* 甘特条上的文字：反色文字 token（浅色模式白字 / 深色模式黑字，随条形明暗自适应） */
.t-bar,
.ink-blue,
.ink-green {
  fill: var(--o-color-info1-inverse);
  font-size: 13px;
}

.ink-plan {
  fill: var(--o-color-info1);
  font-size: 13px;
}

.ink-gray {
  fill: var(--o-color-info2);
  font-size: 13px;
}

.t-eol {
  font-size: 12px;
  font-weight: 700;
  fill: var(--o-color-danger1);
}

.t-launch {
  font-size: 12px;
  font-weight: 600;
  fill: var(--o-color-auxiliary2);
}

.t-steady {
  font-size: 12px;
  font-weight: 600;
  fill: var(--o-color-success3);
}

.t-div {
  font-size: 13px;
  fill: var(--o-color-info3);
}

.t-h {
  font-size: 14px;
  font-weight: 700;
  fill: var(--o-color-info1);
}

.t-stepnum {
  font-size: 12px;
  font-weight: 700;
  fill: var(--o-color-auxiliary2);
}

.bar-blue {
  fill: var(--o-color-primary1);
}

.bar-green {
  fill: var(--o-color-success1);
}

.bar-gray {
  fill: var(--o-color-info4);
  opacity: 0.5;
}

.bar-gray-edge {
  stroke: var(--o-color-info4);
  stroke-width: 2;
  stroke-dasharray: 4 3;
}

.bar-plan {
  fill: url(#hatch);
}

.bar-plan-bg {
  fill: var(--o-color-auxiliary6);
  opacity: 0.07;
}

.bar-plan-edge {
  stroke: var(--o-color-auxiliary6);
  stroke-width: 1.5;
  fill: none;
}

.hatch-ln {
  stroke: var(--o-color-auxiliary6);
  stroke-width: 2;
  opacity: 0.55;
}

.dot-blue {
  fill: var(--o-color-fill2);
  stroke: var(--o-color-primary1);
  stroke-width: 2.5;
}

.dot-green {
  fill: var(--o-color-fill2);
  stroke: var(--o-color-success1);
  stroke-width: 2.5;
}

.dot-plan {
  fill: var(--o-color-fill2);
  stroke: var(--o-color-auxiliary6);
  stroke-width: 2.5;
}

.eol-cap {
  fill: var(--o-color-danger1);
}

.launch-line {
  stroke: var(--o-color-auxiliary2);
  stroke-width: 1.5;
  stroke-dasharray: 6 5;
}

.steady-line {
  stroke: var(--o-color-success3);
  stroke-width: 1.5;
  stroke-dasharray: 4 4;
}

/* 稳态区域底纹：成功色低透明度铺底 */
.steady-tint {
  fill: var(--o-color-success1);
  fill-opacity: 0.05;
}

.step-line {
  stroke: var(--o-color-auxiliary2);
  stroke-width: 2;
  fill: none;
}

.step-area {
  fill: var(--o-color-auxiliary2);
  opacity: 0.1;
}

.mig {
  stroke: var(--o-color-auxiliary2);
  stroke-width: 1.5;
  fill: none;
  stroke-dasharray: 3 3;
}

.mig-arrow {
  fill: var(--o-color-auxiliary2);
}

.patch-dot {
  fill: var(--o-color-fill2);
  stroke-width: 1.5;
}

.patch-blue {
  stroke: var(--o-color-primary1);
}

.patch-green {
  stroke: var(--o-color-success1);
}

.patch-plan {
  stroke: var(--o-color-auxiliary6);
}

/* ---- 注释 ---- */
.notes {
  margin: var(--o-r-gap-5) var(--o-r-gap-1) 0;
  font-size: var(--o-r-font_size-tip1);
  line-height: 1.9;
  color: var(--o-color-info3);

  li {
    margin-bottom: var(--o-gap-1);
  }

  b {
    color: var(--o-color-info1);
    font-weight: var(--o-font_weight-semibold);
  }
}
</style>
