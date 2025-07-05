import ts from 'typescript';

interface SlotDefinition {
  name: string;
  type: string;
  docs: {
    description: string;
    tags: {
      name: string;
      text: string;
    }[];
  };
}

export default function parseDefineSlots(code: string): SlotDefinition[] {
  const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest, true);
  const slots: SlotDefinition[] = [];

  function visit(node: ts.Node) {
    // 检测 defineSlots 调用表达式
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'defineSlots' && node.typeArguments?.length) {
      const typeArg = node.typeArguments[0];

      // 处理内联对象类型
      if (ts.isTypeLiteralNode(typeArg)) {
        for (const member of typeArg.members) {
          if (ts.isPropertySignature(member)) {
            const name = member.name.getText(sourceFile);
            const type = member.type?.getText(sourceFile) || 'any';
            const docs = {
              description: '',
              tags: [],
            };

            // 提取文档注释
            if ((member as any).jsDoc?.length) {
              docs.description = (member as any).jsDoc
                .map((doc) => {
                  let comment = doc.getText(sourceFile);
                  // 清理注释格式
                  comment = comment
                    .replace(/\/\*\*|\*\//g, '')
                    .replace(/^\s*\*\s?/gm, '')
                    .replace(/@([a-zA-Z]+)\s+(.*)/gm, (_: string, paramName: string, paramValue: string) => {
                      docs.tags.push({
                        name: paramName,
                        value: paramValue || '',
                      });
                      return '';
                    })
                    .trim();
                  return comment;
                })
                .join('\n');
            }

            slots.push({ name, type, docs });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return slots;
}
