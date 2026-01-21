import { Project, SyntaxKind, ScriptTarget, type TypeNode, type JSDoc, type Node} from 'ts-morph';
import { promises as fsp } from 'node:fs';
import { parse } from '@vue/compiler-sfc';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const tsConfigFilePath = join(fileURLToPath(import.meta.url), '../../../opendesign', 'tsconfig.app.json');
interface Definition {
  name: string;
  type: string;
  description: string;
  tags: {
    name: string;
    text: string;
  }[];
  schema: string;
  declarations: Array<{ file: string; range: [number, number] }>;
}
const project = new Project({
  compilerOptions: {
    strict: true,
    target: ScriptTarget.Latest,
    allowJs: true,
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
  },
  tsConfigFilePath,
});
function parseDoc(jsDocs: JSDoc[]) {
  const description = jsDocs
    .map((doc) => doc.getDescription())
    .join('\n')
    .trim();
  const tags: { name: string; text: string }[] = [];
  jsDocs.forEach((doc) => {
    doc.getTags().forEach((tag) => {
      tags.push({ name: tag.getTagName(), text: tag.getText() });
    });
  });
  return { description, tags };
}
const importReg = /import\([^)]+\)\./g;
function getTypeText(node: Node) {
  return node.getType().getApparentType().getText().replace(importReg, '');
}
function parseTypeArg(typeArg: TypeNode, slots: Definition[]) {
  if (typeArg.isKind(SyntaxKind.TypeLiteral)) {
    for (const member of typeArg.getMembers()) {
      let name = '';
      let type = '';
      let isParsed = false;
      if (member.isKind(SyntaxKind.PropertySignature)) {
        // 属性签名 propertyName: type
        name = member.getName();
        type = getTypeText(member);
        isParsed = true;
      } else if (member.isKind(SyntaxKind.MethodSignature)) {
        // 方法签名 methodName(paramName: type): type
        name = member.getName();
        type = getTypeText(member);
        isParsed = true;
      } else if (member.isKind(SyntaxKind.IndexSignature)) {
        // 索引签名 [key: keyType]: type
        name = member.getKeyType().getText();
        type = member.getSignature().getDeclaration().getText();
        isParsed = true;
      }
      if (isParsed) {
        const { description, tags } = parseDoc(member.getJsDocs());
        slots.push({ name, type, description, tags, schema: '', declarations: [] });
      }
    }
  }
}
function parseParams(node: Node, exposes: string[]) {
  node
    .getType()
    .getProperties()
    .forEach((prop) => {
      exposes.push(prop.getName());
    });
}
export default async function parseSlotsAndExpose(filePath: string) {
  const slots: Definition[] = [];
  const exposes: string[] = [];
  const content = await fsp.readFile(filePath, 'utf-8');
  const { descriptor } = parse(content);
  if (!descriptor.scriptSetup && !descriptor.script) {
    return { slots, exposes };
  }
  const code = `${descriptor.script?.content || ''}\n;${descriptor.scriptSetup?.content || ''}`;
  const s = project.createSourceFile(`${filePath}.script.ts`, code);

  const callExpressions = s.getDescendantsOfKind(SyntaxKind.CallExpression);
  for (const callExpression of callExpressions) {
    const funName = callExpression.getExpression()?.getText();
    if (funName === 'defineSlots') {
      const typeArg = callExpression.getTypeArguments()[0];
      parseTypeArg(typeArg, slots);
    } else if (funName === 'defineExpose') {
      const parma = callExpression.getArguments()[0];
      parseParams(parma, exposes);
    }
  }
  return { slots, exposes };
}
