# 常用的工具函数

### 图片 url 转 base64

```js
const getBase64Image = (img, width, height) => {
  let canvas = document.createElement("canvas");
  canvas.width = width ? width : img.width;
  canvas.height = height ? height : img.height;

  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png", 0.8);
};

function createImagePromise(src) {
  return new Promise((resolve) => {
    let img = new Image();

    img.crossOrigin = "";
    img.src = src;

    img.onload = function () {
      resolve(getBase64Image(img));
    };
    img.onerror = function () {
      resolve(false);
    };
  });
}

createImagePromise(
  "https://img.bosszhipin.com/beijin/mcs/useravatar/20180323/ede4fa487d36947e1751f886378973f3cfcd208495d565ef66e7dff9f98764da_s.jpg"
).then((res) => console.log(res));
```
