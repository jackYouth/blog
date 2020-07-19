# React Advanced API

### Context

用于向后代组件跨层级传值, 核心 API 有以下几个:

- React.createContext
  - 创建一个 Context 对象, 当 React 渲染了一个订阅了这个 Context 对象的组件时, 这个组件会从组件树中离自己最近的那个匹配 Provider 中读取当前的 context 值
- Context.Provider
  - 接收一个 value 属性, 传递给消费组件, 允许消费组件订阅 context 的更新. 一个 Provider 可以和多个消费组件有对应关系, 多个 Provider 也可以嵌套使用, 使用时里层的会覆盖外层的数据.
- Class.contextType
  - class 型组件中对 context 的订阅, 挂载在 class 伤的 contextType 属性, 会被重新赋值为一个由 React.createContext()创建的 Context 对象, 这时就可以在任何生命周期中(包括 render)使用 this.context 来消费最近的 Provider 传入的 context 了.
    > 该方式只能订阅单个 context
- Context.Consumer
  - 函数式/class 型组件中对 context 的订阅, 会返回一个 React 节点, 传递给函数的 value 值, 等于往上组件树中最近的相关 Provider 提供的 value, 如果没有则默认 createContext 时的 defaultValue.
- useContext
  - 函数式组件中对 context 的订阅, 接收一个 Context 对象, 并返回该 context 的当前值, 当前值由往上组件树中最近的 Provider 的 value 决定.

#### 使用

创建 Context => Provider 提供值 => Consumer 消费值

#### 示例: 共享主题色

- Context.js
  ```js
  import React from "react";
  export const ThemeContext = React.createContext({ themeColor: "pink" });
  export const UserContext = React.createContext();
  ```
- pages/ContextPage.js

  ```js
  import React, { Component } from "react";
  import ContextTypePage from "./ContextTypePage";
  import { ThemeContext, UserContext } from "../Context";
  import UseContextPage from "./UseContextPage";
  import ConsumerPage from "./ConsumerPage";
  export default class ContextPage extends Component {
    constructor(props) {
      super(props);
      this.state = { theme: { themeColor: "red" }, user: { name: "xiaoming" } };
    }
    changeColor = () => {
      const { themeColor } = this.state.theme;
      this.setState({
        theme: { themeColor: themeColor === "red" ? "green" : "red" },
      });
    };
    render() {
      const { theme, user } = this.state;
      return (
        <div>
          <h3>ContextPage</h3>
          <button onClick={this.changeColor}>change color</button>
          <ThemeContext.Provider value={theme}>
            <ContextTypePage />
            <UserContext.Provider value={user}>
              <UseContextPage />
              <ConsumerPage />
            </UserContext.Provider>
          </ThemeContext.Provider>
          <ContextTypePage />
        </div>
      );
    }
  }
  ```

- pages/ContextTypePage.js

  ```js
  import React, { Component } from "react";
  import { ThemeContext } from "../Context";
  export default class ContextTypePage extends Component {
    static contextType = ThemeContext;
    render() {
      const { themeColor } = this.context;
      return (
        <div className="border">
          <h3 className={themeColor}>ContextTypePage</h3>
        </div>
      );
    }
  }
  ```

- pages/ConsumerPage.js

  ```js
  import React, { Component } from "react";
  import { ThemeContext, UserContext } from "../Context";
  export default class ConsumerPage extends Component {
    render() {
      return (
        <div className="border">
          <ThemeContext.Consumer>
            {" "}
            {(themeContext) => (
              <>
                <h3 className={themeContext.themeColor}>ConsumerPage</h3>
                <UserContext.Consumer>
                  {" "}
                  {(userContext) => <HandleUserContext {...userContext} />}
                </UserContext.Consumer>
              </>
            )}
          </ThemeContext.Consumer>
        </div>
      );
    }
  }
  function HandleUserContext(userCtx) {
    return <div>{userCtx.name}</div>;
  }
  ```

- useContextPage

  ```js
  import React, { useContext } from "react";
  import { ThemeContext, UserContext } from "../Context";
  export default function UseContextPage(props) {
    const themeContext = useContext(ThemeContext);
    const { themeColor } = themeContext;
    const userContext = useContext(UserContext);
    return (
      <div className="border">
        <h3 className={themeColor}>UseContextPage</h3>
        <p>{userContext.name}</p>
      </div>
    );
  }
  ```

### HOC
> HOC本身不是React API的一部分, 它是一种基于React组合特性而形成的一种设计模式, 用于复用组件逻辑的一种高级技巧
#### 定义
高阶组件其实是一个函数, 它的参数是一个组件, 返回值是一个新组件
#### 意义
为了提高组件的复用性, 我们一般会保证组件的功能单一性. 但在某些复杂场景下, 会需要对这些功能单一的组件进行扩展, 这时就有了Hoc (Higher-order Components)的概念.
#### 基本使用
```js
  // Homepage.js
  import React, {Component} from "react";

  // hoc: 是一个函数，接收⼀个组件，返回另外一个组件
  //这⾥大写开头的Cmp是指function或者class组件
  const foo = Cmp => props => {
    return (
      <div className='border'><Cmp {...props} /></div>
    )
  }
  const foo2 = Cmp => props => {
    return (
      <div className='greenBorder'><Cmp {...props} /></div>
    )
  }

  function Child(props) {
    return (
      <div>Child {props.name}</div>
    )
  }

  const Foo = foo(Child)

  export default class HocPage extends Component {
    render() {
      return (
        <div>
          <h3>HocPage</h3>
          <Foo name="msg" />
        </div>
      );
    }
  }
```
#### 链式调用
这里Hoc函数可以进行链式调用, 如: foo2(foo(foo(Child))), 给Child加三层边框
#### 装饰器写法
高阶组件本身就是对装饰器模式的应用, 所以可以应用ES7中的装饰器语法来更优雅的进行代码书写.
- 使项目支持装饰器写法
  - yarn add @babel/plugin-proposal-decorators
  - 更新config-overrides.js
    ```js
     //配置完成后记得重启下
     const { addDecoratorsLegacy } =require("customize-cra");module.exports=override(
       ...,addDecoratorsLegacy()//配置装饰器器
     );
    ```
  - 如果vscode对装饰器器有warning，vscode设置⾥里里加上
    ```js
     // javascript.implicitProjectConfig.experimentalDecorators": true
    ```
- 装饰器应用
  ```js
  @foo
  @foo2
  @foo
  class Child extends Component {
    render() {
      return (
        <div>Child {this.props.name}</div>
      );
    }
  }
  ``` 
  > 装饰器器只能⽤用在class上
  > 执⾏行行顺序从下往上
#### HOC注意事项
- 不要在render方法中使用
  - React的diff算法是根据组件标识来确定, 它是应该更新子树还是重新挂载.
  - 如果render返回的组件和上一次渲染的组件相同时, react会对新旧子树进行递归遍历更新, 有性能问题
  - 如果不同, 会导致子树每次渲染都会卸载、重新挂载的操作. 重新挂载会导致组件及所有子组件状态丢失
