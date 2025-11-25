## 1.0.3

### Features

- **doc** 更新`changelog`,添加`breaking change`描述
- **OCarousel** 修复`hover`暂停播放时指示器不显示激活状态的问题

## 1.0.2

### Warning

本版本未包含[0.0.79](#0079)中的内容，建议升级到v1.0.3

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

本版本未包含[0.0.79](#0079)中的内容，建议升级到v1.0.3

### Features

- **utils:** 添加分批执行函数，可用于耗时的大量任务执行

### Code Refactoring

- **i18n:** 扁平化重构多语言，增加词条可读性；支持useI18n在非组件中使用;

## 1.0.0

### Warning

本版本未包含[0.0.79](#0079)中的内容

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
