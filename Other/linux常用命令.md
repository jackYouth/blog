# linux 常用命令

### 查看当前端口

lsof -i:端口号

示例:

```js
# lsof -i:8000
COMMAND   PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
nodejs  26993 root   10u  IPv4 37999514      0t0  TCP *:8000 (LISTEN)
```

输出各列信息如下:

- COMMAND: 进程的名称
- PID: 进程的标识符
- USER: 进程所有者
- FD: 文件描述符, 应用程序通过文件描述符识别该文件, 如 txt、cwd 等
- TYPE: 文件类型, 如: DIR、REG 等
- DEVICE: 指定磁盘名称
- SIZE: 文件的大小
- NODE: 索引节点(文件在磁盘上的标识)
- NAME: 打开文件的确切名称

#### 拓展

lsof(list open files)是一个列出当前系统打开文件的工具。

### 杀掉端口占用的进程

kill -9 <PID>

示例:
比如杀掉刚才的 8000 进程: kill -9 26993

### grep

查询内容的命令，比如 grep -ri 'appid' ../atlanta --exclude-dir=node_mo\* ，就是查询上级 atlanta 目录下排除 node_mo 开头文件夹后包含 appid 的文件和内容，递归并忽略大小写

- -r 递归查找
- -i 忽略大小写
- --exclude-dir=node_modu\* 忽略以 node_modu 开头的目录
