# JS 23 种设计模式

- [创建型](#创建型)
  - [单例模式](#单例模式)
  - [原型模式](#原型模式)
  - [构造器模式](#构造器模式)
  - [工厂模式](#工厂模式)
  - [抽象工厂模式](#抽象工厂模式)
- [结构型](#结构型)
  - [桥接模式](#桥接模式)
  - [外观模式](#外观模式)
  - [组合模式](#组合模式)
  - [装饰器模式](#装饰器模式)
  - [适配器模式](#适配器模式)
  - [代理模式](#代理模式)
  - [享元模式](#享元模式)
- [行为型](#行为型)
  - [迭代器模式](#迭代器模式)
  - [解释器模式](#解释器模式)
  - [观察者模式](#观察者模式)
  - [中介者模式](#中介者模式)
  - [访问者模式](#访问者模式)
  - [状态模式](#状态模式)
  - [备忘录模式](#备忘录模式)
  - [策略模式](#策略模式)
  - [模板方法模式](#模板方法模式)
  - [职责链模式](#职责链模式)
  - [命令模式](#命令模式)

# 创建型

## 单例模式

### 单例的目的

目的是实现 不管创建多少次, 都只会返回第一次创建的那个唯一的对象

### 单例的大致实现

```js
class SingleDog {
  show() {
    console.log("我是一个单例对象");
  }
  static getInstance() {
    // 判断是否已经new过1个实例
    if (!SingleDog.instance) {
      // 若这个唯一的实例不存在，那么先创建它
      SingleDog.instance = new SingleDog();
    }
    // 如果这个唯一的实例已经存在，则直接返回
    return SingleDog.instance;
  }
}

const s1 = SingleDog.getInstance();
const s2 = SingleDog.getInstance();

// true
s1 === s2;
```

### 单例的应用场景

保证多个页面中, 共用同一个实例时. 比如 vuex, 不管被安装多次, 但是只能有一个 Store. 这样才能保证, Store 中的数据是最新最全的.

> 如果 vuex 中没有实现单例的化, 当某处更新了 store, 下面又重新安装了一次 vuex, 这样之前的 Store 就被替换, 导致之前的数据操作都丢失了.

vuex 的工作原理: vuex 插件实际就是一个对象, 他在内部实现了 install 方法, 这个 install 方法会在 vuex 被安装时执行, 从而将 store 注入到 Vue 实例中. 也就是说 install 一次, 都会尝试向 Vue 实例中注入一个 Store.

```js
// 安装vuex插件
Vue.use(Vuex);

// 将store注入到Vue实例中
new Vue({
  el: "#app",
  store,
});

// ...(中间添加/修改了一些store的数据)

// 在后续的逻辑里不小心又安装了一次
Vue.use(Vuex);
```

## 原型模式

原型模式是基于构造函数模式出来的一种设计模式. 构造函数模式创建出的对象, 都有自己的属性和方法, 但是有些方法应该是共有的, 不应该每个实例都需要重复定义. 因此, 就有了原型模式, 原型模式解决了方法不共用的问题, 如果你想将一个方法提取为共用的, 只需绑定到 构造函数的 prototype 上即可.

> 在函数内通过 this 绑定的是实例的私有属性, 每次实例化时, 都会重新创建. 比如 this 绑定的方法, 两个实例对象点出来后并不相等.

> 绑定到构造函数的 prototype 上的属性和方法才是公有属性、方法, 每次实例化时不会重新创建.

```js
function Test() {}
Test.fn1 = () => console.log("test");
Test.prototype.fn2 = () => console.log("test");

const test1 = new Test();

console.log(test1.fn1); // undefined
console.log(test1.fn2); // () => console.log("test");
```

### 关于原型方面有三个重要的概念:

- prototype: 每一个构造函数(类)都会有的一个属性, 叫做显示原型对象, 是一个对象
- constructor: 每一个构造函数的显示原型(prototype)都会有一个 constructor 属性, 指回构造函数本身.
  > constructor 在 es6 的类语法中用处很大, 因为类语法接受不了参数, 所以一般都是通过 constructor 来接受参数并进行 this 绑定
- \_\_proto\_\_: 每一个实例都会有的一个属性, 叫做隐式原型对象, 他会指向所属类的 prototype

> 原型链: 其实就是一种属性的查找机制. 比如通过对象名.属性名获取属性值时, 会先在对象的私有属性上进行查找. 私有属性上没有, 会通\_\_proto\_\_向所属类的公有属性上查找, 还没找到的话, 会在通过所属类的\_\_proto\_\_属性向所属类的所属类的公有属性上查找...

### 原型模式中的 this

- 在类中, this 表示的是实例
- 在某一个方法中, this 表示的是 .方法 前的对象, 如果没有, 就是 window. (箭头函数的 this 会继承外层函数中的 this, 如果外层没有函数, 也是 window)

## 构造器模式

## 工厂模式

就是将创建对象的过程单独封装, 使用时只管无脑传参即可.

不论是 es5 还是 es6 的写法, 其底层是使用构造器实现的.

- 构造器: 本质是一个函数, 使用是用 new 来生成一个目标对象. 构造器的定义核心, 就是找到某类东西的变与不变.
- 简单工厂: 解决的是多个类的问题
- 抽象工厂: 解决多个工厂的问题

### 看一个例子

有一个员工系统, 需要对员工姓名、年龄、职位等信息进行录入.

这里如果给每个员工都声明一个对象字面量, 那么会有很多冗余代码, 比如 key 名.

但是如果使用构造器的话, 就只需要传入对应的值, 就可以直接生成对应的对象. 这样将不变的共性(属性名)封装了起来, 同时又把变化的个性(属性值)开放了出来.

```js
function User(name , age, career, work) {
    this.name = name
    this.age = age
    this.career = career
    this.work = work
}

function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug']
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...

    return new User(name, age, career, work)
}
```

> 构造器解决的是多个对象实例的问题, 简单工厂解决的是多个类的问题, 抽象工厂是用来解决多个工厂的问题.

> 开放封闭原则: 对扩展开放, 对修改封闭. 即: 实体(类, 模块, 函数)可以扩展, 但是不可修改

## 抽象工厂模式

用来解决非常复杂的业务, 这种复杂度的业务, 往往是需要多个工厂进行组装, 才能实现.

上述简单工厂的最终实现, 还是很粗糙的, 比如用一个工厂去同时创建员工和老板这两个角色, 权限的定义上就很麻烦, 只能在工厂函数中去单独做判断, 这样每个角色一个判断, 代码就非常的胖. 这样会造成的问题有:

- 没有适当的解耦, 一旦有 bug, 整个 Factory 就会崩坏
- Factory 的庞大体积、臃肿逻辑, 会使得维护的人, 每次更改时, 都要花费大量的时间去熟悉代码
- 代码逻辑冗在一起, Factory 的每次更改, 都要测试同学进行全面的回归, 增加了测试成本

所以, 对于复杂业务, 我们需要对结构进行进一步的抽象. 比如: 对于我要开一个手机厂这个业务:

- 首先我们可以新建一个 MobilePhoneFactory 工厂, 明确我们的生产方案

```js
class MobilePhoneFactory {
  // 提供操作系统的接口
  createOS() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
  }
  // 提供硬件的接口
  createHardWare() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
  }
}
```

- 根据这个方案的某一条生产线, 化抽像为具体, 比如生产一个 Android 系统、高通硬件的手机生产线, 名字叫 FakeStar, 这时我们可以为 FakeStar 定义一个工厂 FakeStarFactory

```js
class FakeStarFactory extends MobilePhoneFactory {
  createOS() {
    // 提供安卓系统实例
    return new AndroidOS();
  }
  createHardWare() {
    // 提供高通硬件实例
    return new QualcommHardWare();
  }
}
```

对于上面的 AndroidOS 来说, 它是一个具体产品, 具体产品往往不会只有一个, 这里就还有 iOS, 它们的相同点是都是操作系统, 都有着操作手机硬件系统这一基本功能, 所以我们可以用一个抽象产品, 来声明这类产品最基本的功能.

```js
// 定义操作系统这类产品的抽象产品类
class OS {
  controlHardWare() {
    throw new Error("抽象产品方法不允许直接调用，你需要将我重写！");
  }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
  controlHardWare() {
    console.log("我会用安卓的方式去操作硬件");
  }
}

class AppleOS extends OS {
  controlHardWare() {
    console.log("我会用🍎的方式去操作硬件");
  }
}
...

// 同样的可以定义手机硬件这类产品的抽象产品类
class HardWare {
    // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
    operateByOrder() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
    operateByOrder() {
        console.log('我会用高通的方式去运转')
    }
}
...
```

这样我们最终创建一个 FakeStar 的时候, 只需要:

```js
// 这是我的手机
const myPhone = new FakeStarFactory();
// 让它拥有操作系统
const myOS = myPhone.createOS();
// 让它拥有硬件
const myHardWare = myPhone.createHardWare();
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare();
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder();
```

最重要的, 如果我们要推出一款新手机的时候, 我们不需要对 MobilePhoneFactory 做任何修改, 只需要新建 NewFakeStarFactory 即可, 这样对之前的 FakeStarFactory 并没有什么影响.

```js
class newStarFactory extends MobilePhoneFactory {
  createOS() {
    // 操作系统实现代码
  }
  createHardWare() {
    // 硬件实现代码
  }
}
```

### 抽象工厂总结

抽象工厂模式的定义，是围绕一个超级工厂创建其他工厂. 根据类的性质划分, 会有这样四个关键角色:

- 抽象工厂: MobilePhoneFactory
- 具体工厂: FakeStarFactory
- 抽象产品: OS
- 具体产品: AndroidOS

> 一般用来继承的, 都是抽象的工厂/类, 用来 new 的都是具体的工厂/类.
>
> 抽象的工厂/类中, 会定义这类东西的基本功能, 但是里面不会有功能的具体实现, 具体实现会放到具体的工厂/类在继承时实现

# 结构型

## 桥接模式

## 外观模式

## 组合模式

## 装饰器模式

## 适配器模式 (Adapter)

主要是用来**抹平不同使用场景下的差异**, 其优势是只需要在引入接口的时候, 进行一次适配, 便可轻松 cover 掉业务里可能会有的多次调用. 比如使用 axios 去适配目前项目中的 ajax:

- 新建一个 AjaxAdapter 函数, 函数入参和之前的 ajax 入参保持一致, 其内的具体实现是用 axios 完成
- 改造之前的 ajax 方法, 用 AjaxAdapter 进行适配
  ```js
  // 用适配器适配旧的Ajax方法
  async function Ajax(type, url, data, success, failed) {
    await AjaxAdapter(type, url, data, success, failed);
  }
  ```
- 适配完成, ajax 的使用处无需修改

> 一个比较好的适配器的自我修养: 把变化留给自己, 把统一留给用户. 比如 axios, 其内 http 模块、 xhr 的实现细节, 全都被 adapter 封装到自己复杂的底层逻辑中了, 暴露给用户的都是十分简单统一的东西, 统一的入参, 出参, 规则.

## 代理模式

## 享元模式

# 行为型

## 迭代器模式

## 解释器模式

## 观察者模式

## 中介者模式

## 访问者模式

## 状态模式

## 备忘录模式

## 策略模式

主要用于处理多条件判断的场景, 用来改造代码中的 if-else 结构.

### 先来看一个真实场景

现在有一个差异化询价的需求, 要求:

- 价格类型为预售价时, 满 100 - 20, 不满打 9 折
- 当价格类型为“大促价”时，满 100 - 30，不满 100 打 8 折
- 当价格类型为“返场价”时，满 200 - 50，不叠加
- 当价格类型为“尝鲜价”时，直接打 5 折

常见的基础版本, 就是写个函数, 里面用 if-else 枚举搞定.但是这样会有两个问题:

- 违反了单一功能原则, 一个 function 中处理了四块逻辑, 函数看起来也过于肥胖, 这样会带来:

  - 1, 一行代码有问题, 整个询价系统就会崩坏
  - 2, 错误不好定位, 需要把整个询价系统从开到尾看一遍
  - 3, 单个功能不好复用

  > 所以对于胖逻辑, 第一反应就是要拆

- 违反了开放封闭原则, 加入后期如果要扩展, 加一个新人价, 就只能在原来的函数里面加一个 if-else, 这样会带来:
  - 1, 整个询价逻辑都需要进行回归测试, 增加测试成本
  - 2, 需要重新熟悉整个询价逻辑, 并选择合适的地方加 if-else

### 重构询价逻辑

首先我们来捋一下, 这个询价逻辑主要就两步:

- 询价逻辑的分发 (对应开放封闭原则)
- 具体逻辑的执行 (对应单一功能原则)

#### 单一功能的改造

只需要将每个 if-else 对应的处理, 专门封装成一个函数即可

```js
// 处理预热价
function prePrice(originPrice) {
  if (originPrice >= 100) {
    return originPrice - 20;
  }
  return originPrice * 0.9;
}

// 处理大促价
function onSalePrice(originPrice) {
  if (originPrice >= 100) {
    return originPrice - 30;
  }
  return originPrice * 0.8;
}

// 处理返场价
function backPrice(originPrice) {
  if (originPrice >= 200) {
    return originPrice - 50;
  }
  return originPrice;
}

// 处理尝鲜价
function freshPrice(originPrice) {
  return originPrice * 0.5;
}

function askPrice(tag, originPrice) {
  // 处理预热价
  if (tag === "pre") {
    return prePrice(originPrice);
  }
  // 处理大促价
  if (tag === "onSale") {
    return onSalePrice(originPrice);
  }

  // 处理返场价
  if (tag === "back") {
    return backPrice(originPrice);
  }

  // 处理尝鲜价
  if (tag === "fresh") {
    return freshPrice(originPrice);
  }
}
```

#### 开放封闭原则的改造

需要找到一个方式, 既能帮我们明确标签和处理函数的映射关系, 又能不破坏代码的灵活性(标签和函数两者可以分离, 后期可以扩展). 思考一下, 对象映射, 是不是完美符合.

```js
// 把询价算法全都收敛到一个对象里
// 定义一个询价处理器对象
const priceProcessor = {
  pre(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 20;
    }
    return originPrice * 0.9;
  },
  onSale(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 30;
    }
    return originPrice * 0.8;
  },
  back(originPrice) {
    if (originPrice >= 200) {
      return originPrice - 50;
    }
    return originPrice;
  },
  fresh(originPrice) {
    return originPrice * 0.5;
  },
};

// 当我们想使用其中某个询价算法的时候：通过标签名去定位就好了：
// 询价函数
function askPrice(tag, originPrice) {
  return priceProcessor[tag](originPrice);
}

// 后期扩展时, 只需要
priceProcessor.newUser = function (originPrice) {
  if (originPrice >= 100) {
    return originPrice - 50;
  }
  return originPrice;
};
```

> 这就是策略模式, 将一个个逻辑单个封装, 并且使他们可以在外部进行替换和新增

## 模板方法模式

## 职责链模式

## 命令模式
