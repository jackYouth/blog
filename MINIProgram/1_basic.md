# 微信小程序
### 生命周期方法
- onLoad
  - 仅第一次加载时触发，其他页面返回至当前页面时不会触发
- onShow
  - 当页面展示时即会触发，生命周期中可多次触发，比如set to background后触发onHide再set to foreground就会触发onShow
- onReady
- onHide
  - 和onUnload不会同时触发，一般离开当前页面，不触发onUnload就会触发onHide，比如打开新页面
- onUnload
  - 打开新页面时，当前页面不会触发，重定向/页面返回/重启动时当前页面会触发

### 生命周期状态
start, inited, waiting data, ready, reRender, reRender..., end
