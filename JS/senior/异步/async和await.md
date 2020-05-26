# async 和 await

## 一、介绍一下 async 和 await

- then 函数只是将 callback 进行了拆分
  then 函数本质还是 callback 的写法，只是对其实现了拆分，使其更方便管理
- async 和 await 是最直接的同步写法
  - async 和 await 方法是异步函数使用同步写法的终极版本，属于 es7 范畴，但是 es7 目前还只是草案，未曾发布，只不过 babel 目前已经支持，所以我们也可以用
  - 用法：
    - await 使用时，外层函数必须使用 async 标识
    - await 后面可以跟任何类型的数据, 包括异步方法的调用、普通方法的调用甚至是直接量.
      > async 的异步性质主要就体现在 await 这个关键字, await 等式及之前的代码都是同步执行, await 之后的代码都会放入异步队列执行. 可以通过下例见证.
      ```js
      (async () => {
        await console.log(22);
        console.log(33);
      })();
      (() => console.log(44))();
      // 执行结果: 22, 44, 33
      ```
    - 需要使用 babel-polyfill
  ```js
  async function load() {
    const result1 = await loadImg(url1);
    console.log(result1);
    const result2 = await loadImg(url2);
    console.log(result2);
  }
  load();
  ```
