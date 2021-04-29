# git 常用命令

### git 流程图

git 中的 4 个地址概念：工作区、暂存区、本地仓库、远程仓库
git 中常用的就 6 个命令，但是进阶的话需要记住 60-100 个命令
常用的命令图谱：

<img src='../imgs/git.png'>

### 基础命令:

- git fetch/clone: 从远程仓库拉取/克隆代码到本地仓库
- git checkout: 本地仓库检出分支到工作区
- git pull: 将远程仓库所有分支代码拉到本地仓库代码
- git add: 将工作区代码加入暂存区, (.表示加入全部, 指定文件名则加入指定文件)
- git commit: 将暂存区文件提交到本地仓库
- git push: 将本地仓库代码推送到远程仓库
- git stash（进度保存）:

  - gsts（保存：git stash save 'message'）
  - gstl（进度列表：git stash list）
  - gstp <gstl 中的 stash_id> (插入进度，默认最新)
  - gstd <gstl 中的 stash_id>（移除进度，默认最新）

### 撤销命令：

- git checkout 恢复暂存区的文件到工作区，新增的文件不会被删除（后面加文件名就是恢复指定文件，加.就是恢复所有文件）
- git reset --hard 重置暂存区和工作区，新增的文件不会被删除（后面可以加 commit，来指定重置到某次提交点，不加--hard 就相当于 checkout，不会改变工作区的内容）
- git clean -ndf 查看将要删除的未跟踪文件（新增的文件），在 git clean -xdf 前使用（x: 忽略目录中新增的文件，d：目录，ｆ：文件）
- git clean -df 删除暂存区所有为跟踪文件(慎用，.gitignore 忽略的新增文件也会被删掉，比如 node_modules 中，一般是用来删除编译后的文件)
  > checkout 作用的是暂存区（add 后的文件），reset 作用的是暂存区和 workspace（没有 add 的改变）

### 删除命令

- git branch -d branchName 删除本地分支
- git push origin --delete branchName 删除远程分支

### git 用户管理

- 查看当前 git 提交时的用户名称、邮箱
  - git config user.name
  - git config user.email
- 修改当前 git 提交时的用户名称、邮箱
  - git config --global user.name '<name>'
  - git config --global user.email '<email>'

> git 简版命令配置神器: [oh my zsh!](https://github.com/robbyrussell/oh-my-zsh/blob/master/plugins/git/git.plugin.zsh)

### 删除命令:

- git branch -d <branchName>: 删除本地分支
- git push origin --delete <branchName>: 删除远程分支

### git commit message 规范

提交 commit 代码格式： git commit -m [optional scope]

type ：用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？总结以下 11 种类型：

- build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
- ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，- Circle 等)的提交
- docs：文档更新
- feat：新增功能
- fix：bug 修复
- perf：性能优化
- refactor：重构代码(既没有新增功能，也没有修复 bug)
- style：不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
- test：新增测试用例或是更新现有测试
- revert：回滚某个更早之前的提交
- chore：不属于以上类型的其他类型(日常事务)

optional scope：一个可选的修改范围。用于标识此次提交主要涉及到代码中哪个模块。
description：一句话描述此次提交的主要内容，做到言简意赅。

### 进阶

- 查询包含指定内容的分支

  - 查询远程分支中包含<selector>的分支: git branch -r | grep <selector>
  - 查询全部分支中包含<selector>的分支: git branch -a | grep <selector>

- 查询包含指定内容的 git 提交记录

  - 按提交者: --author=
    - 如: git log --author="suyd"
  - 按 commit 描述: --=
    - 如: git log --grep="suyd"
  - 按 分支名: --branchName=
    - 如: git log --branchName="suyd"
  - 查询某文件的提交记录:
    - git log filename
    - git log -p filename 可以显示每次提交的 diff

- 查询某次提交的改动

  - git show <commitId>
    - 如果添加 --stat ，则只会显示改动的文件， 不会显示具体的文件改动内容

- rebase（变基）

  - git rebase --onto <变基目标分支 master> <变基过渡分支 issue1> <变基当前分支 issue2 指令>
    - 应用场景：从主分支 master 切出了分之 issue1，进行一些提交之后，又有另一个需求，然后在 issue1 的基础之上我们又切出了 issue2 并进行了提交，在这期间又有其他成员对 master 分支做了更新，这时，当我们 issue2 开发完成需要合到 master，但 issue1 因为某些原因导致 delay 需要继续开发。
    - 对于这种场景，我们就可以使用 rebase，将需要执行变基的 issue2 合并到变基执行的分支 master 并且过滤掉过渡分支 issue1
  - 与 merge 的区别： rebase 会修整历史，然后将分支历史并入主线，生成一条完成清晰的历史链路，可以理解为美化过的历史。merge 则不会修改历史，让分支历史独立存在，可以看作完整的历史，但是分支删除后，这部分历史就会消失。

- tag (打标签)
  - tag，中文意思标签，顾名思义就是标记某类事物的一个工具。

### 实战

- 改变上次提交的 msg
  - git reset --soft <commitId>
  - git commit --amend 或 gcmsg <msg> --amend 重新编辑 commitMsg 即可
- 改变任意一次提交的 msg
  - git log 查看需要改的 commit 是第几个，比如是第四个
  - git rebase -i HEAD ～ 4
  - 把对应的 commit 前面的 pick 改成 e，即可编辑这次提交
  - git commit --amend ，输入对应的 message
  - git rebase --continue ， 大功告成
    > git rebase --abort 可以在任何时机退出 rebase 命令，并回到初始分支

1. 执行 git commit --amend 光标移动到 Change-Id 的行 输入 dd 删除改行 输入:wq 保存退出

### git 的一些坑

- tag 号和 branch 名称相同时（比如都是 test_0_0_0_7 ），当推送分支到远程 test_0_0_0_7 时，会推到 tag 上面
