# webpack

### CSS module 配置

在 css-loader 或 sass-loader 中，添加 options 为 modules 的键值对

```json
    {
        loader: "css-loader",
        options: {
            /***
            * 需要解决的问题
            * 全局污染
            * 命名混乱
            * 依赖管理不彻底
            * 无法共享变量
            * 代码压缩不彻底
            */
            modules: {  // 启用 css modules, css模块化, 所有类名都默认为当前组件, 或者使用 :global 声明全局样式, 参考 AntDesignPro 的样式引用
                localIdentName: '[name]__[local]--[hash:base64:5]'  // 指定样式名
                exportGlobals: true,	// 注意！:global 声明全局样式需要该属性
            },
        }
    }
```

### [webpack 编译过程的调试](https://cloud.tencent.com/developer/article/1356867)

- 在当前 webpack 项目工程文件夹下面，执行命令行：

  ```js
  node --inspect-brk ./node_modules/webpack/bin/webpack.js --inline --progress

  其中参数--inspect-brk 就是以调试模式启动 node：

  会观察到输出：

  Debugger listening on ws://127.0.0.1:9229/19421955-0f12-44c7-95da-fa5dd8384e04

  For help see https://nodejs.org/en/docs/inspector
  ```

- 打开 Chrome 浏览器，地址栏里输入 chrome://inspect/#devices：在弹出窗口点击超链接"Open Dedicated DevTools for Node. 此时在第一步的命令行窗口里，出现一行新的提示信息：debugger attached。Chrome 窗口弹出来了，断点停留在 webpack.js 第一行处。这个 webpack.js 就是我们之前命令行里指定的参数：node --inspect-brk ./node_modules/webpack/bin/webpack.js --inline --progress
- 然后点一下 Chrome 调试器里的“继续执行”，断点就提留在我们设置在 webpack.config.js 里的 debugger 断点了
