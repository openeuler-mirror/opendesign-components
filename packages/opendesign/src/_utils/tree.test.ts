/**
 * _utils/tree.ts VTree 树结构工具测试。
 *
 * 覆盖 getNode / getPath / hasSameNode / addNode。
 */
import { test, expect, describe } from 'vitest';
import { VTree, type TreeNodeT } from './tree';

describe('VTree', () => {
  function createTestTree(): VTree {
    const tree = new VTree('root', null);
    const nodeA: TreeNodeT = { value: 'a', parent: tree.root, children: [] };
    const nodeB: TreeNodeT = { value: 'b', parent: tree.root, children: [] };
    const nodeA1: TreeNodeT = { value: 'a1', parent: nodeA, children: [] };
    nodeA.children.push(nodeA1);
    tree.root.children.push(nodeA, nodeB);
    return tree;
  }

  test('VTree - getNode 查找根级节点', () => {
    const tree = createTestTree();
    const node = tree.getNode(tree.root, 'a');
    expect(node).toBeDefined();
    expect(node?.value).toBe('a');
  });

  test('VTree - getNode 查找深层节点', () => {
    const tree = createTestTree();
    const node = tree.getNode(tree.root, 'a1');
    expect(node).toBeDefined();
    expect(node?.value).toBe('a1');
  });

  test('VTree - getNode 查找不存在的节点返回 undefined', () => {
    const tree = createTestTree();
    const node = tree.getNode(tree.root, 'notExist');
    expect(node).toBeUndefined();
  });

  test('VTree - getPath 返回从根到目标节点的路径', () => {
    const tree = createTestTree();
    const path = tree.getPath(tree.root, 'a1', []);
    expect(path).toBeDefined();
    expect(path?.length).toBe(2);
    expect(path?.[0].value).toBe('a');
    expect(path?.[1].value).toBe('a1');
  });

  test('VTree - getPath 目标不存在时返回 undefined', () => {
    const tree = createTestTree();
    const path = tree.getPath(tree.root, 'xyz', []);
    expect(path).toBeUndefined();
  });

  test('VTree - hasSameNode 检测数组中是否存在同值节点', () => {
    const tree = createTestTree();
    const nodes = tree.root.children;
    expect(tree.hasSameNode(nodes, 'a')).toBe(true);
    expect(tree.hasSameNode(nodes, 'b')).toBe(true);
    expect(tree.hasSameNode(nodes, 'c')).toBe(false);
  });

  test('VTree - addNode 添加根级子节点', () => {
    const tree = new VTree('root', null);
    const newNode: TreeNodeT = { value: 'new', parent: tree.root, children: [] };
    tree.addNode(newNode);
    expect(tree.root.children).toContain(newNode);
    expect(newNode.parent).toBe(tree.root);
  });

  test('VTree - addNode 不添加重复值节点', () => {
    const tree = new VTree('root', null);
    const node1: TreeNodeT = { value: 'dup', parent: tree.root, children: [] };
    const node2: TreeNodeT = { value: 'dup', parent: tree.root, children: [] };
    tree.addNode(node1);
    tree.addNode(node2);
    expect(tree.root.children.length).toBe(1);
  });

  test('VTree - addNode 添加到指定父节点下', () => {
    const tree = createTestTree();
    const parentNode = tree.getNode(tree.root, 'a');
    const newNode: TreeNodeT = { value: 'a2', parent: parentNode!, children: [] };
    tree.addNode(newNode);
    expect(parentNode?.children).toContain(newNode);
  });
});
