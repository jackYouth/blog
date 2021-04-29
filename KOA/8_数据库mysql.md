# 数据库 mysql

安装 nodejs 的 mysql 模块，该模块是 node 操作 mysql 的引擎，有了它我们就可以在 node 环境下对 mysql 数据库进行建表、增、删、改、查等操作。

```shell
npm i mysql -S
```

### 创建数据库会话

```js

```

> 注意：一个事件就要有一个从开始到结束的过程，数据库会话操作执行完之后，就要关闭，以免占用链接资源

### 创建数据连接池

一般来说，操作数据库是很复杂的读写过程，不只是一个会话，如果直接用会话操作的话，就需要每次为会话配置连接参数，这种肯定很麻烦，所以我们这时候就需要连接池来管理会话

```js

```

### 使用 async/await 封装 sql 使用

```js
// 创建数据连接池
const pool = mysql.createPool({
  host: "", // 数据库地址
  user: "", // 数据库用户
  password: "", // 数据库密码
  database: "", // 选中的数据库
})
// 连接池中进行会话操作
pool.getConnection((err, connection) => {
  if (err) throw err
  connection.query("SELECT * FROM my_table", (err, results, fields) => {
    if (err) throw err

    // 结束会话
    connection.release()
  })
})

// async/await优化封装
// 创建数据连接池
const pool = mysql.createPool({
  host: "", // 数据库地址
  user: "", // 数据库用户
  password: "", // 数据库密码
  database: "", // 选中的数据库
})
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    // 连接池中进行会话操作
    pool.getConnection((err, connection) => {
      if (err) reject(err)
      connection.query(sql, values, (err, rows) => {
        if (err) reject(err)

        resolve(rows)

        // 结束会话
        connection.release()
      })
    })
  })
}

module.exports = {
  query,
}

// 使用时
const selectAllData = async () => {
  const sql = "SELECT * FROM my_table"
  const dataList = await query(sql)
  return dataList
}

const getAllData = async () => {
  let dataList = await selectAllData()
  console.log("=========all data: ", dataList)
}
```

### 数据库简单操作

- mysql
  - createConnection 创建数据库一个连接
  - createPool 创建一个数据连接池
- pool
  - getConnection 从连接池中取出一个连接，如无连接则隐式创建一个数据库连接
  - end 将关闭连接池
- connection
  - query 执行 sql 语句
  - release 将连接返回数据连接池(只有通过 pool.getConnection 方法返回的数据连接池中的 connection 才有该方法)
  - destroy 将连接从连接池中移出 / 关闭连接
  - end 关闭连接，跟 destroy 方法的区别是它接收一个回调函数(数据连接池中的连接没有该方法)

### 建表初始化

通常初始化数据库都需要建很多表，特别是开发过程中表结构是会变的，导致不能直接复制变化后的表，所以我们需要封装一个初始化数据库建表的方法，这样当每次需要重新建表，执行一下这个脚本方法就好。脚本实现的核心就是 fs 读取一些 sql 文件，切成一条条的数组后，逐个调用上面封装的 query 方法执行。
[建表初始化 demo 源码](https://github.com/ChenShenhai/koa2-note/blob/master/demo/mysql/)
