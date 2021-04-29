# 一些新的CSS属性
- scroll-behavior: smooth; 让滚动更丝滑，锚点跳转也会有滚动效果，常加在html、body上

### 设备独立像素、css像素、逻辑像素和物理像素
- 逻辑上展示出来的像素（偏小的那个）：设备独立像素 = css像素 = 逻辑像素 
- 物理上真实的像素（偏大的那个）：物理像素

dpr为2的话，就是一个2x2的物理像素，在逻辑上会展示成1个像素的形式

### 考虑屏幕 dpr -- 响应式图片
```css
<img 
    src="photo.png" 
    sizes="(min-width: 600px) 600px, 300px" 
    srcset="photo@1x.png 300w, photo@2x.png 600w, photo@3x.png 1200w"
>
```
- sizes="(min-width: 600px) 600px, 300px" 意思是：当前屏幕的css宽度大于600时，css宽度基准就是600，否则为300
- srcset="photo@1x.png 300w, photo@2x.png 600w, photo@3x.png 1200w" 意思是：首先会将w替换成 /css宽度基准，去计算出dpr，小于等于 300/css宽度基准 则用对应@xx的图
- egg：dpr为3，屏幕宽度为414px时，使用的是几倍图？
    - 屏幕宽度为414px，则基准为300，300 / 300 = 1、600 / 300 = 2、1200 / 300 = 4。 2 < 3 < 4，所以应该使用photo@3x.png这张图。

### 加载失败图片
```html
<img src="test.png" alt="图片描述" onerror="this.classList.add('error');">
```
```css
img.error {
    position: relative;
    display: inline-block;
}

img.error::before {
    content: "";
    /** 定位代码 **/
    background: url(error-default.png);
}

img.error::after {
    content: attr(alt);
    /** 定位代码 **/
}
```