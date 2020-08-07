# AST

> 参考自: [https://juejin.im/post/6854573222071894029](https://juejin.im/post/6854573222071894029)

Abstract Syntax Tree (抽象语法树).

- 意义: javascript 语法是为了让开发者更好的变成而设计的, 本身并不适合程序的理解. 所以需要转化为 AST 来使之更适合程序分析, 浏览器编译器会将源码转化为 AST 来进行进一步的分析和其他操作.

- 详情: 这种将源码解析成 AST 的工具我们称之为 JS Parser. 每个浏览器都有一个 js 引擎, 每个引擎都有一个 JS Parser, 每个 JS parser 都对一个转化后的 AST.

- 作用: webpack 和 Link 等许多工具和库的核心都是通过 AST 这个概念来实现对代码的检查、分析等操作的.

### AST 的应用

babel 对箭头函数的解析就是一个 AST 的应用, 其操作过程分三步:

- 根据源码生成语法树
- 转化语法树
- 根据语法树生成转化后的代码

### 解析过程

AST 的解析过程主要分两步:

- 分词 (词法分析), 将代码字符串分割成语法单元数组
- 语法分析, 分析语法单元之间的关系

### 语法单元

js 代码的语法单元主要分为以下六种:

- 关键字: const、var、for、if/else 等有特定用途的词
- 标识符: 变量名、函数名、参数名和属性名
- 运算符
- 数字
- 空格
- 注释

### 词法分析

使用 for 循环和判断语句把代码转化成一个 token 数组, 大概实现如下:

```js
let sourceCode = `let   element   = <h1>hello</h1>`;

/**
 * 1.分词，把token拆开 词法分析，就是把代码转成一个token数组
 */

function lexical(code) {
  const tokens = [];
  for (let i = 0; i < code.length; i++) {
    let ch = code.charAt(i); //l     i=3 ch=空格
    if (/[a-zA-Z_]/.test(ch)) {
      //判断是否为合理变量名、标识符
      const token = { type: "Indentifier", value: ch };
      tokens.push(token);
      for (i++; i < code.length; i++) {
        //再向后移，判断是不是英文字母
        ch = code.charAt(i); //i=1 ch=e
        if (/[a-zA-Z_]/.test(ch)) {
          token.value += ch; //value=l value=le value=let
        } else {
          //i=3 ch=空格
          if (token.value == "let") {
            token.type = "KeyWord";
          }
          i--; //将空格回减
          break;
        }
      }
      continue;
    } else if (/\s/.test(ch)) {
      //如果ch是空格的话
      const token = {
        type: "WhiteSpace",
        value: " ",
      };
      tokens.push(token);
      for (i++; i < code.length; i++) {
        ch = code.charAt(i);
        if (/\s/.test(ch)) {
          token.value += ch;
        } else {
          //关键字和变量名之间的空格(多个)结束
          i--;
          break;
        }
      }
      continue;
    } else if (ch == "=") {
      const token = {
        type: "Equal",
        value: "=",
      };
      tokens.push(token);
    } else if (ch == "<") {
      const token = {
        type: "JSXElement", //遇到小于号，则为JSX元素
        value: ch,
      };
      tokens.push(token); //<h1>hello</h1>
      let isClose = true; //判断是否遇到闭合标签  <hr/> <h1></h1>
      for (i++; i < code.length; i++) {
        ch = code.charAt(i); //ch = h
        token.value += ch;
        if (ch == "/") {
          isClose = true; //遇到斜杠时则下一个大于号则为闭合标签
        }
        if (ch == ">") {
          //说明标签结束
          if (isClose) {
            break;
          }
        }
      }
      continue;
    }
  }
  return tokens;
}
let tokens = lexical(sourceCode);
console.log(tokens);
/**
[
  { type: 'KeyWord', value: 'let' },
  { type: 'WhiteSpace', value: '   ' },
  { type: 'Indentifier', value: 'element' },
  { type: 'WhiteSpace', value: '   ' },
  { type: 'Equal', value: '=' },
  { type: 'WhiteSpace', value: ' ' },
  { type: 'JSXElement', value: '<h1>' },
  { type: 'Indentifier', value: 'hello' },
  { type: 'JSXElement', value: '</h1>' }
]
 */
```

### 语法分析

语法分析是对得到的 token 数组进行一个立体的组合, 通过对语句和表达式的识别, 确定词语之间的关系, 是一个递归的过程.

大概实现如下:

```js
function parse(tokens) {
  let ast = {
    type: "Program",
    body: [],
    sourceType: "module",
  };
  let i = 0; //当前的索引
  let currentToken; //当前的token
  while ((currentToken = tokens[i])) {
    //第一次的时候 currentToken = { type: 'KeyWord', value: 'let' }
    if (currentToken.type == "KeyWord" && currentToken.value == "let") {
      //或者var/const
      let VariableDeclaration = {
        type: "VariableDeclaration",
        declarations: [],
      };
      ast.body.push(VariableDeclaration);
      i += 2; //{ type: 'Indentifier', value: 'element' },
      currentToken = tokens[i];
      let variableDeclarator = {
        type: "VariableDeclarator",
        id: {
          type: "Indentifier",
          name: currentToken.value,
        },
      };
      VariableDeclaration.declarations.push(variableDeclarator);
      i += 2; //i=4 //
      currentToken = tokens[i]; //{ type: 'JSXElement', value: '<h1>hello</h1>' },
      if (currentToken.type == "String") {
        variableDeclarator.init = {
          type: "StringLiteral",
          value: currentToken.value,
        };
      } else if (currentToken.type == "JSXElement") {
        let value = currentToken.value;
        let [, type, children] = value.match(/<([^>]+?)>([^>]+)<\/\1>/); //<h1></h1>  type=h1 children=hello
        variableDeclarator.init = {
          type: "JSXElement", //JSX元素
          openingElement: {
            type: "openingElement",
            name: {
              type: "JSXIndetifier",
              name: type,
            },
          },
          closingElement: {
            type: "closingElement",
            name: {
              type: "JSXIndentifier",
              name: type,
            },
          },
          children: [{ type: "JSXElement", value: children }],
        };
      }
    }
    i++;
  }
  return ast;
}

let tokens = [
  { type: "KeyWord", value: "let" },
  { type: "WhiteSpace", value: " " },
  { type: "Indentifier", value: "element" },
  { type: "WhiteSpace", value: " " },
  { type: "Equal", value: "=" },
  { type: "WhiteSpace", value: " " },
  { type: "JSXElement", value: "<h1>hello</h1>" },
];

let ast = parse(tokens);
ast.body[0].declarations[0].init = {
  type: "ExpressionStatement",
  expression: {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      computed: false,
      object: {
        type: "Indentifier",
        name: "React",
      },
      property: {
        type: "Indentifier",
        name: "createElement",
      },
    },
    arguments: [
      {
        type: "Literal",
        value: "h1",
        raw: '"h1"',
      },
      {
        type: "Literal",
        value: null,
        raw: "null",
      },
      {
        type: "Literal",
        value: "hello",
        raw: '"hello"',
      },
    ],
  },
};
console.log(JSON.stringify(ast));

/**
 * {"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Indentifier","name":"element"},"init":{"type":"ExpressionStatement","expression":{"type":"CallExpression","callee":{"type":"MemberExpression","computed":false,"object":{"type":"Indentifier","name":"React"},"property":{"type":"Indentifier","name":"createElement"}},"arguments":[{"type":"Literal","value":"h1","raw":"\"h1\""},{"type":"Literal","value":null,"raw":"null"},{"type":"Literal","value":"hello","raw":"\"hello\""}]}}}]}],"sourceType":"module"}
 */
```

**至此就简单实现了语法树的转化**
