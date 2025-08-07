# TODO

1. pagination 支持 layout 控制顺序
2. carousel 增加鼠标 hover 停止轮播功能，支持是否循环 todo
3. 级联重构
4. virtualList 整改为 use-virtual-list
5. select 重构，通过 options 传列表数据
6. table 支持虚拟滚动，支持固定列，固定行
7. Tab 重构成分离 OTabs：OTabNav\OTabPane ?
8. dialog 移动端适配重构
9. figure preview loading 状态、多图滑动预览，单图全尺寸拖动查看

---

# 1.0.1

- feat

1. 重构多语言，增加词条可读性；支持useI18n在非组件中使用;
2. [utils]添加分批执行函数，可用于耗时的大量任务执行

# 1.0.0

- feat

1. [scrollbar] 支持监听内部唯一子元素尺寸改变
2. [collapse] 重构 Collapse，支持受控模式
3. [input] 新增对外接口：focus，blur，clear，togglePassword，inputEl
4. [textarea] 新增暴露 focus、blur、clear 接口;

- fix

1. [input] 阻止点击眼睛图标的事件冒泡，修复密码框在切换显示密码时，与外层 popover 显示逻辑冲突问题；
2. [textarea] 修复 limit 样式错误；limit 文本在圆角为 pill 时文本溢出问题；
3. [input/textarea] 修复 OInput 及 OTextarea 在发送验证码读秒等场景中，无法使用输入法输入中文内容的 bug
4. [link] 保证基线对其的情况下实现图标对齐
5. [input-number] 修复按钮宽度
6. [figure] 优化默认播放图标

# 0.0.78

- fix

1. [common] 使用线上@opensig/open-scripts 进行构建

# 0.0.77

- 无

# 0.0.76

- fix

1. [input/textarea] 修复点击清除按钮后，再点击其他区域无法失焦的问题；修复点击 prepend 和 append 区域无法触发失焦的问题

# 0.0.75

- feat

1. [popover/opoup] adaptive 接口控制是否自动边缘适配;

- fix

1. [popover/opoup] 修复闪烁问题; #IBXGTT
2. [textarea] 修复 textarea 高度设置问题; #IBXFY7
3. [input] 修复 input 样式变量书写错误问题;

# 0.0.74

- feat

1. [Input/textarea] onInvalidChange 修改为 valueForInvalid;样式重构;
2. [scrollbar] scrollbar 新增 barClass 接口，支持自定义类;
3. [dialog] actions 支持设置 loading、disabled 属性；新增 css 变量--dlg-actions-justify 控制 actions 布局;

- fix

1. [scrollbar] 修复频繁小段滚动时有几率会触发点击滚动轨道事件，导致滚动位置跳变;
2. [input] 修复 input 无法直接设置宽度问题;
3. [textarea] 修复 resize 时，文本域框可以调整到小于外容器宽度问题;
4. [tab] 修复 tab 标题动态变化时，滚动计算不正确问题;

# 0.0.73

- feat

1. [pagination] change 事件参数调整为对象，兼容老版本;
2. [layer] buttonClose 默认值从 true 修改为 false;
3. [form] 导出表单 provide 的 key，可支持自定义表单项

- fix

1. [link] 解决图标和文字未居中对齐问题
2. [input/textarea] 移除 beforeInput 属性；
3. [textarea] 修复 autoSize 下，设置最大高度后样式问题; 去掉 pressEnter 事件
4. [form] 修复 model 重新赋值后，校验值未同步更新问题

# 0.0.72

- feat

1. [Layer] 新增 buttonClose 字段，支持通过关闭图标关闭弹层
2. [Figure]
   - previewClose 新增 body 值，支持点击内容区域关闭预览
   - 移动端蒙层样式修改为黑色;
   - 原 slot "preview"修改为"preview-extra"，"preview"用于定制整个内容区域
3. [input-number]新增 clearValue，用于设置清空输入框时，失焦后的默认值

- fix

1. [input|input-number|textarea|radio|checkbox]表单输入 id 优化，支持 SSR
2. [pagination]修复第一次切换页码时，change 事件回调值不正确问题；pageSize 不在 pageSizes 内，使用默认的 pageSizes 第一项
3. 依赖升级 vite5 -> vite6 vue3.4 -> 3.5

# 0.0.71

1. 非稳定版本

# 0.0.70 2024-12-27

- feat

1. [VirtualList]
   - 虚拟列表支持数据动态追加（头部/尾部）；
   - 新增`renderChange`事件, 参数支持获取渲染可视区域序号；
   - 新增 defaultItemSize 字段，支持不定高时，设置项默认高度
   - API scrollToIndex => scrollToView
2. [message] 支持指定 message 显示到指定目标元素周围
3. 增加木兰许可证
4. [inBox]移除 input 属性
5. [Figure]
   - 新增 previewClose 属性，支持控制关闭 preview 的方式；
   - 支持通过 api：preivew 控制关闭预览
   - 支持懒加载 lazy
6. [Input/textarea]: 新增beforeInput，支持对输入控制
7. [hooks]
   - 重构 useIntersectionObserver 支持传入 options，添加 destroy 方法
   - 优化 useResizeObserver，添加 destroy 方法
8. [Link] 去掉 link 的 display：inline-flex 样式
9. [CascaderPanel]导出 OCascaderPanel 组件

- fix

1. 修复部分文本错误
2. [Scrollbar] 修复 showType 为 hover 且使用 useScrollbar 时，hover 不显示滚动条问题;
3. [VirtualList]
   - 修正 endIndex 计算不正确问题
   - 解决项较少，无滚动时，初始定位不正确导致显示错误问题
   - 修复容器通过 display：none 切换后，设置 scrollToView(0)，未正确滚动到指定问题问题
4. [InputNumber]修复在直接修改 modelValue 值情况下，导致后续输入之前的值不触发 change 问题
5. [Option]修复 OOption 组件 value 相同，label 不同时死循环 bug
6. [Link] 修复箭头动画；修复多行文本下划线显示不正确问题
7. [Carousel] 等待渲染完成后再调用 loopRange，修复轮播移动端移动过快消失的问题
8. [pagination]使用 defineModel 修复 pageSize、page 的双向绑定

# 0.0.69 2024-09-24

- feat

1. [Figure] 为 figure 增加 load 事件
2. [Scrollbar] 支持设置 thumb 的最小尺寸
3. [VirtualList] 新增虚拟列表，支持定高、动态高度,
4. [Select] 增加虚拟列表的示例、滚动条参数更改 scroller -> scrollbar
5. [Pagination] 支持虚拟列表展示下拉的页码数
6. [Dialog] 滚动条参数更改 scroller -> scrollbar, 重构弹窗间距样式，增加文本颜色变量（--dlg-color, --dlg-header-color）;
7. [Popup] pad & phone 支持 trigger： 'none', 'click', 'click-outclick'
8. [Carousel] 轮播组件悬浮暂停时将暂停事件抛出

- fix

1. [Textarea] 解决 textarea placeholder 文字颜色不正确的问题
2. [Option] 修复禁用状态时，hover 样式错误问题

# 0.0.68 2024-08-12

1. [Table] 插槽 head 更名为 header;
2. [pagination] 支持 total 插槽;
3. [scroller] 修复在设置 max-height 时无法滚动问题;
4. [textarea] 增加插槽 prepend、append，修复自动尺寸 bug；滚动使用 scroller；
5. [input/textarea] 修复样式未导出问题，组件光标从 pointer 更改为 text
6. [config-provider] 增加全局配置项 link，可用于实际场景中，适配 router-link 等; 增加 tag 属性，支持自定义标签
7. [link] 增加 tag 属性，支持自定义标签
8. [form] 修复 input 事件不触发表单校验，涉及组件 input/textarea/inputNumber
9. [Tab] 新增 headerClass 类，支持自定义头部样式，比如 sticky;

# 0.0.67

1. [input] 重构 input，支持 autowidth，maxlength、minlength，无效值判断接口从 checkValid 更改为 validate，props 移除 parse
2. [textarea] 重构 textarea，长度限制提示支持国际化

# 0.0.66

1. [scrollbar] 重构 scroller 及 scrollbar, 支持 hook useScrollbar、指令 vScrollbar

# 0.0.65

1. [select] 解决清除图标频繁动画触发的问题，修改下拉图标动效
2. [button] 修复 disabled/loading 状态时仍然触发 submit 事件
3. [table] 移除表格首尾间距样式
4. [scroller] 不再导出 OScroller，增加 slot：thum\track
5. 更新全局 token 变量值
6. 刷新部分英文文案

# 0.0.64

1. [select] 修复多选时 v-model 失效问题 #I9IJT2

# 0.0.63

1. 支持组件国际化(en\cn)
2. 优化颜色变量
3. [select|input|textarea] 优化交互样式
4. [select] 修复无法默认选中 value 为 0 的 option
5. [upload] 移除 btnProps 属性

# 0.0.62

1. [Carousel] 支持配置 pauseOnHover，控制是否在鼠标 hover 时，自动轮播停止，移除时恢复轮播
2. [select] 支持下拉分组
3. [upload] 支持 v-model 受控模式
4. [scroller] 支持 css 变量控制滚动槽位置

# 0.0.61

1. [table] 插槽更名：表头 th_xx; 表体 td_xx;
2. 移除废弃的 flex 组件
3. 升级 vue 到 3.4
4. [use-theme] 支持 SSR
5. [form] 修复提交按钮不触发校验问题
6. [input] 解决输入框自动填充时背景颜色不正确的问题

# 0.0.58

1. figure 刷新播放图标

# 0.0.57

1. figure 支持视频封面、标题
2. dialog 新增支持设置移动端半屏

# 0.0.56

1. collapse&menu 展开时高度设置为 auto；
2. toggle 支持单独使用；
3. 解决 dialog 移动端居中问题；
4. 取消 dropdown 内容左右边距；
5. 解决 cascader 滚动条重叠问题

# 0.0.51 -

1. 修复 layer 组件在卸载时，未移除挂载目标的相关类；
2. 表格插槽支持自定义 td、th 内容；
3. 修复 pagination 跳转输入框能输入小数问题；
4. upload 增加 beforeSelect 入参
5. 浮层蒙层共用，解决闪烁问题 todo

# 0.0.50 - 0620

1. 优化 clickoutside，支持 touch，popover 支持移动端 touch 触发隐藏
2. popup 宽度限制改为相对于屏幕
3. 修复上传组件重复选择同一文件，不触发 change 事件问题
4. invalid 属性从 input-number 组件移到 input 组件

# 0.0.26

1. Card 去掉 titleMaxRow、detailMaxRow 属性，使用 css 变量设置： --card-title-max-row，--card-detail-max-row
2. Figure 去掉 position、fit 属性，使用 css 变量设置：--figure-fit --figure-position
