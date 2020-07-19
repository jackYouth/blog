# mongoDB 使用 node 操作指南

> 该教程基于 mongodb npm 包

### 连接 mongodb

```js
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const dbUrl = "mongodb://localhost:29999";

MongoClient.connect(dbUrl, function (err, client) {
  // client即为连接后的mongo对象

  // 关闭mongodb
  client.close();
});
```

### 插入多个文本

```js
const insertDocuments = function (dbName, collectionName, data, callback) {
  // Use connect method to connect to the server
  MongoClient.connect(dbUrl, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany(data, function (err, result) {
      assert.equal(err, null);
      callback(result);
      client.close();
    });
  });
};
```

### 查看所有文本

```js
const findDocuments = function (dbName, collectionName, callback) {
  // Use connect method to connect to the server
  MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    // Get the documents collection
    const collection = db.collection(collectionName);

    collection
      .find()
      .sort({ createAt: -1 })
      .toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
        client.close();
      });
  });
};
```

// 查看符合条件的文本

```js


### 查看符合条件的文本
const findMatchDocuments = function (
  dbName,
  collectionName,
  matchObj,
  callback
) {
  // Use connect method to connect to the server
  MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    // Get the documents collection
    const collection = db.collection(collectionName);
    collection.find(matchObj).toArray(function (err, docs) {
      assert.equal(err, null);
      callback(docs);
      client.close();
    });
  });
};
```

### 更新文本

```js
const updateDocument = function (
  dbName,
  collectionName,
  matchObj,
  updateData,
  callback
) {
  // Use connect method to connect to the server
  MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Update document where a is 2, set b equal to 1
    collection.updateOne(matchObj, { \$set: updateData }, function (
      err,
      result
    ) {
      assert.equal(err, null);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
      client.close();
    });
  });
};
```

### 移除文本

```js
const removeDocument = function (dbName, collectionName, matchObj, callback) {
  // Use connect method to connect to the server
  MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Delete document where a is 3
    collection.deleteOne(matchObj, function (err, result) {
      assert.equal(err, null);
      callback(result);
      client.close();
    });
  });
};
```

### 为文档集合中的字段创建索引，提高性能

```js
const indexCollection = function (dbName, collectionName, matchObj, callback) {
  // Use connect method to connect to the server
  MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    // Get the documents collection
    const collection = db.collection(collectionName);
    db.collection(collectionName).createIndex(matchObj, null, function (
      err,
      results
    ) {
      console.log(results);
      callback();
      client.close();
    });
  });
};
```
