import ts from 'typescript';

interface SlotDefinition {
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

function parseDoc(jsDoc: ts.Node[] | undefined, sourceFile: ts.SourceFile) {
  const docs = { description: '', tags: [] as { name: string; text: string }[] };
  if (!jsDoc) {
    return docs;
  }
  docs.description = jsDoc
    .map((doc) => {
      let comment = doc.getText(sourceFile);
      // 清理注释格式
      comment = comment
        .replace(/\/\*\*|\*\//g, '')
        .replace(/^\s*\*\s?/gm, '')
        .replace(/@([a-zA-Z]+)\s+(.*)/gm, (_: string, paramName: string, paramValue: string) => {
          docs.tags.push({
            name: paramName,
            text: paramValue || '',
          });
          return '';
        })
        .trim();
      return comment;
    })
    .join('\n');
  return docs;
}
function parseTypeArg(typeArg: ts.TypeNode, sourceFile: ts.SourceFile, slots: SlotDefinition[]) {
  if (ts.isTypeLiteralNode(typeArg)) {
    for (const member of typeArg.members) {
      let name = '';
      let type = '';
      let isParsed = false;
      if (ts.isPropertySignature(member)) {
        // 属性签名 propertyName: type
        name = member.name.getText(sourceFile);
        type = member.type?.getText(sourceFile) || 'any';
        isParsed = true;
      } else if (ts.isMethodSignature(member)) {
        // 方法签名 methodName(paramName: type): type
        name = member.name.getText(sourceFile);
        type = member.getText(sourceFile) || 'any';
        isParsed = true;
      } else if (ts.isIndexSignatureDeclaration(member)) {
        // 索引签名 [key: keyType]: type
        const param = member.parameters[0];
        name = param.type?.getText(sourceFile) || param.getText(sourceFile);
        type = member.getText(sourceFile) || 'any';
        isParsed = true;
      }
      if (isParsed) {
        const docs = parseDoc((member as any).jsDoc, sourceFile);
        slots.push({ name, type, description: docs.description, tags: docs.tags, schema: '', declarations: [] });
      }
    }
  }
}

export default function parseDefineSlots(code: string): SlotDefinition[] {
  const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest, true);
  const slots: SlotDefinition[] = [];

  function visit(node: ts.Node) {
    // 检测 defineSlots 调用表达式
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'defineSlots' && node.typeArguments?.length) {
      const typeArg = node.typeArguments[0];

      parseTypeArg(typeArg, sourceFile, slots);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return slots;
}
