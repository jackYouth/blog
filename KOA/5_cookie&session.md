# cookie & session

### cookie

koa 中可以直接调用 ctx 上的 cookie 对象，来进行 cookie 的获取和设置：

- ctx.cookie.get(name, [options])读取上下文请求中的 cookie
- ctx.cookie.set(name, value,[options])在上下文中写入 cookie

ctx 下的 cookies 实现使用了 npm 的 cookie 模块，所以使用方式和该模块一致

```js
ctx.cookies.set("cid", "hello koa", {
  domain: "localhost", // cookie所在的域名
  path: "/users", // cookie所在的路径
  maxAge: 10 * 60 * 1000, // 有效时长
  expires: new Date("2021-03-12"), // 失效时间
  httpOnly: false, // 是否只用于http请求
  overwrite: false, // 是否允许重写
})
console.log(
  "===========cookies cid:",
  ctx.cookies.get("cid") // signed设置为true 表示加密, 默认false
)
```

### session

koa 原生并没有提供对 session 操作，所以我们只能通过中间件的形式实现，中间件可以自己写也可以直接用第三方。session 的实现一般是有两种：

- session 数据量很小时，直接存在内存中
- session 数据量很大时，则需要存在外部介质中，比如数据库

将 session 存在 mysql 中的步骤：

- 中间件准备：
  - koa-session-minimal，提供 koa 操作 session 的功能。里面有一个参数是存储介质中 session 操作的方法
  - koa-mysql-session，提供 mysql 数据库的 session 数据读写操作
- 将 sessionId 和对应数据存储到数据库
- 将数据库存储的 sessionId 存储到页面的 cookie 中
- 根据页面 cookie 的 sessionId 去获取对应 session 信息

<!-- TODO: 没有安装mysql，所以还没有试session有没有成功 -->

```js
const Koa = require("koa")
const session = require("koa-session-minimal")
const MysqlSession = require("koa-mysql-session")

const app = new Koa()

// 配置存储session信息的mysql
let store = new MysqlSession({
  user: "root",
  password: "abc123",
  database: "koa_demo",
  host: "127.0.0.1",
})

// 存放sessionId的cookie配置
let cookie = {
  maxAge: "", // cookie有效时长
  expires: "", // cookie失效时间
  path: "", // 写cookie所在的路径
  domain: "", // 写cookie所在的域名
  httpOnly: "", // 是否只用于http请求中获取
  overwrite: "", // 是否允许重写
  secure: "",
  sameSite: "",
  signed: "",
}

// 使用session中间件
app.use(
  session({
    key: "SESSION_ID",
    store: store,
    cookie: cookie,
  })
)

app.use(async (ctx) => {
  // 设置session
  if (ctx.url === "/set") {
    ctx.session = {
      user_id: Math.random().toString(36).substr(2),
      count: 0,
    }
    ctx.body = ctx.session
  } else if (ctx.url === "/") {
    // 读取session信息
    ctx.session.count = ctx.session.count + 1
    ctx.body = ctx.session
  }
})

app.listen(3001)
console.log("[demo] session is starting at port 3001")
```
