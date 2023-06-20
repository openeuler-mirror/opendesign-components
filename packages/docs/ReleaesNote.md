# 0.0.26

## card

- 去掉 titleMaxRow、detailMaxRow 属性，使用 css 变量设置： --card-title-max-row，--card-detail-max-row

## figure

- 去掉 position、fit 属性，使用 css 变量设置：--figure-fit --figure-position

# 0.0.50

- 优化 clickoutside，支持 touch，popover 支持移动端 touch 触发隐藏
- popup 宽度限制改为相对于屏幕
- 修复上传组件重复选择同一文件，不触发 change 事件问题
- invalid 属性从 input-number 组件移到 input 组件
