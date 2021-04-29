# debug

package.json 中的 scripts 命令里，启动时文件名前面加上 --inspect={port} 即可开启调试图标，启动服务后，在控制台顶部 elements 左侧有一个 node 的小图标，点开就是 node 的调试窗口，可以自定义断点进行调试。同时控制台顶部的 node 小图标变灰，终端中输出 Debugger attached 文案。

```shell
    nodemon --inspect=8001 index
```
