# vue

### slot (插槽)
- 单个插槽
    - 定义组件时，通过添加slot标签，设置插槽的位置
        ```html
            <!--  navigation-link.js -->
            <a
                v-bind:href="url"
                class="nav-link"
            >
                <slot></slot>
            </a>
        ```
    - 引用组件时，直接组件包裹的内容，就会整个替换slot标签
        ```html
            <navigation-link url="/profile">
                Your Profile
            </navigation-link>
        ```
    - 渲染的结果
        ```html
            <navigation-link url="/profile">
                <!-- 添加一个 Font Awesome 图标 -->
                <span class="fa fa-user"></span>
                Your Profile
            </navigation-link>
        ```
- 多个插槽<br />
    使用**具名插槽**的形式，给每个插槽进行命名
    - 定义组件时，添加的slot标签中增加name属性，不带name的话，会默认为default
        ```html
            <!--  base-layout.js -->
            <div class="container">
                <header>
                    <slot name="header"></slot>
                </header>
                <main>
                    <slot></slot>
                </main>
                <footer>
                    <slot name="footer"></slot>
                </footer>
            </div>
        ```
    - 引用组件时，在需要向具名插槽提供内容的地方， 新增一个<template>元素，并添加v-slot指令，去对应对应的名称
        ```html
            <base-layout>
                <template v-slot:header>
                    <h1>Here might be a page title</h1>
                </template>

                <!-- 这里也可以用 <template v-slot:default> 包一下 -->
                <p>A paragraph for the main content.</p>
                <p>And another one.</p>

                <template v-slot:footer>
                    <p>Here's some contact info</p>
                </template>
            </base-layout>
        ```
    - 渲染的结果
        ```html
            <div class="container">
                <header>
                    <h1>Here might be a page title</h1>
                </header>
                <main>
                    <p>A paragraph for the main content.</p>
                    <p>And another one.</p>
                </main>
                <footer>
                    <p>Here's some contact info</p>
                </footer>
            </div>
        ```
        > v-slot:header可以简写成 #header
    - 2.6之前的具名插槽用法是通过slot属性的方式，而不是v-slot
        ```html
            <base-layout>
                <template slot="header">
                    <h1>Here might be a page title</h1>
                </template>
            </base-layout>
        ```
- 后备内容 （打底插槽内容）<br />
    在定义组件时，可以咋slot标签中嵌套一些标签作为打底的插槽内容，当引用组件时，如果没有传入slot，则会显示默认的打底内容
    ```js
        // 定义组件
        <button type="submit">
            <slot>Submit</slot>
        </button>
        // 引入组件
        <submit-button></submit-button>
        // 最终展示
        <button type="submit">
            Submit
        </button>
    ```
- 作用域插槽<br>
    在引用组件传入slot时，往往需要用到组件中定义的某些变量，这时因为是在父级作用域中，所以是无法取到这些变量的，这时我们可以通过传参的方式实现数据传递。
    - 在通过slot标签中通过v-bind属性传递数据
        ```html
            <span>
                <slot v-bind:user="user">
                    {{ user.lastName }}
                </slot>
            </span>
        ```
    - 通过v-slot:default='slotProps'的形式，定义父级作用域中引用的变量名。slotProps名称可自定义
        ```html
            <current-user>
                <template v-slot:default="slotProps">
                    {{ slotProps.user.firstName }}
                </template>
            </current-user>
        ```