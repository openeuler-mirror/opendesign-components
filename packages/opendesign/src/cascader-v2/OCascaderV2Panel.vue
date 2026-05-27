<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { OScroller } from '../scrollbar';
import { ODivider } from '../divider';
import { IconLoading } from '../_utils/icons';
import { isArray, isUndefined, isTouchDevice, isArrayEqual } from '../_utils/is';
import { useI18n } from '../locale';
import { default as CascaderTree, type ColumnInfoT, type CascaderNodeT } from '../cascader/cascader';
import type { CascaderV2ValueT, CascaderV2NodePathT, CascaderV2LazyNodeT, CascaderV2OptionT } from './types';
import { cascaderV2PanelProps } from './types';
import { cascaderV2InjectKey } from './provide';
import OCascaderV2Label from './OCascaderV2Label.vue';

const cascaderV2Inject = inject(cascaderV2InjectKey, null);
const props = defineProps(cascaderV2PanelProps);

const emits = defineEmits<{
  (e: 'change', val: CascaderV2ValueT): void;
  (e: 'update:modelValue', val: CascaderV2ValueT): void;
}>();

const { t } = useI18n();
const isMultiple = cascaderV2Inject?.multiple;
const allowSelectAnyNode = cascaderV2Inject?.allowSelectAnyNode ?? false;
const filterValue = cascaderV2Inject?.filterValue;
const isSelecting = cascaderV2Inject?.isSelecting;
const isLoading = cascaderV2Inject?.loading;
const cascaderTree = new CascaderTree();

const ROOT_KEY = '__root__';
const lazyLoadState = ref<Record<string, 'loading' | 'loaded' | 'error'>>({});

const panelInfo = ref<Array<Array<ColumnInfoT>>>();

// 选中的叶子节点的value
const selectedVal = computed(() => {
  return cascaderV2Inject?.selectValue.value ?? [];
});
// 选中的叶子节点
const selectedLeafNode = computed(() => {
  return selectedVal.value
    .map((val) => {
      const node = cascaderTree.getNode(val);
      if (!node || !node.isLeaf) {
        return;
      }
      return node;
    })
    .filter(Boolean);
});
// 选中的叶子节点的路径
const selectedLeafPath = computed(() => {
  return selectedLeafNode.value
    .map((val) => {
      return val?.fullPath;
    })
    .filter((item) => item?.length);
});

// 判断节点是否全选（allowSelectAnyNode: false 时用于非叶子节点的全选视觉状态）
const isNodeFullySelected = (val: string | number): boolean => {
  const node = cascaderTree.getNode(val);
  if (!node) return false;
  if (node.isLeaf) return selectedVal.value.includes(val);
  return node.children.length > 0 && node.children.every((child) => isNodeFullySelected(child.value));
};

const innerExpandTrigger = computed(() => {
  if (isTouchDevice) {
    return 'click';
  }
  if (props.expandTrigger === 'hover' || props.expandTrigger === 'click') {
    return props.expandTrigger;
  }
  return 'click';
});

const leafNodes = ref<Array<CascaderNodeT>>([]);

/**
 * 深度优先收集树中所有非根节点（先根后子）
 * @param root 树的根节点
 * @returns 全部子孙节点
 */
const collectAllDescendants = (root: CascaderNodeT): CascaderNodeT[] => {
  const result: CascaderNodeT[] = [];
  const dfs = (node: CascaderNodeT) => {
    for (const child of node.children) {
      result.push(child);
      dfs(child);
    }
  };
  dfs(root);
  return result;
};

/**
 * 将 label 按 keyword 切分成高亮段与普通段
 * @param label 完整文本
 * @param keyword 高亮关键字
 * @returns 文本分段数组
 */
const splitLabelByKeyword = (label: string, keyword: string) => {
  const parts: Array<{ text: string; isHighlighted: boolean }> = [];
  let lastIndex = 0;
  while (true) {
    const index = label.indexOf(keyword, lastIndex);
    if (index === -1) break;
    if (index > lastIndex) {
      parts.push({ text: label.substring(lastIndex, index), isHighlighted: false });
    }
    parts.push({ text: label.substring(index, index + keyword.length), isHighlighted: true });
    lastIndex = index + keyword.length;
  }
  if (lastIndex < label.length) {
    parts.push({ text: label.substring(lastIndex), isHighlighted: false });
  }
  return parts;
};

// allowSelectAnyNode 时深度优先遍历所有节点（先根后子），否则仅叶子节点
const filteredOptions = computed(() => {
  if (!props.filterable || !cascaderV2Inject?.filterValue.value) {
    return [];
  }
  const searchValue = cascaderV2Inject.filterValue.value;
  // allowSelectAnyNode 时通过读取 leafNodes 建立响应式依赖，树更新时触发重新计算
  const sourceNodes = allowSelectAnyNode ? (void leafNodes.value, collectAllDescendants(cascaderTree.root)) : leafNodes.value;

  return sourceNodes
    .filter((item) => item.fullLabel.includes(searchValue))
    .map((node) => ({
      label: node.fullLabel,
      labelParts: splitLabelByKeyword(node.fullLabel, searchValue),
      value: node.value,
      disabled: node.disabled,
      isActive: selectedVal.value.includes(node.value),
      isLeaf: node.isLeaf,
    }));
});

const updateSelectedValue = (option: { label: string; value: string | number }, doSelect: boolean = true, path?: CascaderV2NodePathT) => {
  cascaderV2Inject?.registerOption(option);
  if (path) {
    cascaderV2Inject?.registerPath(option.value, path);
  }
  if (doSelect) {
    cascaderV2Inject?.doSelect(option, path);
  }
};

const hidePanel = (shouldHide: boolean) => {
  if (!shouldHide) {
    return;
  }
  cascaderV2Inject?.hidePanel();
};

// 判断非叶子节点的路径是否在已存在的叶子节点路径上
const isNonLeafPathCovered = (currPath: CascaderV2NodePathT) => {
  const currLen = currPath.length;
  return selectedLeafPath.value.some((path) => {
    if (path) {
      const pathLen = path.length;
      return isArrayEqual(currPath, path.slice(0, currLen - pathLen));
    }
  });
};

// 将一列的所有非叶子节点置为失活状态
const deactivateAllNonLeafNodesInColumn = (columnInfo: Array<ColumnInfoT>) => {
  columnInfo.forEach((item) => {
    item.isActive = !item.isLeaf ? false : item.isActive;
  });
};

// 新的一列生成 刷新该列所有节点的状态
const initColumnInfo = (columnInfo: Array<ColumnInfoT>) => {
  columnInfo.forEach((item) => {
    if (!item.isLeaf) {
      item.hasActiveChild = allowSelectAnyNode ? false : isNonLeafPathCovered(item.fullPath);
      return;
    }
    if (selectedVal.value.includes(item.value)) {
      item.isActive = true;
    }
  });
};

// 点击选项 向上冒泡更新非叶子节点的半选状态（allowSelectAnyNode: false 时生效）
const refrashCheckStateByBubble = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  if (allowSelectAnyNode) {
    return;
  }
  const depth = option.depth;
  if (depth < 2) {
    return;
  }
  const hasActiveChild = columnInfo.some((item) => (item.isLeaf && item.isActive) || item.hasActiveChild);
  const prevColumnInfo = panelInfo.value![depth - 2];
  const parentOption = prevColumnInfo.find((item) => item.value === option.parent?.value);
  if (!parentOption) {
    return;
  }
  parentOption.hasActiveChild = hasActiveChild;
  refrashCheckStateByBubble(parentOption, prevColumnInfo);
};

const getOptionList = () => {
  const panelInfoLen = panelInfo.value?.length || 0;
  const nonLeafOptionList: Array<ColumnInfoT> = [];
  for (let i = 0; i < panelInfoLen; i++) {
    const columnInfo = panelInfo.value![i];
    const columnInfoLen = columnInfo.length;
    for (let j = 0; j < columnInfoLen; j++) {
      const currOption = columnInfo[j];
      if (!currOption.isLeaf) {
        nonLeafOptionList.push(currOption);
        continue;
      }
      if (selectedVal.value.includes(currOption.value)) {
        currOption.isActive = true;
      } else {
        currOption.isActive = false;
      }
    }
  }
  return nonLeafOptionList;
};

const refrashCheckStateByCapture = () => {
  const nonLeafOptionList = getOptionList();
  nonLeafOptionList.forEach((option) => {
    option.hasActiveChild = allowSelectAnyNode ? false : isNonLeafPathCovered(option.fullPath);
  });
};

const selectOption = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  while (option.depth < panelInfo.value!.length) {
    panelInfo.value?.pop();
  }
  if (isMultiple) {
    option.isActive = !option.isActive;
    deactivateAllNonLeafNodesInColumn(columnInfo);
    // allowSelectAnyNode: false 才需要冒泡更新父节点半选状态
    if (!allowSelectAnyNode) {
      refrashCheckStateByBubble(option, columnInfo);
    }
  } else {
    columnInfo.forEach((item) => {
      item.isActive = item.value === option.value;
    });
  }
  const { label, fullLabel, value, fullPath } = option;
  const simpleVal = value;
  if (props.pathMode) {
    emits('change', fullPath);
    emits('update:modelValue', fullPath);
  } else {
    emits('change', simpleVal);
    emits('update:modelValue', simpleVal);
  }
  updateSelectedValue({ label: props.showAllLevels ? fullLabel : (label ?? ''), value }, true, fullPath);
};

// allowSelectAnyNode: true — 直接选中/取消选中当前非叶子节点本身
const selectNonLeafStrict = (option: ColumnInfoT) => {
  updateSelectedValue({ label: props.showAllLevels ? option.fullLabel : (option.label ?? ''), value: option.value }, true, option.fullPath);
};

// 递归获取某节点的所有叶子后代
const getLeafDescendants = (nodeValue: string | number): Array<CascaderNodeT> => {
  const node = cascaderTree.getNode(nodeValue);
  if (!node) return [];
  const leaves: Array<CascaderNodeT> = [];
  const traverse = (n: CascaderNodeT) => {
    if (n.isLeaf) {
      leaves.push(n);
    } else {
      n.children.forEach(traverse);
    }
  };
  node.children.forEach(traverse);
  return leaves;
};

// allowSelectAnyNode: false 多选 — 点击非叶子节点 checkbox：全选/全取消所有叶子后代
const toggleNonLeafDescendants = (option: ColumnInfoT) => {
  const leaves = getLeafDescendants(option.value);
  if (!leaves.length) return;

  if (isNodeFullySelected(option.value)) {
    cascaderV2Inject?.doSelectBatch(
      [],
      leaves.map((l) => l.value),
    );
  } else {
    const toAdd = leaves
      .filter((l) => !l.disabled)
      .map((l) => ({
        value: l.value,
        label: props.showAllLevels ? l.fullLabel : (l.label ?? ''),
        path: l.fullPath,
      }));
    cascaderV2Inject?.doSelectBatch(toAdd, []);
  }

  refrashCheckStateByCapture();
};

/**
 * 同步展开列时的视觉状态：单选高亮当前列、多选切换激活态并复位非叶子节点
 * @param option 当前点击的选项
 * @param columnInfo 当前列
 */
const syncColumnActiveState = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  if (isMultiple) {
    deactivateAllNonLeafNodesInColumn(columnInfo);
    option.isActive = !option.isActive;
    return;
  }
  columnInfo.forEach((item) => {
    item.isActive = item.value === option.value;
  });
};

/**
 * 展开节点已加载的子级到下一列
 * @param node 树节点
 */
const pushChildrenColumn = (node: CascaderNodeT) => {
  const nextColumnInfo = cascaderTree.getColumnInfo(node, selectedVal.value);
  initColumnInfo(nextColumnInfo);
  panelInfo.value!.push(nextColumnInfo);
};

/**
 * 触发懒加载并在加载完成后展开下一列
 * @param option 当前点击的选项
 * @param node 树节点
 */
const triggerLazyLoad = (option: ColumnInfoT, node: CascaderNodeT) => {
  lazyLoadState.value[String(option.value)] = 'loading';
  const lazyNode: CascaderV2LazyNodeT = {
    value: node.value,
    level: node.depth,
    isLeaf: node.isLeaf,
    data: { value: node.value, label: node.label },
    path: node.fullPath,
    label: node.fullLabel,
  };
  const nodeResolve = (children: Array<CascaderV2OptionT>) => {
    cascaderTree.addChildren(node.value, children, true);
    leafNodes.value = cascaderTree.getLeafNodes();
    lazyLoadState.value[String(option.value)] = 'loaded';

    // 同步更新 panelInfo 中的 isLeaf 状态
    const updatedNode = cascaderTree.getNode(option.value);
    if (updatedNode) {
      option.isLeaf = updatedNode.isLeaf;
    }
    if (!option.isLeaf && updatedNode) {
      pushChildrenColumn(updatedNode);
    }
  };
  const nodeReject = () => {
    lazyLoadState.value[String(option.value)] = 'error';
    cascaderV2Inject?.onLazyloadError(lazyNode);
  };
  const result = props.lazyload?.(lazyNode, nodeResolve, nodeReject);
  if (result instanceof Promise) {
    result.then(nodeResolve).catch(nodeReject);
  }
};

const expandOption = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  // 懒加载中，禁止重复触发
  if (props.lazy && lazyLoadState.value[String(option.value)] === 'loading') return;

  while (option.depth < panelInfo.value!.length) {
    panelInfo.value?.pop();
  }
  syncColumnActiveState(option, columnInfo);

  const node = cascaderTree.getNode(option.value);
  if (!node) return;

  // 懒加载：当前节点未加载时触发 lazyload
  if (props.lazy && props.lazyload && lazyLoadState.value[String(option.value)] !== 'loaded') {
    triggerLazyLoad(option, node);
    return;
  }

  pushChildrenColumn(node);
};

/**
 * 处理非叶子节点的选中逻辑：多选按 allowSelectAnyNode 分流，单选只注册节点不关闭面板
 * @param option 当前非叶子节点
 */
const selectNonLeafOption = (option: ColumnInfoT) => {
  if (isMultiple) {
    if (allowSelectAnyNode) {
      selectNonLeafStrict(option);
      return;
    }
    toggleNonLeafDescendants(option);
    return;
  }
  // 单选：选中但不关闭面板，可继续浏览子项
  const { label, fullLabel, value, fullPath } = option;
  updateSelectedValue({ label: props.showAllLevels ? fullLabel : (label ?? ''), value }, true, fullPath);
};

// 点击 ORadio/OCheckbox 区域时触发：选中当前节点，非叶子节点同时展开
const onLabelSelect = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  if (!isArray(panelInfo.value) || option.disabled) {
    return;
  }
  if (option.isLeaf) {
    selectOption(option, columnInfo);
    hidePanel(!isMultiple);
    return;
  }
  selectNonLeafOption(option);
  // 未展开时同步展开子项
  if (!option.isActive && innerExpandTrigger.value === 'click') {
    expandOption(option, columnInfo);
  }
};

const onClick = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  if (!isArray(panelInfo.value) || option.disabled) {
    return;
  }
  // 叶子节点：点击整个选项都选中
  if (option.isLeaf) {
    selectOption(option, columnInfo);
    hidePanel(!isMultiple);
    return;
  }
  // 非叶子节点：仅展开（选中逻辑由 onLabelSelect 处理）
  if (innerExpandTrigger.value !== 'click') return;
  expandOption(option, columnInfo);
};

const onMouseenter = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  if (!isArray(panelInfo.value) || option.isLeaf || option.isActive || innerExpandTrigger.value !== 'hover') {
    return;
  }
  expandOption(option, columnInfo);
};

// 确定最长路径
const getFinalPath = () => {
  const numSet = new Set<number>();
  selectedLeafPath.value.forEach((item) => {
    numSet.add(item?.length ?? 0);
  });
  const maxPathLen = Math.max(...Array.from(numSet));
  const filteredPathList = selectedLeafPath.value.filter((item) => item?.length === maxPathLen);
  return filteredPathList[filteredPathList.length - 1];
};

/**
 * 根据节点生成传给 updateSelectedValue 的选项参数（按 showAllLevels 选择 label）
 * @param node 树节点
 * @returns 选项参数
 */
const buildSelectedOption = (node: CascaderNodeT) => ({
  label: props.showAllLevels ? node.fullLabel : (node.label ?? ''),
  value: node.value,
});

/**
 * 多选模式下，将当前选中值同步注册到内部 label/path 缓存
 * allowSelectAnyNode 时还需要注册被选中的非叶子节点
 */
const syncMultipleSelection = () => {
  selectedLeafNode.value.forEach((item) => {
    updateSelectedValue(buildSelectedOption(item!), false, item!.fullPath);
  });
  if (!allowSelectAnyNode) return;
  selectedVal.value.forEach((v) => {
    const node = cascaderTree.getNode(v);
    if (node && !node.isLeaf) {
      updateSelectedValue(buildSelectedOption(node), false, node.fullPath);
    }
  });
};

/**
 * 单选模式下根据 modelValue 重置面板并注册选中项
 * @param modelValue 单选值
 */
const refreshSingleSelection = (modelValue: CascaderV2ValueT) => {
  // 无有效选中值（空字符串、undefined 等）时，直接展示根节点第一列，避免 getPanelInfo 触发误报警告
  if (!modelValue && modelValue !== 0) {
    panelInfo.value = cascaderTree.root.children.length ? [cascaderTree.getColumnInfo(cascaderTree.root)] : undefined;
    return;
  }
  panelInfo.value = cascaderTree.getPanelInfo(modelValue, props.lazy);
  if (isArray(modelValue)) return;
  const node = cascaderTree.getNode(modelValue);
  if (!node) return;
  updateSelectedValue(buildSelectedOption(node), true, node.fullPath);
};

const refreshCascaderV2Data = (modelValue: CascaderV2ValueT) => {
  if (isArray(modelValue) && modelValue.length) {
    const finalPath = getFinalPath();
    panelInfo.value = finalPath ? cascaderTree.getPanelInfo(finalPath, props.lazy) : [cascaderTree.getColumnInfo(cascaderTree.root)];
    syncMultipleSelection();
    refrashCheckStateByCapture();
    return;
  }
  refreshSingleSelection(modelValue);
};

// 懒加载根节点：关闭下拉，在 trigger 显示 loading，数据就绪后再打开下拉
const loadRoot = () => {
  if (!props.lazy || !props.lazyload) return;
  if (lazyLoadState.value[ROOT_KEY] === 'loading' || lazyLoadState.value[ROOT_KEY] === 'loaded') return;

  lazyLoadState.value[ROOT_KEY] = 'loading';
  cascaderV2Inject?.setRootLoading(true);

  const rootNode: CascaderV2LazyNodeT = {
    value: null,
    level: 0,
    isLeaf: false,
    data: null,
    path: [],
    label: '',
  };
  const rootResolve = (children: Array<CascaderV2OptionT>) => {
    cascaderTree.addChildren(null, children, true);
    leafNodes.value = cascaderTree.getLeafNodes();
    lazyLoadState.value[ROOT_KEY] = 'loaded';
    cascaderV2Inject?.setRootLoading(false);
    refreshCascaderV2Data(props.modelValue);
  };
  const rootReject = () => {
    lazyLoadState.value[ROOT_KEY] = 'error';
    cascaderV2Inject?.setRootLoading(false);
    cascaderV2Inject?.onLazyloadError(rootNode);
  };
  const result = props.lazyload(rootNode, rootResolve, rootReject);
  if (result instanceof Promise) {
    result.then(rootResolve).catch(rootReject);
  }
};

watch(
  () => props.options,
  (val) => {
    if (!isUndefined(val)) {
      // TODO pathMode模式
      cascaderTree.updateTree(val, props.lazy);
      leafNodes.value = cascaderTree.getLeafNodes();
      refreshCascaderV2Data(props.modelValue);
    } else {
      // options 变为 undefined（如从非 lazy 切换到 lazy 模式）：重置树和懒加载状态，
      // 确保下次面板打开时重新触发 loadRoot()
      cascaderTree.updateTree([], props.lazy);
      leafNodes.value = [];
      panelInfo.value = undefined;
      lazyLoadState.value = {};
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

// 同步外部改变
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) return;
    if (isArray(newValue)) {
      syncMultipleSelection();
      refrashCheckStateByCapture();
      return;
    }
    const node = cascaderTree.getNode(newValue);
    if (!node) return;
    updateSelectedValue(buildSelectedOption(node), true, node.fullPath);
    refrashCheckStateByCapture();
  },
);

watch(
  () => cascaderV2Inject?.isSelecting.value,
  (val) => {
    if (val) {
      if (props.lazy && cascaderTree.root.children.length === 0) {
        loadRoot();
      } else {
        refreshCascaderV2Data(props.modelValue);
      }
    }
  },
);

// 多选选中搜索结果后 filterValue 被清空，搜索视图退场前重建 panelInfo，
// 让树视图自动定位到刚选中项所在路径（参考 Arco Design 行为）
watch(
  () => cascaderV2Inject?.filterValue.value,
  (newVal, oldVal) => {
    if (oldVal && !newVal && isMultiple) {
      refreshCascaderV2Data(props.modelValue);
    }
  },
);

const handleClick = (option: { label: string; value: string | number; disabled?: boolean }) => {
  if (option.disabled) {
    return;
  }
  const node = cascaderTree.getNode(option.value);
  updateSelectedValue(option, true, node?.fullPath);
  hidePanel(!isMultiple);
};
</script>

<template>
  <div v-if="isSelecting" class="o-cascader-v2-panel" :class="[`o-cascader-v2-panel-${props.size}`]" @mousedown.prevent>
    <template v-if="isLoading">
      <OScroller class="o-cascader-v2-panel-scroller" wrap-class="o-cascader-v2-panel-container" show-type="hover" size="small" disabled-x>
        <div class="o-cascader-v2-panel-loading">
          <IconLoading class="o-rotating" />
        </div>
      </OScroller>
    </template>

    <template v-else-if="props.filterable && filterValue">
      <template v-if="filteredOptions.length">
        <OScroller class="o-cascader-v2-panel-scroller" wrap-class="o-cascader-v2-panel-container" show-type="hover" size="small" disabled-x>
          <ul class="o-cascader-v2-options" :class="{ 'o-cascader-v2-options-filterable': props.filterable }">
            <li
              v-for="option in filteredOptions"
              :key="option.value"
              :class="{ 'o-cascader-v2-option-selected': option.isActive, 'o-cascader-v2-option-disabled': option.disabled }"
              class="o-cascader-v2-option"
              @click="handleClick(option)"
            >
              <OCascaderV2Label
                :label="option.label"
                :label-parts="option.labelParts"
                :value="option.value"
                :multiple="isMultiple"
                :allow-select-any-node="allowSelectAnyNode"
                :is-leaf="true"
                :disabled="option.disabled"
                :is-fully-selected="isMultiple ? option.isActive : undefined"
                @select="handleClick({ label: option.label, value: option.value })"
              />
            </li>
          </ul>
        </OScroller>
      </template>

      <template v-else>
        <div class="o-cascader-v2-panel-empty">
          <span>{{ t('common.empty') }}</span>
        </div>
      </template>
    </template>

    <template v-else>
      <template v-for="(columnInfo, index) in panelInfo" :key="index">
        <ODivider v-if="index > 0" direction="v" class="o-cascader-v2-panel-divider" />
        <OScroller class="o-cascader-v2-panel-scroller" wrap-class="o-cascader-v2-panel-container" show-type="hover" size="small" disabled-x>
          <ul class="o-cascader-v2-options">
            <li
              v-for="option in columnInfo"
              :key="option.value"
              :class="{
                'o-cascader-v2-option-selected': option.isActive && (!option.isLeaf || !isMultiple),
                'o-cascader-v2-option-disabled': option.disabled,
              }"
              class="o-cascader-v2-option"
              @click="onClick(option, columnInfo)"
              @mouseenter="onMouseenter(option, columnInfo)"
            >
              <OCascaderV2Label
                :label="option.label"
                :value="option.value"
                :multiple="isMultiple"
                :allow-select-any-node="allowSelectAnyNode"
                :disabled="option.disabled"
                :is-leaf="option.isLeaf"
                :indeterminate="!allowSelectAnyNode && option.hasActiveChild"
                :is-fully-selected="!option.isLeaf && !allowSelectAnyNode && isMultiple ? isNodeFullySelected(option.value) : undefined"
                :loading="props.lazy && lazyLoadState[String(option.value)] === 'loading'"
                @select="onLabelSelect(option, columnInfo)"
              />
            </li>
          </ul>
        </OScroller>
      </template>
    </template>
  </div>
</template>
