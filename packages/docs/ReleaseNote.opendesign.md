## 1.2.4

### Features

- **ODatePicker/OTimePicker**: 新增日期时间系列选择器，包含 ODatePicker、ODateRangePicker、ODateTimePicker、ODateTimeRangePicker、OMonthPicker、OMonthRangePicker、OYearPicker、OYearRangePicker、OTimePicker、OTimeRangePicker（运行时依赖 `dayjs`）
- **OCascaderV2**: 新增 PC 端重构的级联选择器组件 OCascaderV2、OCascaderV2Panel；同时 CascaderOptionT 补充 `disabled` 和 `leaf` 字段
- **OLink**: 新增 `to` 属性，支持 router-link 跳转
- **OScroller**: 新增 `scrollBy` 方法

### Bug Fixes

- **OCarousel**: 修复组件初始化后动态新增的轮播页不被处理的问题
- **OCollapse**: 修复折叠动画卡顿不流畅的问题
- **OAnchor**: 修复窗口宽度变化后高亮选中项错位的问题
- **OTable/ODataTable**: 修复导出的 `TableRowT` 类型要求强制索引签名的问题
- **OTextarea**: 修复宽度显示问题
- **OMenu**: 修复点击子菜单空白区域导致整个菜单关闭的问题
- **OButton/ODropdown**: 修复 brand 模式禁用状态下错误显示边框的问题
- **OInput**: 修复仅传入 `extra` slot 时不渲染的问题
- **useScreen**: 修复服务端渲染时的水合报错（将值的赋值时机调整至 mounted 后）

### Style

- **OCard**: 标题字重由 500 调整为 600
- **OSkeleton**: 骨架屏动画背景色调整
- **OButton**:
  - 文字按钮 hover 颜色由 `primary1` 调整为 `primary2`
  - 纯图标按钮新增 hover 态颜色与边框色
- **OSlider**: 滑块按钮新增阴影
- **OSearch**: 输入图标默认颜色加深；清除按钮调整为聚焦时展示

## 1.2.3-sp2

### Bug Fixes

- **OInput/OTextarea:** 修改触发`input`事件的时机为`update:model-value`之后（错误行为自 `1.1.0` 引入）
- **OTab:** 修复`--tab-nav-justify`没有正常生效的bug

## 1.2.3-sp1

### Features

- **hooks:**
  - 新增 `useElementOverflown`：自动监听元素文本溢出状态，实时返回是否出现水平/垂直滚动条
  - 新增 `useResponseCssVar`：响应式获取CSS变量值，变量变化时自动更新返回结果
  - 新增 `useRunOnceNextTick`：解决同一Vue tick内函数重复执行问题，自动合并重复调用并在下一个tick批量运行
  - 新增 `useSortedTeleportChildren`：修复Teleport和动态组件渲染顺序与模板不一致的问题，自动维护按模板顺序排列的响应式子组件列表

### Bug Fixes

- **OTab:**
  - 修复溢出计算逻辑及移动端水合报错
  - 修复lazy模式下的显示问题
- **OMenu:** 修复溢出tooltip的内容在服务端渲染时为空的问题
- **OButton/ODropdown:** 修复昇腾/鲲鹏主题运营色的样式、solid的字体颜色，及dropdown选项禁用时的样式
- **OForm:** 补充840-601之间的`--form-item-main-box-width-standard`与`--form-item-main-box-width-wide`
- **OLink:** 修复link组件图标对齐问题
- **use-scrollbar:** 修复渲染后立即卸载时无法读取到childNodes的报错

## 1.2.3

### Features

- **OAvatar:** 增加头像组件

## 1.2.2

### Features

- **ODataTable:** 增加列选择、列展开、列筛选、列排序、表头自定义合并单元格、树形数据、溢出气泡、首列作为表头、头部信息描述参数等功能
- **OForm:** 增加form下各控件宽度变量(结合栅格)，供调用者使用
- **OSearch:** 新增搜索框组件

### Bug Fixes

- **OPopup:** 修复popup更新target后未正确生效的问题
- **OTab:**
  - 修复在服务端渲染下的报错问题
  - 修复 `--tab-nav-justify` 变量未被正确应用的问题
- **OCheckbox/ORadio:** 调整图标中心颜色变量
- **ODataTable:**
  - 修复hover时合并单元格不高亮的bug
  - 修复横向溢出时竖向滚动条被遮挡无法滑动的问题

### style

- **OSwitch:**
  - 调整`medium`尺寸的`--switch-text-size`、`--switch-text-height`值，增加`--switch-icon-size`变量用以控制icon大小。

### Others

- **common:** 调整部分组件ts，修复构建报错

## 1.2.1

### Features

- **InInput:** 增加`onlyNumericInput`属性，确保数字输入框仅限数字输入
- **OUpload:** 拖拽上传文件成功后支持预览（仅限图片资源）与下载文件功能

### style

- **OUpload:**
  - `o-upload-row-item`添加hover态，鼠标hover时显示背景色
  - 调整`list-type`为`picture-card`时文件上传中、上传失败、上传成功状态的样式

### Bug Fixes

- **OPopup:** 修复更新target后未正确生效的问题
- **ODataTable:**
  - 修复横向溢出时竖向滚动条被遮挡无法滑动的问题
  - 修复hover时合并单元格不高亮的bug

## 1.2.0

### BREAKING CHANGES

- **OTab:** 增加个数限制与溢出隐藏交互(修改了内部dom结构)

### Features

- **OScroller:** 增加scroll事件与barClass支持
- **OAnchor:** 增加横向锚点模式
- **OTab:** 增加按钮模式
- **OTable:** 增加斑马纹模式
- **ODataTable:** 新增数据表格组件(支持固定列与表头)
- **OStep:** 新增步骤条组件
- **OToast:** 新增即时反馈组件
- **OIpInput:** 新增ip地址输入框组件
- **OSlider:** 新增滑动条组件
- **OUpload:** 新增`showProgress`属性控制上传中是否显示进度条的效果

### Bug Fixes

- **OTab:** 修复了tab-nav由于teleport导致的渲染顺序错乱的问题
- **OTable:** 修复hover header时高亮错误的问题
- **OInput:** 修复生产环境无法获取到inInputRef实例的问题

## 1.1.0

### BREAKING CHANGES

- **Token:**
  - 组件变量迁移至`@opensig/opendesign-token`，不再本仓维护
  - `o-color-control-light` 更改为 `o-color-control5-light`
  - 变量值刷新
- **OTable:** 内部`tr.last`更名为`tr.o-row-last`，`td.last`更名为`td.o-cell-last-col`
- **OCollapse:** css变量`--collapse-item`定义从`.o-collapse-item`类下迁移至`.o-collapse`

### Features

- **OGrid:** 新增1680断点，通过`pcS`属性控制
- **OMenu:**
  - 修复组件受控逻辑, `OSubMenu` 增加`icon`属性，支持通过属性配置图标
- **OPopover:** 修改1680px以下字体大小
- **OMessage:**
  - 新增变量`--message-list-top-offset`和`--message-list-bottom-offse`
  - **useMessage:** `showMessage`返回关闭函数
  - **OMessageList:** 新增实例方法`close`
- **OLoading:**
  - 新增 `--loading-label-font-size`、`--loading-label-font-height`，`--loading-label-icon-gap`变量
  - **vLoading:** 支持传入属性对象
- **OPagination:** `total`插槽新增`pageCount`参数
- **OTable:** td插槽新增`row-index`参数，支持斑马纹
- **OIcon:** 新增缩放类图标
- **OInput:**
  - 增加`length`插槽;
  - 增加`showLength`参数，控制是否显示内容长度信息；[#ID7C8R](https://gitee.com/openeuler/opendesign-components/issues/ID7C8R)
- **OTextarea:**
  - 增加`length`插槽;
  - 增加`showLength`参数，控制是否显示内容长度信息；[#ID7C8R](https://gitee.com/openeuler/opendesign-components/issues/ID7C8R)
- **OUpload:**
  - 增加子项相关事件`itemRemove`、`itemRetry`、`itemReplace`、`itemPreview`、`itemClick`；
  - 增加暴露的接口：`replaceById`、`replaceByIndex`、`removeById`、`previewItemByIndex`、`previewItemById` [#ICSTRO](https://gitee.com/openeuler/opendesign-components/issues/ICSTRO)
- **OLayer:** 增加向后代组件注入`toggle`方法
- **OLoading** 增加size属性：支持large、medium、small、mini，优化响应式适配
- **OAnchor** 增加observeHref参数，以自定义监听元素
- **OSwitch** 新增active、inactive插槽以支持主题切换形式的带图标开关
- **OCard** 新增`textOverflow`属性支持切换卡片内容超出隐藏的效果

### Bug Fixes

- **OToggle:**
  - 刷新在laptop、pad竖屏以下 时的尺寸及内边距
  - `round`属性支持非`pill`的值(一般css值类型)
- **OSwitch:** 修复未传递`modelValue`值时，组件不能工作的问题
- **OMessageList:**
  - 修复`remove`方法未正确处理`destroy`回调
  - 暴露`close`方法
- **useMessage:** 修复`close`函数功能
- **OPagination:** 跳转元素内文本与输入框居中对齐
- **OTab:**
  - 修复视口宽度变化时，滚动计算不正确的问题
  - 修复`prefix`或`suffix`插槽增加内容时，`tab-navs`溢出问题
  - 修复`tab-nav`高度不同时底部不能对齐横向分割线的问题
- **OTag:** 修复受控模式问题
- **OTable:**
  - 修复右侧单元格为合并单元格时last条件计算错误的问题
  - 解决表格hover高亮不准确的问题 [#ICW5SF](https://gitee.com/openeuler/opendesign-components/issues/ICW5SF)
- **OCarousel:** 修复hover暂停播放时指示器不显示激活状态的样式问题 [#ID40RO](https://gitee.com/openeuler/opendesign-components/issues/ID40RO)
- **OInput:** 修复在长度限制后，粘贴字符串超出长度，粘贴失效问题 [#ID74CT](https://gitee.com/openeuler/opendesign-components/issues/ID74CT)；**注意**：`input` 事件始终上报用户当前输入的原始值（截断/校验处理前），`update:modelValue` 更新的值则为经过截断或校验处理后的值，两者在超出 `maxLength` 等场景下可能不一致
- **OAnchor:** 修复`title`包含长单词/数字，导致盒子宽度被撑开的问题 [#ID77PX](https://gitee.com/openeuler/opendesign-components/issues/ID77PX)
- **OFigure:**
  - 移动端`previewClose`的`image`值修正为`body`值
  - 修复在百度浏览器中点击预览热区引发浏览器查看大图功能的问题
- **OPopup:** 修复`click`事件未正确移除的bug
- **OCard** 修复在暗夜模式下的文本溢出样式

### style

- **Mixin** 刷新响应式断点（laptop更新为[1200px, 1680px]），并新增respond
- **OLink**
  - 尺寸为`large`时图标尺寸修改为从`--o-icon_size_control-m`变更为`--o-icon_size_control-s`
  - `hoverUnderline`默认值更改为`true`
  - `normal`态文本颜色改用`o-coloc-link1`
- **ORate** 优化star图标，primary态颜色使用`--o-color-main1`
- **OButton**
  - 文本按妞去掉hover态背景色
  - 图标按妞增加hover态背景色
- **OAnchor** 调整未选中时圆圈指示颜色为灰色
- **textarea**
  - rows默认值修改为4；
  - 删除最小高度样式；
  - 圆角为`pill`时，值为`--o-radius_control-l`
  - `o_textarea-count`块增加了背景色，通过变量`--limit-bg-color`控制
- **OPagination** 省略项页码在hover时去掉了左右箭头
- **OPopver** 气泡带描边，通过变量`--popup-bd`控制
- **OPopop** 描边的位置由`o-popup-body`上升到`o-popup-wrap`

### Code Refactoring

- **TypeScript:** 修复一系列组件相关ts类型声明，详见提交：[#IDCFAA](https://gitee.com/openeuler/opendesign-components/issues/IDCFAA)
- **溢出打断规则** 修改为`break-word`，涉及组件`OMessage`、`OCard`、`OMenu`

### Others

包含1.0.1-sp1的变更

## 1.0.1-sp5

### Bug Fixes

- **OTable:** 降级兼容ios下表头分割线定位问题

## 1.0.1-sp3/4

### Bug Fixes

- **use-input:** 修复输入类组件输入一次触发两次input事件的问题

## 1.0.1-sp1

### BREAKING CHANGES

- **OMenu:** 重构OMenu [#IDCF7H](https://gitee.com/openeuler/opendesign-components/issues/IDCF7H)
  - 增加引导线风格菜单
  - 增加`arrowPosition`参数，值为`left`时两行溢出隐藏
  - 移除item的Mouseleave事件
  - 移除levelIndent参数,每级节点增加了`data-level`属性
  - popover组件已经监听相关事件
  - 重构变量，不再区分item与sub的区别，而是根据层级区分样式
  - 使用上下padding替代高度设置
- **OAnchor:** 重构OAnchor [#IDCF88](https://gitee.com/openeuler/opendesign-components/issues/IDCF88)
  - 增加尺寸区别: small、medium、menu
  - 增加一级锚点圆圈指示器
  - 增加行溢出隐藏加气泡提示
  - 增加外部链跳转逻辑(除\_self都认为是外链)
  - 增加item的disabled属性
  - 去除hover与active的背托、增加hover与active的字体颜色
  - 修改粗体字号为600

### Features

- **OTable:** 按新规范调整OTable样式 [#IDCF63](https://gitee.com/openeuler/opendesign-components/issues/IDCF63)
  - 修改字号、行高、间距、字重
  - 修改表头背景色及下分割线
  - 增加o-table-medium选择器
  - 修改响应式选择器为o-table-medium
- **ORate:** 修改ORate空样式为空心星 [#IDCF60](https://gitee.com/openeuler/opendesign-components/issues/IDCF60)
- **OMessage:** 调整OMessage内联组件为带icon样式 [#IDCF5X](https://gitee.com/openeuler/opendesign-components/issues/IDCF5X)
- **OCard:** 增加titleIcon属性 [#IDCF5V](https://gitee.com/openeuler/opendesign-components/issues/IDCF5V)

### Bug Fixes

- **OCarousel:** 修复hover暂停播放时指示器不显示激活状态的问题 [#IDCF1H](https://gitee.com/openeuler/opendesign-components/issues/IDCF1H)
- **OAnchor:** 修复初始化时元素在视口内但anchor未被选中的问题(仍需调用者配置正确的`bounds`属性) [#IDCF4P](https://gitee.com/openeuler/opendesign-components/issues/IDCF4P)

### Chore

- 升级 `sass-embedded` 版本至1.85.1 [#IDCF6U](https://gitee.com/openeuler/opendesign-components/issues/IDCF6U)

## 1.0.4

### Features

- **doc** 更新`changelog`,添加`breaking change`描述
- **OCarousel** 修复`hover`暂停播放时指示器不显示激活状态的问题

## 1.0.3

### Warning

此版本弃用，请勿使用此版本

## 1.0.2

### Warning

本版本未修复[#ID40RO](https://gitee.com/openeuler/opendesign-components/issues/ID40RO)问题，建议升级到v1.0.4

### BREAKING CHANGES

- **OBreadcrumb:** 修复 `--breadcrumb-seperator-size` 单词拼写错误，正确写法: `--breadcrumb-separator-size`
- **OCascader:** 修复 `--cascader-options-bd-clor` 单词拼写错误，正确写法: `--cascader-options-bd-color`
- **OFigure:**
  - 修复组件 `lazyPreiew` 参数单词拼写错误, 正确写法: `lazyPreview`
  - 组件background在dom中生效的位置自 `.o-figure-wrap` 调高至 `.o-figure`

### Features

- **OCascader:** cascader新增 `expandTrigger` 参数，支持hover触发展开下一级菜单
- **OButton:** 新增 `--btn-gap-prefix` 及 `--btn-gap-suffix` 变量以单独控制前缀及后缀图标外边距
- **scss-mixin:** respond-to新增断点
- **OFigure:** 新增CSS变量 `--figure-error-bk` 控制图片加载失败时背景色
- **OMenu:** 增加size属性，支持`medium`, `small`;

### Bug Fixes

- **OCascader:** 修复trigger参数失效，数据回显bug
- **OBreadcrumb:** 调整组件hover active状态颜色
- **OBadge:** 修复OBadge组件offset-x不支持负数
- **ORate:** 完善ORate组件icon插槽status变量类型签名
- **OSelect:** 优化select组件provide的select函数
- **vScrollbar:** 优化类型签名
- **OFigure:**
  - 修复当 background 为真时图片懒加载完成前不能通过 ratio 属性保持宽高比的问题
  - 修复组件在设置 background 为 true 且未设置 ratio 属性时
    - background 不显示
    - load 或 error 触发两次
    - 组件的高度应该通过默认插槽中的内容撑开

### Code Refactoring

- **OCascader:** 重构优化CascaderTree类

## 1.0.1

### Warning

本版本未修复[#ID40RO](https://gitee.com/openeuler/opendesign-components/issues/ID40RO)问题，建议升级到v1.0.4

### Features

- **utils:** 添加分批执行函数，可用于耗时的大量任务执行

### Code Refactoring

- **i18n:** 扁平化重构多语言，增加词条可读性；支持useI18n在非组件中使用;

## 1.0.0

### Warning

本版本未修复[#ID40RO](https://gitee.com/openeuler/opendesign-components/issues/ID40RO)问题，建议升级到v1.0.4

### Features

- **OScrollbar:** 支持监听内部唯一子元素尺寸改变
- **OInput/OTextarea:** 暴露一系列内部方法：focus、blur、clear、inputEl、togglePassword(OInput only)

### Bug Fixes

- **OInput:** 阻止点击眼睛图标的事件冒泡，修复密码框在切换显示密码时，与外层 popover 显示逻辑冲突问题
- **OTextarea:** 修复 limit 样式错误；limit 文本在圆角为 pill 时文本溢出问题
- **OInput/OTextarea:** 修复 OInput 及 OTextarea 在发送验证码读秒等场景中，无法使用输入法输入中文内容的 bug
- **OInputNumber:** 修复按钮宽度
- **OFigure:** 优化默认播放图标

### Code Refactoring

- **OLink:** 重构图标对齐实现(删除`vertical-align: middle;`)，保证基线对其的情况下实现图标对齐
- **OCollapse:** 重构 OCollapse，支持受控模式

## 0.0.79

### Features

- **OMenu:** 增加size属性，支持`medium`, `small`;

### Bug Fixes

- **OCarousel:** 修复hover暂停播放时指示器不显示激活状态的问题

## 0.0.78

### Chores

- 使用线上@opensig/open-scripts 进行构建

## 0.0.77

### 无

## 0.0.76

### Bug Fixes

- **OInput/OTextarea:** 修复点击清除按钮后，再点击其他区域无法失焦的问题；修复点击 prepend 和 append 区域无法触发失焦的问题

## 0.0.75

### Features

- **OPopover/OPoPup:** adaptive 接口控制是否自动边缘适配

### Bug Fixes

- **OPopover/OPopup:** 修复闪烁问题; #IBXGTT
- **OTextarea:** 修复 textarea 高度设置问题; #IBXFY7
- **OInput:** 修复 input 样式变量书写错误问题;

## 0.0.74

### Features

- **OInput/OTextarea:** onInvalidChange 修改为 valueForInvalid;样式重构;
- **OScrollbar:** scrollbar 新增 barClass 接口，支持自定义类;
- **ODialog:**
  - actions 支持设置 `loading`、`disabled` 属性
  - 新增 css 变量`--dlg-actions-justify` 控制 actions 布局

### Bug Fixes

- **OScrollbar:** 修复频繁小段滚动时有几率会触发点击滚动轨道事件，导致滚动位置跳变;
- **OInput:** 修复 input 无法直接设置宽度问题;
- **OTextarea:** 修复 resize 时，文本域框可以调整到小于外容器宽度问题;
- **OTab:** 修复 tab 标题动态变化时，滚动计算不正确问题;

## 0.0.73

### Features

- **OPagination:** change 事件参数调整为对象，兼容老版本;
- **OLayer:** buttonClose 默认值从 true 修改为 false;
- **OForm:** 导出表单 provide 的 key，可支持自定义表单项

### Bug Fixes

- **OLink:** 解决图标和文字未居中对齐问题
- **OInput/OTextarea:** 移除 beforeInput 属性；
- **OTextarea:** 修复 autoSize 下，设置最大高度后样式问题; 去掉 pressEnter 事件
- **OForm:** 修复 model 重新赋值后，校验值未同步更新问题

## 0.0.72

### Features

- **OLayer:** 新增 buttonClose 字段，支持通过关闭图标关闭弹层
- **OFigure:**
  - previewClose 新增 body 值，支持点击内容区域关闭预览
  - 移动端蒙层样式修改为黑色;
  - 原 slot "preview"修改为"preview-extra"，"preview"用于定制整个内容区域
- **OInputNumber:** 新增 clearValue，用于设置清空输入框时，失焦后的默认值

### Bug Fixes

- **OInput|OInputNumber|OTextarea|ORadio|OCheckbox:** 表单输入 id 优化，支持 SSR
- **OPagination:** 修复第一次切换页码时，change 事件回调值不正确问题；pageSize 不在 pageSizes 内，使用默认的 pageSizes 第一项

### Chore

- 依赖升级
  - vite5 -> vite6
  - vue3.4 -> 3.5

## 0.0.71

- 非稳定版本

## 0.0.70 2024-12-27

### Features

- **OVirtualList:**
  - 虚拟列表支持数据动态追加（头部/尾部）；
  - 新增`renderChange`事件, 参数支持获取渲染可视区域序号；
  - 新增 defaultItemSize 字段，支持不定高时，设置项默认高度
  - API scrollToIndex => scrollToView
- **OMessage:** 支持指定 message 显示到指定目标元素周围
- 增加木兰许可证
- **InBox:** 移除 input 属性
- **OFigure:**
  - 新增 previewClose 属性，支持控制关闭 preview 的方式；
  - 支持通过 api：preivew 控制关闭预览
  - 支持懒加载 lazy
- **OInput/OTextarea:**: 新增beforeInput，支持对输入控制
- **hooks:**
  - 重构 useIntersectionObserver 支持传入 options，添加 destroy 方法
  - 优化 useResizeObserver，添加 destroy 方法
- **OLink:** 去掉 link 的 display：inline-flex 样式
- **OCascaderPanel:** 导出 OCascaderPanel 组件

### Bug Fixes

- 修复部分文本错误
- **OScrollbar:** 修复 showType 为 hover 且使用 useScrollbar 时，hover 不显示滚动条问题;
- **OVirtualList:**
  - 修正 endIndex 计算不正确问题
  - 解决项较少，无滚动时，初始定位不正确导致显示错误问题
  - 修复容器通过 display：none 切换后，设置 scrollToView(0)，未正确滚动到指定问题问题
- **OInputNumber:** 修复在直接修改 modelValue 值情况下，导致后续输入之前的值不触发 change 问题
- **OOption:** 修复 OOption 组件 value 相同，label 不同时死循环 bug
- **OLink:** 修复箭头动画；修复多行文本下划线显示不正确问题
- **OCarousel:** 等待渲染完成后再调用 loopRange，修复轮播移动端移动过快消失的问题
- **OPagination:** 使用 defineModel 修复 pageSize、page 的双向绑定

## 0.0.69 2024-09-24

### Features

- **OFigure:** 为 figure 增加 load 事件
- **OScrollbar:** 支持设置 thumb 的最小尺寸
- **OVirtualList:** 新增虚拟列表，支持定高、动态高度,
- **OSelect:** 增加虚拟列表的示例、滚动条参数更改 scroller -> scrollbar
- **OPagination:** 支持虚拟列表展示下拉的页码数
- **ODialog:** 滚动条参数更改 scroller -> scrollbar, 重构弹窗间距样式，增加文本颜色变量（--dlg-color, --dlg-header-color）;
- **OPopup:** pad & phone 支持 trigger： 'none', 'click', 'click-outclick'
- **OCarousel:** 轮播组件悬浮暂停时将暂停事件抛出

### Bug Fixes

- **OTextarea:** 解决 textarea placeholder 文字颜色不正确的问题
- **OOption:** 修复禁用状态时，hover 样式错误问题

## 0.0.68 2024-08-12

- **OTable:** 插槽 head 更名为 header;
- **OPagination:** 支持 total 插槽;
- **OScroller:** 修复在设置 max-height 时无法滚动问题;
- **OTextarea:** 增加插槽 prepend、append，修复自动尺寸 bug；滚动使用 scroller；
- **OInput/OTextarea:** 修复样式未导出问题，组件光标从 pointer 更改为 text
- **OConfigProvider:** 增加全局配置项 link，可用于实际场景中，适配 router-link 等; 增加 tag 属性，支持自定义标签
- **OLink:** 增加 tag 属性，支持自定义标签
- **OForm:** 修复 input 事件不触发表单校验，涉及组件 input/textarea/inputNumber
- **OTab:** 新增 headerClass 类，支持自定义头部样式，比如 sticky;

## 0.0.67

- **OInput:** 重构 input，支持 autowidth，maxlength、minlength，无效值判断接口从 checkValid 更改为 validate，props 移除 parse
- **OTextarea:** 重构 textarea，长度限制提示支持国际化

## 0.0.66

- **OScrollbar\OScrollbar:** 重构 scroller 及 scrollbar, 支持 hook useScrollbar、指令 vScrollbar

## 0.0.65

- **OSelect:** 解决清除图标频繁动画触发的问题，修改下拉图标动效
- **OButton:** 修复 disabled/loading 状态时仍然触发 submit 事件
- **OTable:** 移除表格首尾间距样式
- **OScrollbar:** 不再导出 OScroller，增加 slot：thumb\track
- 更新全局 token 变量值
- 刷新部分英文文案

## 0.0.64

- **OSelect:** 修复多选时 v-model 失效问题 #I9IJT2

## 0.0.63

- 支持组件国际化(en\cn)
- 优化颜色变量
- **OSelect|OInput|OTextarea:** 优化交互样式
- **OSelect:** 修复无法默认选中 value 为 0 的 option
- **OUpload:** 移除 btnProps 属性

## 0.0.62

- **OCarousel:** 支持配置 pauseOnHover，控制是否在鼠标 hover 时，自动轮播停止，移除时恢复轮播
- **OSelect:** 支持下拉分组
- **OUpload:** 支持 v-model 受控模式
- **OScroller:** 支持 css 变量控制滚动槽位置

## 0.0.61

- **OTable:** 插槽更名：表头 th_xx; 表体 td_xx;
- 移除废弃的 flex 组件
- 升级 vue 到 3.4
- **use-theme:** 支持 SSR
- **OForm:** 修复提交按钮不触发校验问题
- **OInput:** 解决输入框自动填充时背景颜色不正确的问题

## 0.0.58

- **OFigure:** 刷新播放图标

## 0.0.57

- **OFigure:** 支持视频封面、标题
- **ODialog:** 新增支持设置移动端半屏

## 0.0.56

- **OCollapse\OMenu:** 展开时高度设置为 auto；
- **OToggle:** 支持单独使用；
- **ODialog:** 解决 dialog 移动端居中问题；
- **ODropdown:** 取消 dropdown 内容左右边距；
- **OCascader:** 解决 cascader 滚动条重叠问题

## 0.0.51 -

- 修复 layer 组件在卸载时，未移除挂载目标的相关类；
- 表格插槽支持自定义 td、th 内容；
- 修复 pagination 跳转输入框能输入小数问题；
- upload 增加 beforeSelect 入参
- 浮层蒙层共用，解决闪烁问题 todo

## 0.0.50 - 0620

- 优化 clickoutside，支持 touch，popover 支持移动端 touch 触发隐藏
- popup 宽度限制改为相对于屏幕
- 修复上传组件重复选择同一文件，不触发 change 事件问题
- invalid 属性从 input-number 组件移到 input 组件

## 0.0.26

- Card 去掉 titleMaxRow、detailMaxRow 属性，使用 css 变量设置： --card-title-max-row，--card-detail-max-row
- Figure 去掉 position、fit 属性，使用 css 变量设置：--figure-fit --figure-position
