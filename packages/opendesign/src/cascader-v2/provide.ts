import { InjectionKey, Ref } from 'vue';
import { SelectOptionT } from '../select';
import type { CascaderV2NodePathT, CascaderV2LazyNodeT } from './types';

/**
 * 级联选择器（CascaderV2）父子组件通信注入键
 *
 * 由 `OCascaderV2` / `OCascaderV2Panel` 在 setup 中 `provide`，
 * 内部子组件（如 OCascaderV2Label、各级菜单项）通过 `inject(cascaderV2InjectKey)` 读取选中态、
 * 触发选中或控制浮层。基于此 InjectionKey 可在外部对 Panel 进行二次封装。
 */
export const cascaderV2InjectKey: InjectionKey<{
  /** 当前选中值数组；单选时仅含一项，多选时含全部选中节点 */
  selectValue: Ref<Array<string | number>>;
  /** 是否为多选模式 */
  multiple: boolean;
  /** 是否允许选中任意层级节点（父子节点勾选互不关联） */
  allowSelectAnyNode: boolean;
  /** 筛选输入框的当前值 */
  filterValue: Ref<string>;
  /** 是否处于选中处理流程中（用于禁用重复触发） */
  isSelecting: Ref<boolean>;
  /** 整体加载状态 */
  loading: Ref<boolean>;
  /** 单个节点的选中处理，传入选项与节点路径 */
  doSelect: (option: SelectOptionT, path?: CascaderV2NodePathT) => Promise<void>;
  /** 批量选中处理，`toAdd` 为新增选项列表，`toRemove` 为要移除的 value 列表 */
  doSelectBatch: (toAdd: Array<{ value: string | number; label: string; path: CascaderV2NodePathT }>, toRemove: Array<string | number>) => void;
  /** 子菜单项挂载时注册到父级，便于按 value 查找选项 */
  registerOption: (option: SelectOptionT) => void;
  /** 注册 value → 路径的映射，供路径展示与回显使用 */
  registerPath: (value: string | number, path: CascaderV2NodePathT) => void;
  /** 关闭下拉浮层 */
  hidePanel: () => void;
  /** 打开下拉浮层 */
  showPanel: () => void;
  /** 设置根节点的加载态（懒加载根列表时使用） */
  setRootLoading: (v: boolean) => void;
  /** 懒加载失败时的统一回调，对外触发 `lazyload-error` 事件 */
  onLazyloadError: (node: CascaderV2LazyNodeT) => void;
}> = Symbol('provide-cascader-v2-option');
