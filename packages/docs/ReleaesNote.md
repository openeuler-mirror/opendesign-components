# 0.0.26

1. Card 去掉 titleMaxRow、detailMaxRow 属性，使用 css 变量设置： --card-title-max-row，--card-detail-max-row
2. Figure 去掉 position、fit 属性，使用 css 变量设置：--figure-fit --figure-position

# 0.0.50 - 0620

1. 优化 clickoutside，支持 touch，popover 支持移动端 touch 触发隐藏
2. popup 宽度限制改为相对于屏幕
3. 修复上传组件重复选择同一文件，不触发 change 事件问题
4. invalid 属性从 input-number 组件移到 input 组件

# 0.0.51 -

1. 修复 layer 组件在卸载时，未移除挂载目标的相关类；
2. 表格插槽支持自定义 td、th 内容；
3. 修复 pagination 跳转输入框能输入小数问题；
4. upload 增加 beforeSelect 入参
5. 浮层蒙层共用，解决闪烁问题 todo

# 0.0.53

# 0.0.56

1. collapse&menu 展开时高度设置为 auto；
2. toggle 支持单独使用；
3. 解决 dialog 移动端居中问题；
4. 取消 dropdown 内容左右边距；
5. 解决 cascader 滚动条重叠问题

# 0.0.57

1. figure 支持视频封面、标题
2. dialog 新增支持设置移动端半屏

# 0.0.58

1. figure 刷新播放图标

TODO

1. pagination 支持 layout 控制顺序
2. carousel 增加鼠标 hover 停止轮播功能，支持是否循环 todo
3. 级联重构

# 0.0.61

1. [table] 插槽更名：表头 th_xx; 表体 td_xx;
2. 移除废弃的 flex 组件
3. 升级 vue 到 3.4
4. [use-theme] 支持 SSR
5. [form] 修复提交按钮不触发校验问题
6. [input] 解决输入框自动填充时背景颜色不正确的问题

# 0.0.62

1. [Carousel] 支持配置 pauseOnHover，控制是否在鼠标 hover 时，自动轮播停止，移除时恢复轮播
2. [select] 支持下拉分组
3. [upload] 支持 v-model 受控模式
4. [scroller] 支持 css 变量控制滚动槽位置

# 0.0.63

1. 支持组件国际化(en\cn)
2. 优化颜色变量
3. [select|input|textarea] 优化交互样式
4. [select] 修复无法默认选中 value 为 0 的 option
5. [upload] 移除 btnProps 属性

# 0.0.64

1. [select] 修复多选时 v-model 失效问题 #I9IJT2
