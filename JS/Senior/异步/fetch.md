# Fetch

### 如何取消 fetch 请求

使用 AbortController 类, 允许开发人员使用信号来终止一个或多个 fetch 调用. 具体工作流程:

- 创建一个 AbortController 实例
- 使用该实例的 signal 属性, 作为 fetch 的 option
- 调用 AbortController 实例的 abort 方法, 即可取消所有使用该 signal 信号的 fetch
- 通过 catch 捕获 err.name === "AbortError" 的报错, 即为 abort 方法取消的请求

```js
const controller = new AbortController();
const { signal } = controller;

fetch("http://localhost:8000", { signal })
  .then((response) => {
    console.log(`Request 1 is complete!`);
  })
  .catch((e) => {
    console.warn(`Fetch 1 error: ${e.message}`);
  });

fetch("http://localhost:8000", { signal })
  .then((response) => {
    console.log(`Request 2 is complete!`);
  })
  .catch((e) => {
    console.warn(`Fetch 2 error: ${e.message}`);
  });

// Wait 2 seconds to abort both requests
setTimeout(() => controller.abort(), 2000);
```
