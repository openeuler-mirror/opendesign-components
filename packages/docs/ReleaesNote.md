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
