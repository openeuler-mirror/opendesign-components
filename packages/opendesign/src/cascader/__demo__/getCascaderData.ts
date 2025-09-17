interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
}

/**
 * 生成树形级联数据
 * @param depth 树的最大深度（必须≥1）
 * @param childMinCount 每个节点的最小子节点数
 * @param childMaxCount 每个节点的最大子节点数
 * @returns 生成的树形数据数组
 */
export function getCascaderData(depth: number, childMinCount: number, childMaxCount: number): TreeNode[] {
  if (depth < 1) throw new Error('深度必须≥1');
  if (childMinCount > childMaxCount) throw new Error('最小子节点数不能大于最大子节点数');

  // 生成随机子节点数量
  const getRandomChildCount = () => Math.floor(Math.random() * (childMaxCount - childMinCount + 1)) + childMinCount;

  // 递归生成节点
  const generateNode = (currentDepth: number, path: number[]): TreeNode => {
    const value = path.join('-');
    const label = currentDepth === 1 ? `选项${path[0]}` : `子选项${path.slice(0, -1).join('-')}-${path[path.length - 1]}`;

    const node: TreeNode = { label, value };

    // 当未达到最大深度时生成子节点
    if (currentDepth < depth) {
      const childCount = getRandomChildCount();
      node.children = [];

      for (let i = 1; i <= childCount; i++) {
        node.children.push(generateNode(currentDepth + 1, [...path, i]));
      }
    }

    return node;
  };

  // 生成根节点
  const rootCount = getRandomChildCount();
  return Array.from({ length: rootCount }, (_, i) => generateNode(1, [i + 1]));
}
