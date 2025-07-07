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
    const apiMdPath = join(fullPath, `../__docs__/${pathMath[1]}-api.zh-CN.md`);
    let mdContent = `## API ${pathMath[1]}`;
    // props
    if (meta.props.length) {
      let propsData = meta.props
        .filter((prop) => !prop.global)
        .map((prop) => {
          return [
            prop.name,
            prop.type,
            prop.required ? '√' : '',
            prop.description,
            prop.tags.map((tag) => `^[${tag.name}]${tag.text ? `\`${tag.text}\`` : ''}`).join(' '),
          ];
        });
      propsData.unshift(['属性名', '类型', '必填', '说明', '其它']);
      propsData = cleanTableData(propsData);
      mdContent = `${mdContent}\n\n### props\n\n${markdownTable(propsData)}`;
    }
    // events
    if (meta.events.length) {
      let eventsData = meta.events.map((event) => {
        return [event.name, event.signature, event.description, event.tags.map((tag) => `^[${tag.name}]${tag.text ? `\`${tag.text}\`` : ''}`).join(' ')];
      });
      eventsData.unshift(['事件名', '签名', '说明', '其它']);
      eventsData = cleanTableData(eventsData);
      mdContent = `${mdContent}\n\n### events\n\n${markdownTable(eventsData)}`;
    }
    // slots
    if (meta.slots.length) {
      let slotsData = meta.slots.map((slot) => {
        return [slot.name, slot.type, slot.description];
      });
      slotsData.unshift(['插槽', '签名', '说明']);
      slotsData = cleanTableData(slotsData);
      mdContent = `${mdContent}\n\n### slots\n\n${markdownTable(slotsData)}`;
    }
    await fsp.mkdir(dirname(apiMdPath), { recursive: true }).then(() => fsp.writeFile(apiMdPath, mdContent, { encoding: 'utf-8' }));
  });
});
