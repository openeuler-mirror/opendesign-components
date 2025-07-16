import { glob } from 'glob';
import { fileURLToPath } from 'url';
import fsp from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { type ComponentMeta, createChecker } from 'vue-component-meta';
import { parseMulti } from 'vue-docgen-api';
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';
import parseDefineSlots from './parseDefineSlots';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const base = join(__dirname, '../../opendesign/');
const srcDir = join(base, 'src');
const tsConfigPath = join(base, 'tsconfig.json');

const checker = createChecker(tsConfigPath, {
  forceUseTs: true,
  noDeclarations: true,
  printer: { newLine: 1 },
});
function escapeTableValue(value?: string) {
  return escapeHtml(value ? value.replace(/\|/g, '\\|') : '');
}
function cleanTableData(table: any[][]) {
  // 清理表格数据
  table.forEach((row) => {
    row.forEach((cell, cellIdx) => {
      row[cellIdx] = escapeTableValue(cell);
    });
  });
  // 删除空列
  const columnCount = table[0].length;
  const emptyIndexes = Array(columnCount).fill(true);
  for (let i = 0; i < columnCount; i++) {
    for (let j = 1; j < table.length; j++) {
      if (table[j][i]) {
        emptyIndexes[i] = false;
        break;
      }
    }
  }
  return table.map((row) => row.filter((_, i) => !emptyIndexes[i]));
}
/**
 * 将数组渲染为markdown表格
 * @param table 待处理的表格数据
 * @returns markdown表格
 */
function markdownTable(table: string[][]) {
  let code = '';
  // head
  code += '| ' + table[0].join(' | ') + ' |\n';
  code += '| ' + table[0].map(() => '---').join(' | ') + ' |\n';
  // body
  for (let i = 1; i < table.length; i++) {
    code += '| ' + table[i].join(' | ') + ' |\n';
  }
  return code;
}
/**
 * 通过vue-docgen-api库补充vue-component-meta库未能获取的Event描述
 * @param filename 待解析的vue文件
 * @param componentMeta
 * @returns
 */
async function applyTempFixForEventDescriptions(filename: string, componentMeta: ComponentMeta) {
  const hasEvents = componentMeta.events.length;

  if (!hasEvents) {
    return componentMeta;
  }

  try {
    const parsedComponentDocs = await parseMulti(filename, { modules: [srcDir], nameFilter: ['default'] });
    componentMeta.events = componentMeta.events.map((event) => {
      const parsedEvent = parsedComponentDocs[0].events.find((parsedEvent) => parsedEvent.name === event.name);

      if (parsedEvent) {
        event.description = parsedEvent.description;
      }

      return event;
    });
  } catch {
    // noop
  }
  return componentMeta;
}
/**
 * 补充 vue-component-meta 未能解析 defineSlots 的描述和签名
 * @param filename 待解析的vue文件
 * @param componentMeta vue组件元数据
 * @returns 新的组件元数据
 */
async function applyTempFixForSlot(filename: string, componentMeta: ComponentMeta) {
  debugger;
  const slotReg = /defineSlots<{[^}]+}>\(\)/;
  const slotMatch = slotReg.exec(await fsp.readFile(filename, 'utf-8'));
  if (!slotMatch) {
    return componentMeta;
  }
  const slotMeta = parseDefineSlots(slotMatch[0]);
  const slots = componentMeta.slots.map((slot) => {
    const parsedSlot = slotMeta.find((s) => s.name === slot.name);
    if (parsedSlot) {
      slot.description = parsedSlot.docs.description;
      slot.type = parsedSlot.type;
    }
    return slot;
  });
  return {
    ...componentMeta,
    slots,
  };
}
const terminalWidth = process.stdout.columns || 80;
const progressBarLength = Math.min(Math.floor(terminalWidth / 4), 30);
const pathReg = /\/(O.*)\.vue/;
glob('*/O*.vue', { cwd: srcDir, posix: true }).then((files) => {
  files.forEach(async (file, index) => {
    const fullPath = join(srcDir, file);
    // 解析Vue组件Api元数据
    const meta = checker.getComponentMeta(fullPath);
    const completedCount = Math.floor(((index + 1) / files.length) * progressBarLength);
    const restCount = progressBarLength - completedCount;
    const progressBar = `${'█'.repeat(completedCount)}${' '.repeat(restCount)}`;
    const percent = (((index + 1) / files.length) * 100).toFixed(0);

    // 输出进度条
    process.stdout.write(`\r[${progressBar}] ${percent}%`);
    await applyTempFixForEventDescriptions(fullPath, meta);
    await applyTempFixForSlot(fullPath, meta);
    const pathMath = file.match(pathReg);
    for (const lang of ['zh-CN', 'en-US']) {
      const apiMdPath = join(fullPath, `../__docs__/${pathMath[1]}-api.${lang}.md`);
      let mdContent = `## API ${pathMath[1]}`;
      // props
      if (meta.props.length) {
        const tableHeader = {
          'zh-CN': ['属性名', '类型', '默认值', '必填', '说明', '其它'],
          'en-US': ['Prop Name', 'Type', 'Default', 'Required', 'Description', 'Other'],
        };
        const excludeTag = ['default', 'zh-CN', 'en-US'];
        let propsData = meta.props
          .filter((prop) => !prop.global)
          .map((prop) => {
            return [
              prop.name,
              prop.type,
              prop.default || prop.tags.find((tag) => tag.name === 'default')?.text || '',
              prop.required ? '🗸' : '',
              prop.tags.find((tag) => tag.name === lang)?.text || prop.description || '',
              prop.tags
                .filter((tag) => !excludeTag.includes(tag.name))
                .map((tag) => `^[${tag.name}]${tag.text ? `\`${tag.text}\`` : ''}`)
                .join(' '),
            ];
          });
        propsData.unshift(tableHeader[lang]);
        propsData = cleanTableData(propsData);
        mdContent = `${mdContent}\n\n### props\n\n${markdownTable(propsData)}`;
      }
      // events
      if (meta.events.length) {
        const tableHeader = {
          'zh-CN': ['事件名', '签名', '说明', '其它'],
          'en-US': ['Event Name', 'Signature', 'Description', 'Other'],
        };
        const excludeTag = ['zh-CN', 'en-US'];
        let eventsData = meta.events.map((event) => {
          return [
            event.name,
            event.signature,
            event.tags.find((tag) => tag.name === lang)?.text || event.description || '',
            event.tags
              .filter((tag) => !excludeTag.includes(tag.name))
              .map((tag) => `^[${tag.name}]${tag.text ? `\`${tag.text}\`` : ''}`)
              .join(' '),
          ];
        });
        eventsData.unshift(tableHeader[lang]);
        eventsData = cleanTableData(eventsData);
        mdContent = `${mdContent}\n\n### events\n\n${markdownTable(eventsData)}`;
      }
      // slots
      if (meta.slots.length) {
        const tableHeader = {
          'zh-CN': ['插槽', '签名', '说明'],
          'en-US': ['Slot Name', 'Signature', 'Description'],
        };
        let slotsData = meta.slots.map((slot) => {
          return [slot.name, slot.type, slot.description];
        });
        slotsData.unshift(tableHeader[lang]);
        slotsData = cleanTableData(slotsData);
        mdContent = `${mdContent}\n\n### slots\n\n${markdownTable(slotsData)}`;
      }
      await fsp.mkdir(dirname(apiMdPath), { recursive: true }).then(() => fsp.writeFile(apiMdPath, mdContent, { encoding: 'utf-8' }));
    }
  });
});
