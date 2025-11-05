import { glob } from 'glob';
import { fileURLToPath } from 'url';
import fsp from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { type ComponentMeta, createChecker } from 'vue-component-meta';
import { parseMulti } from 'vue-docgen-api';
import parseSlotsAndExpose from './parseSlotsAndExpose';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const base = join(__dirname, '../../opendesign/');
const srcDir = join(base, 'src');
const tsConfigPath = join(base, 'tsconfig.app.json');

const checker = createChecker(tsConfigPath, {
  forceUseTs: true,
  noDeclarations: true,
  printer: { newLine: 1 },
});
const CELL_REPLACEMENTS = {
  // 避免xss注入
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  // unplugin-vue-markdown 插件不能正确处理单引号
  "'": '&apos;',
  // 竖线符号在markdown中会被解析为表格分隔符
  '|': '&vert;',
  // 表格中有换行符破坏markdown表格结构
  '\r': '',
  '\n': '<br />',
};
function replaceCellChar(ch: string) {
  return CELL_REPLACEMENTS[ch];
}
function escapeTableValue(value?: string) {
  const CELL_ESCAPE_REPLACE_RE = /[<>"'|\r\n]/g;
  return value ? value.replace(CELL_ESCAPE_REPLACE_RE, replaceCellChar) : '';
}
function escapeInlineCode(value: string) {
  return value.replace(/`/g, '\\`');
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
  code += `| ${table[0].join(' | ')} |\n`;
  code += `| ${table[0].map(() => '---').join(' | ')} |\n`;
  // body
  for (let i = 1; i < table.length; i++) {
    code += `| ${table[i].join(' | ')} |\n`;
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
    return;
  }

  try {
    const parsedComponentDocs = await parseMulti(filename, { modules: [srcDir], nameFilter: ['default'] });
    componentMeta.events = componentMeta.events.map((event) => {
      const parsedEvent = parsedComponentDocs[0].events.find((item) => item.name === event.name);

      if (parsedEvent) {
        event.description = parsedEvent.description;
      }

      return event;
    });
  } catch {
    // noop
  }
}
/**
 * 补充 vue-component-meta 未能解析 defineSlots 的描述和签名
 * @param filePath 待解析的vue文件
 * @param componentMeta vue组件元数据
 * @returns 新的组件元数据
 */
async function applyTempFixForSlotAndExpose(filePath: string, componentMeta: ComponentMeta) {
  const { slots: slotMeta, exposes } = await parseSlotsAndExpose(filePath);

  slotMeta.forEach((slot) => {
    const meta = componentMeta.slots.find((item) => item.name === slot.name);
    if (meta) {
      meta.description = slot.description;
      meta.type = slot.type;
    } else {
      componentMeta.slots.push(slot);
    }
  });
  const exposed = exposes.map((expose) => componentMeta.exposed.find((item) => item.name === expose));
  componentMeta.exposed.length = 0;
  componentMeta.exposed.push(...exposed);
}
const pathReg = /\/(O.*)\.vue/;
const tagTypes = {
  deprecated: '(warning)',
};
const exposeDesReg = /^\s*expose:([\s\S]+)/;
console.time('GenerateApi done');
const promise = glob('*/O*.vue', { cwd: srcDir, posix: true }).then((files) => {
  const promises = files.map(async (file) => {
    const fullPath = join(srcDir, file);
    // 解析Vue组件Api元数据
    const meta = checker.getComponentMeta(fullPath);

    await applyTempFixForEventDescriptions(fullPath, meta);
    await applyTempFixForSlotAndExpose(fullPath, meta);
    const pathMath = file.match(pathReg);
    for (const lang of ['zh-CN', 'en-US']) {
      const apiMdPath = join(fullPath, `../__docs__/${pathMath[1]}-api.${lang}.md`);
      let mdContent = `### ${pathMath[1]}`;
      // props
      const selfProps = meta.props.filter((prop) => !prop.global);
      if (selfProps.length) {
        const tableHeader = {
          'zh-CN': ['属性名', '类型', '默认值', '必填', '说明', '其它'],
          'en-US': ['Prop Name', 'Type', 'Default', 'Required', 'Description', 'Other'],
        };
        const excludeTag = ['default', 'zh-CN', 'en-US'];
        let propsData = selfProps.map((prop) => {
          return [
            escapeInlineCode(prop.name),
            escapeInlineCode(prop.type),
            prop.default || prop.tags.find((tag) => tag.name === 'default')?.text || '',
            prop.required ? '🗸' : '',
            prop.tags.find((tag) => tag.name === lang)?.text || prop.description || '',
            prop.tags
              .filter((tag) => !excludeTag.includes(tag.name))
              .map((tag) => `^[${tag.name}]${tagTypes[tag.name] || ''}${tag.text ? `\`${tag.text}\`` : ''}`)
              .join(' '),
          ];
        });
        propsData.unshift(tableHeader[lang]);
        propsData = cleanTableData(propsData);
        mdContent = `${mdContent}\n\n#### props\n\n${markdownTable(propsData)}`;
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
            escapeInlineCode(event.name),
            escapeInlineCode(event.signature),
            event.tags.find((tag) => tag.name === lang)?.text || event.description || '',
            event.tags
              .filter((tag) => !excludeTag.includes(tag.name))
              .map((tag) => `^[${tag.name}]${tagTypes[tag.name] || ''}${tag.text ? `\`${tag.text}\`` : ''}`)
              .join(' '),
          ];
        });
        eventsData.unshift(tableHeader[lang]);
        eventsData = cleanTableData(eventsData);
        mdContent = `${mdContent}\n\n#### events\n\n${markdownTable(eventsData)}`;
      }
      // slots
      if (meta.slots.length) {
        const tableHeader = {
          'zh-CN': ['插槽', '签名', '说明'],
          'en-US': ['Slot Name', 'Signature', 'Description'],
        };
        let slotsData = meta.slots.map((slot) => {
          return [escapeInlineCode(slot.name), escapeInlineCode(slot.type), slot.description];
        });
        slotsData.unshift(tableHeader[lang]);
        slotsData = cleanTableData(slotsData);
        mdContent = `${mdContent}\n\n#### slots\n\n${markdownTable(slotsData)}`;
      }
      // expose
      if (meta.exposed.length) {
        const tableHeader = {
          'zh-CN': ['名称', '类型', '说明'],
          'en-US': ['Name', 'Type', 'Description'],
        };
        let exposeData = meta.exposed.map((expose) => {
          return [escapeInlineCode(expose.name), escapeInlineCode(expose.type), expose.description];
        });
        exposeData.unshift(tableHeader[lang]);
        exposeData = cleanTableData(exposeData);
        mdContent = `${mdContent}\n\n#### expose\n\n${markdownTable(exposeData)}`;
      }
      await fsp.mkdir(dirname(apiMdPath), { recursive: true }).then(() => fsp.writeFile(apiMdPath, mdContent, { encoding: 'utf-8' }));
    }
  });
  return Promise.all(promises);
});
promise.finally(() => {
  console.timeEnd('GenerateApi done');
});
