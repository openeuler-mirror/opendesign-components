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

# 0.0.53 -

TODO

1. pagination 支持 layout 控制顺序
2. carousel 增加鼠标 hover 停止轮播功能，支持是否循环 todo
