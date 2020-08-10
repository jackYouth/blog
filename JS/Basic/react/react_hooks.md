# react hooks

### 简介

- 从什么时候开始支持的?
  - 从 16.8.0 开始支持, 使用时, react、react-dom 都必须是 16.8.0 及之后的版本
- 有哪些 hooks 能做而 class 做不了的
  - 自定义 hooks, 使组件复用更加灵活
- 有哪些 hooks 没有覆盖到的 class 的应用场景
  - getSnapshotBeforeUpdate, getDerivedStateFromError 和 componentDidCatch 等生命周期, 暂时没有等价的 hooks 实现
  - 一些第三方的库, 可能无法兼容 hooks
    > redux(v7.1.0 开始)、react-router(v5.1 开始)都已实现 hooks 的支持
- 项目中推荐使用一个 state 还是多个 state
  - 通常推荐拆成多个 state, 这样我们在更新其中一个 state 的时候, 不需要通过解构整个 state 来避免其他 state 的丢失
- 如何只在组件更新时运行 effect?
  - 定义一个 useRef, 用来标识是否是首次渲染
- 如何获取上一轮的 state 或 props?
  - 定义一个 useRef, 再使用一个 useEffect, 在里面将最新的 state 或 props 赋值给这个 ref, 这样每次组件更新时, ref 里是上一次的数据, 更新后, useEffect 中 ref 又会同步更新.
  - usePrevious 自定义 hooks 的封装:
    ```js
    // hooks
    function usePrevious(value) {
      const ref = useRef();
      useEffect(() => {
        ref.current = value;
      });
      return ref.current;
    }
    // Counter组件
    function Counter() {
      const [count, setCount] = useState(0);
      const prevCount = usePrevious(count);
      return (
        <h1>
          Now: {count}, before: {prevCount}
        </h1>
      );
    }
    ```
- 如何测量 dom 节点?
  - 如果用 useRef 的话, 那么当 ref 值变化的时候, 并不会通知我们
  - 所以可以考虑 callback ref 的形式, 这样即使子组件延迟显示(点击触发显示)了, 我们仍能在父组件接收到相关信息, 以便更新自组件中的尺寸.
  ```js
  function MeasureExample() {
    const [rect, ref] = useClientRect();
    return (
      <>
        <h1 ref={ref}>Hello, world</h1>
        {rect !== null && (
          <h2>The above header is {Math.round(rect.height)}px tall</h2>
        )}
      </>
    );
  }
  // 封装一个用于测量元素尺寸的hooks
  function useClientRect() {
    const [rect, setRect] = useState(null);
    const ref = useCallback((node) => {
      if (node !== null) {
        setRect(node.getBoundingClientRect());
      }
    }, []);
    return [rect, ref];
  }
  ```
- Effect 等方法的依赖列表中省略函数是否安全?
  - 一般来说, 是不安全的. 如果省略的这个函数中, 有用到依赖列表中没有的 state, 那么当这个 state 更新的时候, 这个函数是不会主动触发的, 就可能造成数据不是最新的情况.
  - 正确的做法:
    - 要么将函数放到 Effect 中, 或是放到组件外, 这样这个函数就不是或不来自组件的 state / props 了.
    - 将函数放到依赖项中, 使用 useCallback 包裹下这个函数(确保组件不随渲染而改变)

> react 的特性: state, context, refs ...等
> react 的工作方式: 组件, props, 自顶向下的数据流

## hooks 解决的问题

### 类组件的不足

- 组件的状态逻辑难复用
  - 类组件中状态逻辑的服用只能通过 HOC 或 render props 实现, 但是这种往往都会在原先的组件外层包一层标签(如: div), 导致层级冗余
    > render props 和 HOC 都是在组件内定义公共逻辑, 然后接收外来组件对其进行增强. render props 是以 props 的形式传递一个方法(该方法会返回需要被增强的组件)进入到高阶组件中; HOC 是一个高阶函数, 直接接收要被增强的组件.
- 组件趋向复杂难维护
  - 同一套逻辑写法分散, 容易出 bug (比如事件的注册在 componentDidMount 中, 卸载要在 componentWillUnmount 中)
  - 类组件中到处是对 state 的访问和处理(比如生命周期、方法、render 中), 导致组件难拆分
- this 指向问题
  - 父组件向子组件传递函数必须绑定 this
- 写法冗余
  - 每次定义 class 都需要一大堆 constructor, render, 生命周期这些东西

### hooks 的优势

- 优化上述类组件的三大不足
- 能在不修改组件结构的情况下复用状态逻辑(自定义 hooks, 不会新增标签嵌套)
- 能将组件中相互关联的部分拆分成更小的函数(比如: 对某个数据的设置订阅或请求数据都可以放在一个 effect 中)
- Hooks 使你在非 class 的情况下可以使用更多的 React 特性
- 渐进策略 (hooks 代码可以和当前代码同时工作, 我们可以渐进式的使用它们)

## hooks 方法简介

useState, useMemo, useCallback, useEffect, useRef

其中 useState, useMemo, useCallback 是同步执行的,

### useState

先来看一下 useState 源码中链表的实现:

```js
import React from "react";
import ReactDOM from "react-dom";

let firstWorkInProgressHook = { memoizedState: null, next: null };
let workInProgressHook;

function useState(initState) {
  let currentHook = workInProgressHook.next
    ? workInProgressHook.next
    : { memoizedState: initState, next: null };

  function setState(newState) {
    currentHook.memoizedState = newState;
    render();
  }
  // 这就是为什么 useState 书写顺序很重要的原因
  // 假如某个 useState 没有执行，会导致指针移动出错，数据存取出错
  if (workInProgressHook.next) {
    // 这里只有组件刷新的时候，才会进入
    // 根据书写顺序来取对应的值
    // console.log(workInProgressHook);
    workInProgressHook = workInProgressHook.next;
  } else {
    // 只有在组件初始化加载时，才会进入
    // 根据书写顺序，存储对应的数据
    // 将 firstWorkInProgressHook 变成一个链表结构
    workInProgressHook.next = currentHook;
    // 将 workInProgressHook 指向 {memoizedState: initState, next: null}
    workInProgressHook = currentHook;
    // console.log(firstWorkInProgressHook);
  }
  return [currentHook.memoizedState, setState];
}

function Counter() {
  // 每次组件重新渲染的时候，这里的 useState 都会重新执行
  const [name, setName] = useState("计数器");
  const [number, setNumber] = useState(0);
  return (
    <>
      <p>
        {name}:{number}
      </p>
      <button onClick={() => setName("新计数器" + Date.now())}>新计数器</button>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </>
  );
}

function render() {
  // 每次重新渲染的时候，都将 workInProgressHook 指向 firstWorkInProgressHook
  workInProgressHook = firstWorkInProgressHook;
  ReactDOM.render(<Counter />, document.getElementById("root"));
}

render();
```

从上面的源码实现我们可以得出:

- 每次渲染都会执行一次 useState, 形成独立的闭包 (里面所有的东西都是独立的, 属于此次更新的闭包环境)
  - 每次渲染都有自己的 props 和 state
  - 每次渲染都有自己的事件处理函数
  - 当点击状态更新时, 函数组件会被重新调用, 所以每次渲染都是独立的, 取到的值不会受到后面操作的影响
- 函数式更新
  - 可通过回调函数带参数的方式, 将当前的 state 传给 useState 中的 set 方法进行使用
    ```js
    setTimeout(() => {
      // setNumber(number+1);
      // 这样每次执行时都会去获取一遍 state，而不是使用点击触发时的那个 state
      setNumber((number) => number + 1);
    }, 3000);
    ```
- 惰性初始化 state
  - initialState 参数, 只会在组件初始化渲染的时候, 被赋予给 state, 之后不会起作用
  - initialState 可以传函数, 在函数内部可以进行复杂的运算, 返回值会作为初始值
- 每次有 useState 返回的 set 方法的调用, 都将会触发一次组件的更新检测(通过 Object.is 进行浅比较). 如果前后 state 没有发生变化, 组件是不会更新的
  > 这里特别注意下, 因为是浅比较, 所以要注意引用类型要通过展开运算符重新赋值
- set 方法类似与类组件中的 setState, 会对每次操作中所有的更新进行搜集, 然后统一更新. 注意: useState 的更新和 setState 不同, 它会直接替换原有值, setState 是合并

### useEffect

- useEffect 是一个异步执行的函数, 组件更新时会执行一次, 但是里面的函数, 会等到组件更新之后才会执行 (类似 class 组件中的 componentDidUpdate 这个生命周期, render 之后), 并且具体执不执行里面的回调, 要看依赖项是否改变. 依赖项的改变是看前后两个值 === 的比较.
- 每次组件更新之前, 都会先执行一次上一个 useEffect 中返回的函数, 这个函数中的 state 还是上一次的 state

### useMemo

- 返回一个 memoized (记忆)的数据
- 会去做一个判断, 如果

### useCallback

- 返回一个 memoized(记忆的)回调函数.
  > 类似于 class 中将方法定义在 this 上, 避免当作属性传递时引发子组件过度更新
- 把**内联回调函数**及依赖项数组作为参数传入 useCallback, 他将返回该回调函数的 memoized 版本, 该回调函数仅在某个依赖项改变时才会更新, 当你把这个函数传递给内部使用引用相等性去避免非必要渲染(如: shouldComponentUpdate)的子组件时, 他将非常有用.
- useCallback(fn, deps)相当于 useMemo(() => fn, deps)

> 依赖项数组并不会做为参数传递给回调函数. 虽然从概念上来说它表现为: 所有回调函数中引用的值都应该出现在依赖项数组中.

### [useImperativeHandle](https://zh-hans.reactjs.org/docs/hooks-reference.html?#useimperativehandle)

可以让你在使用 ref 时, 自定义暴露给父组件的实例值. 大多数情况下, 应当避免使用 ref 这样的命令式代码, 而是应该与 forwardRef 一起使用

```js
function FancyInput(props, ref) {
const inputRef = useRef();
useImperativeHandle(ref, () => ({
  focus: () => {
    inputRef.current.focus();
  }
}));
return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

在本例中, 渲染<FancyInput ref={fancyInputRef} />的副组件可以调用 fancyInputRef.current.focus().

### useReducer

```js
/****************** MainProvider.js begin ******************/

import React, { useEffect, useReducer, createContext } from "react";

// 创建context
export const MainContext = createContext({});

// 创建reducer
export const UPDATE_FOLDER_LIST = "UPDATE_FOLDER_LIST";

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_FOLDER_LIST:
      return {
        ...state,
        folderList: action.folderList,
      };
    default:
      return state;
  }
};

/**
 * 创建一个MainProvider组件, MainProvider包裹的所有组件都可以访问到value对应的属性
 */

const MainProvider = (props) => {
  const initialState = {
    folderList: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MainContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </MainContext.Provider>
  );
};
/****************** MainProvider.js end ******************/

/****************** MainProvider 包裹的子组件 begin ******************/
// 引入MainContext, 即可获取到 dispatch 方法和 state 数据
const { dispatch, folderList } = useContext(MainContext);
/****************** MainProvider 包裹的子组件 end ******************/
```

### memo

```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  与shouldUpdateComponent相反, 需要更新的话返回false(前后属性不一样), 不更新返回true
  */
}
export default React.memo(MyComponent, areEqual);
```

### 自定义 hooks

# hooks 注意事项

### state 的比较

hooks 中, state 的比较是浅比较, 通过 Object.is 来实现, 与 setState 不同的是, 如果传入的 state 值没有改变的话, 是不会重新渲染的;

比如:

```js
const NumCnt = () => {
  const [numObj, setNum] = useState({ num: 1 });
  return (
    <div
      onClick={() => {
        numObj.num = 2;
        setNum(numObj);
      }}
    >
      {numObj.num}
    </div>
  );
};
// 这时点击div, 组件是不会更新的
```

所以, 对于 state 是对象的, 我们一般会通过延展运算符去更新 state

```js
  onClick={() => {
    setNum({...numObj, num: 2});
  }}
```

### hooks 对生命周期的模拟

- componentDidMount
  ```js
  useEffect(() => console.log("mounted"), []);
  ```
- shouldComponentUpdate
  ```js
  const MyComponent = React.memo(
    _MyComponent,
    (prevProps, nextProps) => nextProps.count !== prevProps.count
  );
  ```
- componentDidUpdate
  ```js
  useEffect(() => console.log("mounted or updated"));
  ```
- componentWillUnMount
  ```js
  useEffect(() => {
    return () => {
      console.log("will unmount");
    };
  }, []);
  ```
  > 注意: useEffect 中, 每次依赖更新之后, 都会执行一次 return 的函数

### 不能模拟的生命周期

- getSnapshotBeforeUpdate
- getDerivedStateFromError
- componentDidCatch

### 浅比较和深比较

- 浅比较就是 === 进行的引用比较
- 深比较是对对象各级属性是否完全相等的一个比较

### useState 返回的 set 方法 和 setState 合并和批量 延迟(异步)处理的必要性和实现

- 必要性: 如果是同步的, 那么每次 setState 都会进行更新, 这样如果同时有多个 setState 操作, 对性能是一个巨大的浪费
- 实现:
  - 每次 setState 时, 都会将这次 state 的更新 push 到一个 dirtyComponents 的数组中, 并将更新的信号进行延迟
  - 直到所有的同步代码执行完毕后, 才会去处理这个 dirtyComponents 中保存的各个 state, 这些 state 会进行一个浅合并, 然后发送组件更新的信号, 将更新后的 state 派发到各个组件中, 完成 ui 的更新
    > 源码中, 是否 push 到 dirtyComponents 数组中, 其实是一个变量锁**isBatchingUpdates**控制的, 当 setState 的时候会调用 batchedUpdates 方法, 这个方法把 isBatchingUpdates 变为 true

### hooks 中的优化

- React.memo
  - 作用类似与 PureComponent, 优化父组件更新, 子组件跟着更新的问题
  - 会返回一个新组件, 基本用法: 传递给新组件的属性不变, 新组件就不会重新更新
- useCallback、useMemo
  - 返回一个记忆化的值, 只有依赖项改变后, 返回的值才会改变
