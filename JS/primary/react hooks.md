# react hooks

### 简介

- 从什么时候开始支持的?
  - 从 16.8.0 开始支持, 使用时, react、react-dom 都必须是 16.8.0 及之后的版本
- 有哪些 hooks 能做而 class 做不了的
  - 自定义 hooks, 使组件复用更加灵活
- 有哪些 hooks 没有覆盖到的 class 的应用场景
  - getSnapshotBeforeUpdate、getDerivedStateFromError 和 componentDidCatch 等生命周期, 暂时没有等价的 hooks 实现
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

### useState

整个组件的生命周期中只会执行一次, 每一次 set 会触发组件的整体刷新

### useEffect

每次组件刷新时(useState, 或 props 改变), 都会触发. 具体执不执行里面的回调, 要看依赖项是否改变. 依赖项的改变是看前后两个值 === 的比较.

### useCallback

返回一个 memoized(记忆的)回调函数.<br />
把**内联回调函数**及依赖项数组作为参数传入 useCallback, 他将返回该回调函数的 memoized 版本, 该回调函数仅在某个依赖项改变时才会更新, 当你把这个函数传递给内部使用引用相等性去避免非必要渲染(如: shouldComponentUpdate)的子组件时, 他将非常有用.<br />
useCallback(fn, deps)相当于 useMemo(() => fn, deps)

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
