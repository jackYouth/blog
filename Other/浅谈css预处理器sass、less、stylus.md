# [浅谈css预处理器sass、less、stylus](https://zhuanlan.zhihu.com/p/23382462)

### 区别
- 后缀
  - sass是.sass、.scss, 2007年出现
    - .sass是早期sass的实现，使用的是缩进语法，不支持css
    - .scss是受less影响，于sass 3新增的一种兼容css的语法
  - less是.less，2009年出现
  - stylus是.styl，2010年出现，来自于node社区，主要是给node项目进行css预处理
- 变量
  - sass使用$开头，后面紧跟变量名和值，变量名和值之间使用 : 分隔
  - less使用@开头，其余等同于sass
  - stylus可以使用@也可以不使用任何符号开头，尾逗号也没有要求，但是变量名和值之间使用 = 分隔
- 作用域<br />
  与js的作用域类似，先从局部作用域查找，依次往上层作用域查找
  - 三者最差，没有全局作用域
  - 跟js相同
  - 跟js相同
- 嵌套
  - 三者没什么区别，只有sass多了一个属性嵌套的功能
    ```scss
        .footer {
            font: {
                family:  微软雅黑;
                size: 5rem;
                weight: bolder;
            }
        }
    ```
- 继承
  - sass、stylus通过 @extend 关键字后跟要继承的选择器，直接继承对应选择器中的样式
  - less 通过 当前选择器:extend(被继承选择器)，实现继承。可以嵌套语法中的&来代表当前选择器
- 逻辑方式处理
  - sass、stylus都支持条件、循环等，less需要通过when等关键字去模拟
- 导入
  - 不建议使用@import导入css，因为会增加http请求
  - less对@import进行了语法的扩展，可参考: [Less 的 Import 扩展](https://less.bootcss.com/features/#import-at-rules)


### 总结
- sass、less更严谨，stylus相对自由度更高
- less在丰富性和特色上都不及sass、stylus，如果不是bootstrap使用的less，估计都不会被广泛应用
- stylus容错性最好，可以同时在文件中写缩进和css，代码书写起来也比较简洁，值得尝试