import OIconMore from './OIconMore.vue';
import { type Component } from 'vue';

export type MockTreeItem = {
  label: string;
  icon?: Component;
  children?: MockTreeItem[];
};

export type MockTreeParams = {
  depth: number;
  maxChild: number;
  minChild: number;
  label?: string;
  getIcon?: (item: Omit<MockTreeItem, 'icon'>, index: number) => Component | undefined;
  overflowText?: string;
};
const defaultOverflowText = '这是个长度的文字超长的文字用于测试溢出行为';

export function mockTreeItem({
  depth,
  maxChild,
  minChild,
  label,
  getIcon,
  overflowText = defaultOverflowText,
}: MockTreeParams & { label: string }): Omit<MockTreeItem, 'icon'> {
  const children =
    depth > 1
      ? mockTreeArr({
          depth: depth - 1,
          maxChild,
          minChild,
          label,
          getIcon,
          overflowText,
        })
      : undefined;
  return {
    label,
    children,
  };
}

export function mockTreeArr({ depth, maxChild, minChild, label = '1', getIcon, overflowText = defaultOverflowText }: MockTreeParams): MockTreeItem[] {
  if (depth <= 0) return [];
  return new Array<number>(Math.floor(Math.random() * (maxChild - minChild + 1)) + minChild).fill(1).map((_, i) => {
    const _item: MockTreeItem = mockTreeItem({
      depth: depth,
      maxChild,
      minChild,
      label: `${`${label}-${i + 1}`.replace(overflowText, '')}${overflowText}`,
      getIcon,
      overflowText,
    });
    if (getIcon) {
      _item.icon = getIcon(_item, i);
    } else {
      _item.icon = OIconMore;
    }

    return _item;
  });
}
