# k8s 和 docker

### docker 出现的背景

2010 年在美国旧金山几个年轻人创办了一家 dotCloud 的公司，他们发明了 docker 技术，但是规模小竞争激烈发展不好，后来在 2013 年宣布开源，此后 docker 技术才开始火起来，有了 1.0 版本这种。

在 docker 之前，业界的网红是虚拟机，虚拟机的代表是 VMWare 和 openStack。

虚拟机就是在你的电脑里装一个软件，然后通过这个软件，在模拟出一个或多个子电脑出来。在子电脑里，你可以像和真正的电脑里一样运行任何程序，例如 qq。子电脑和子电脑之间是相互隔离的，互不影响。

虚拟机使用的是虚拟技术，docker 使用的是容器技术，也是虚拟技术，属于轻量级的虚拟化。

### docker 的优势

相比于虚拟机使用时，需要占用很多的空间、启动速度慢、软件需要付费，docker 的容器技术恰好就没有这些缺点。它不需要虚拟出一整个系统，只需要虚拟一个小规模的环境（类似沙箱）。

- docker 启动时间很短，基本是秒级
- 资源利用率高，一台主机上面可以同时运行几千个 docker 容器
- docker 占用的内存很小，相比于虚拟机动不动几 GB 几十 GB 的空间占用，docker 的量级只需要 MB 甚至 KB

### docker 的概念

> **Docker 本身不是容器，它只是创建容器的工具，是应用容器的引擎**

Docker 的核心，就是他的两句口号：

- Build、Ship and Run （搭建、发送、运行）
- Build once，run anywhere （一次搭建，到处能用）

举个例子：当我们见找一个房子时，需要搬石头、砍木头、画图纸，一系列操作下来，把房子盖好了。等我们突然要搬到另一个空地上时，传统的，我们还要搬石头、砍木头、画图纸这一套再搞一遍才能出一套房子。但是如果是 docker 的形式，我们就可以先把之前做的房子，复制一份做成镜像，然后放到我的背包里，等到另一个空地，再用这个镜像再复制出一个房子，摆在那里，就可以直接拎包入住了。

Docker 技术的三大核心概念：

- 镜像（Image）
- 容器（Container）
- 仓库（Repository）

对比上面的例子：镜像就是刚才放在包里的镜像，容器就是使用镜像后得到的房子，仓库是用来放镜像的包

### Docker 仓库

和装系统时的镜像类似，docker 镜像也就是一个特殊的文件系统，它只提供一些运行时所需的程序、库、资源、配置等文件和参数，不包含任何动态数据，其内容在构建之后也不会改变。也就是说，每次构建出的容器都是一模一样的。

虽然单个镜像构建出的所有容器是一个样的，但是我们可以有多个镜像啊，也可以使用别人的镜像，所以这里就有了一个 Docker Registry 服务，负责管理 Docker 镜像。

另外不是所有人建的所有镜像都是合法的，万一有人搭建出违规的建筑呢，所以一个合格的 Docker Registry 服务应该对 Docker 镜像进行严格管理。这里最常使用的 Docker Registry 是官方的 Docker Hub，也是默认的 Registry，里面有着大量高质的官方镜像。

### k8s

Docker 的单体使用是很方便，但是在具体业务中，往往是多个 docker 协同去完成某项业务的。这时 docker 在编排、管理和调度等方面，就不太容易了。所以我们急需一种管理系统，对 Docker 和容器进行更高级更灵活的管理。

就在这时 k8s 出现了，k8s 就是**基于容器的集群管理平台**，全程 kubernetes，8 代表 ubernete 这八个字母。kubernetes 来自于希腊语，舵手和领航员的意思。

和 Docker 不同，k8s 出自行业巨头 - 谷歌， 于 2014.6 开源。

一个 k8s 系统，通常称为一个 k8s 集群，这个集群主要包括两部分：

- 一个 Master 节点（主节点）
- 一群 Node 节点（计算节点）

master 节点负责管理和控制，具体组成为：

- Api Server，整个系统的对外接口，相当于“营业厅”
- Schedule，负责对集群内部资源进行调度，相当于“调度室”
- Controller manage，负责管理控制器，相当于“大总管”
- etcd

Node 节点是工作负载节点，里面是具体的容器，具体组成为：

- pod，k8s 中最基本的操作单元，一个 pod 代表集群中运行的一个进程，它里面封装了一个或多个紧密相关的容器，pod 中的所有容器会共享很多资源，比如网络空间，他们之间的通信也可以通过 localhost。除了 pod 之外，k8s 还有一个 Service 的概念，一个 Service 可以看做一组提供相同服务 pod 的对外访问接口。
- Docker，创建容器的，别忘了哦
- kubelet，负责创建、修改、删除、监控指派到他所在 Node 节点的 pod，对 pod 的调度和正常运行至关重要
- kube-proxy，负责为 pod 对象提供代理
- Fluentd，负责日志收集、存储和查询
- kube-dns（可选）
