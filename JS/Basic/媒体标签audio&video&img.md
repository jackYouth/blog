# 媒体标签
常用的媒体标签有三个：audio（音频）、video（视频）、img（图片）

### audio
两种使用方法，一种标签形式，一种实例对象形式
- 标签形式
  - <audio  />
- 实例对象形式 （兼容性好，微信浏览器中也可复用部分代码）
  - 首先实例化出一个音频实例，然后就可以调用该实例上的一些方法和属性来操纵音频，如play、duration。。。
  ```js
    const audio = new Audio("./musics/bgm.mp3")
    const duration = audio.duration;
    const playFn = () => audio.play()
    playFn()
    window.setInterval(playFn, duration * 1000 + 1000)
  ``` 