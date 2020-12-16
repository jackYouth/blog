# e 小宝技术文档

### e 小宝功能点

- [职位分发](#职位分发实现步骤)
- [登录](#登录实现步骤)
- [转发评审](#转发评审实现步骤)
- [简历查重](#简历查重实现步骤)
- [保存简历](#保存简历实现步骤)
- [数据统计面板](#数据统计面板实现步骤)
- [插件的设置页](#插件的设置选项页)

### 职位分发实现步骤

- ifchange 的职位页面分发时, 请求[职位分发标记](#职位分发标记)的接口, 将当前的渠道号和职位 id 进行标记
- 每次新打开一个 tab, e 小宝都会去检测当前页面是否在配置的匹配列表中, 如果在且设置时存在 publish, 则会在 /js/content.js 中执行职位的填充流程:
  - 根据职位分发时的标记请求 [position_info](#职位详情 "position_info") 接口返回职位详情数据
  - customCode 配置中的 position 对应代码, 进行填充.

### 登录实现步骤

/js/background.js 中, 根据当前的 siteType 取对应的 cookie 进行登陆态的校验.

- 如果有对应 cookie, 需要判断是否是新数招?
  - 是, 则判断是否已经配置项目域名?
    - 已配置, 显示登录后面板
    - 未配置, 显示去配置面板
  - 不是新数招, 有登陆态, 插件面板显示登陆后界面
- 如果没有, 显示去登录的面板
  - 去登录的链接有两种, localDomain 和 domain.
    - localDomain 对应插件设置页配置的域名
    - domain 对应 webpack 中配置的 DOMAIN_LIST 的第 当前选择的 siteType 个.

> cookie 的 value 要求 uid:uname 格式, 其中 uid 用于 e 小宝中接口请求传参, uname 用于 e 小宝插件用户的展示

### 转发评审实现步骤

会请求[save_resume](#保存简历 "save_resume")的接口, 根据返回的 review_link 跳转到 ifchange 下的转发评审页面

> /js/background.js 中的 forwardReview 方法

### 简历查重实现步骤

如果当前页面有在后台进行配置, 点击简历查重时, 会请求 [页面查重](#页面查重 "parse_page") 的接口, 否则会提示: 页面未检测到简历信息

> /js/content.js 中的 checkPage 方法

### 保存简历实现步骤

会请求[save_resume](#保存简历 "save_resume")接口, 接口成功后, e 小宝会在当前页面弹出提示, 里面的查看按钮对应的链接, 优先取接口返回的 delivery_address 字段, 其次 folder_address 字段.

> /js/background.js 中 saveResume 方法

### 数据统计面板实现步骤

请求 [resume_count](#数据统计 "resume_count")接口, 根据接口渲染页面

> /js/popup/data.js 中

### 插件的设置选项页

- 用户类型配置、项目域名、自动查重、弹窗自动关闭时长的配置
- 版本信息的展示
  - 当前版本号
  - 请求[version_list](#版本历史记录 "version_list")接口, 获取版本历史记录

> /js/options/index.js 中

# 接口列表

### 获取 e 小宝配置

- 接口地址: /api/ebaby/getEbabySettings
- 请求参数
  - uid
- 返回结果:

  - url_list (Array) 后台系统配置的渠道信息, 会存入 storage 中, key 名 channelList
  - api_list (Array) e 小宝中会用到的接口列表, 会存入 storage 中, key 名 apiList
    - [check_version](#版本检测 "check_version")
    - [create_folder](#创建文件夹 "create_folder")
    - [folder_list](#文件夹列表 "folder_list")
    - [parse_page](#页面查重 "parse_page")
    - [position_info](#职位详情 "position_info")
    - [position_list](#职位列表 "position_list")
    - pv
    - [resume_count](#数据统计 "resume_count")
    - [save_check](#保存简历操作前校验 "save_check")
    - [save_resume](#保存简历 "save_resume")
    - [socket_url](<#socket连接(socket_url)>)
    - [version_list](#版本历史记录 "version_list")
    - [warn](#不在匹配列表中或mark不存在标记 "warn")
  - actions (Object) 后台系统配置的对应的代码, 会存入 storage 中, key 名 customCode

    - custom (String)
    - listen (String)
    - position (Object)
    - search (Object)

  - modules (Array) 支持的功能点, 会存入 storage 中, key 名 modules
    - forward_review
    - report
    - save_resume
    - save_resume_position
    - save_resume_folder
  - is_save_html (Boolean) 是否是保存 html 附件, 会存入 storage 中, key 名 isSaveHtml

### 版本检测 (check_version)

- 接口地址: //external.testing2.ifchange.com/exiaobao/checkExiaobaoVersion
- 请求参数:
  - uid
  - version (String), 当前插件版本
  - browser_type (Number), 谷歌传 1, 火狐传 2
- 返回结果:
  - browser_type
  - description
  - force_upgrade
  - last_version: 如果 last_version 有数据表示有新版本, 会将 description, force_upgrade 存入 storage 中
    ```js
      {
        versionInfo: description,
        versionForce: !!+force_upgrade,
      }
    ```
  - version

### 创建文件夹 (create_folder)

用于保存简历面板, 创建文件夹操作

- 接口地址: /atsng/archives/saveDir
- 请求参数:
  - name
- 返回结果:
  - results (Number), 文件夹 id

### 文件夹列表 (folder_list)

用于保存简历时, 选择文件夹

- 接口地址: /atsng/ebaby/listFolders
- 请求参数:
  - uid
- 返回结果:
  - id (Number), 文件夹 id
  - name (String), 文件夹名称
- 示例:
  ```js
  {
    err_msg: '',
    err_no: 0,
    request_id: '6aaba4c03f57ccd46671185462869b72',
    results: [
      {
        name: '\u5f85\u5206\u7c7b',
        from_uid: 0,
        system_dir: 1,
        icon: 'jianli-weifenlei',
        id: 15,
        is_share: 0
      }
    ]
  }
  ```

### 职位列表 (position_info)

用于保存简历时, 选择职位

- 接口地址: /api/position/listPositionEbao
- 请求参数:
  - uid
  - size
  - page
- 返回结果:
  - data (Array)
    - city_names (String)), 城市名称, hover 职位时拼接在名称后
    - id (Number), 职位 id
    - name (String), 职位名称
- 示例:
  ```js
  {
    err_no: 0,
    err_msg: '',
    results: {
      data: [
        {
          name: '3年人才归宗职位',
          id: 6913007,
          city_names: '全部地点',
          tob_position_id: 25707
        }
      ],
      total: 5984
    }
  }
  ```

### 页面查重 (parse_page)

用于页面查重、页面自动查重

- 接口地址: /exiaobao/parsePageData
- 请求参数:
  - uid
  - auto_check
  - content
  - version
  - site_id
  - link
  - browser_type
- 返回结果:
  - doList (Array),
    - resume_id 打点需要,
    - link 会展示第一个元素的, 用于去查看简历详情
  - doStatus 有值表示查重到了简历
  - showResumeContact (Boolean) 为 true 时表示可以在 e 成中获取联系方式
  - source (Number) 为 2 时, 表示在 e 成人才库中发现相似简历, 1 表示发现相似简历
- 示例:
  ```js
  {
    err_no: 0,
    err_msg: '',
    results: {
      doStatus: 1,
      doList: [
        {
          resume_id: 25618889,
          resume_name: 'QT0025618889',
          resume_photo: 'http://uimg.testing2.ifchange.com/email/message/man.png',
          gender: '男',
          address: '无锡市',
          last_position_name: '西厨副厨师长',
          last_company_name: '无锡凯莱大酒店',
          link:
            'http://www.testing2.ifchange.com/resume?id=25618889\u0026tob_resume_id=2000025618889122627',
          has_contact: false
        }
      ],
      source: 1,
      showResumeContact: false
    }
  }
  ```

### 保存简历操作前校验 (save_check)

用于保存简历

- 接口地址: /exiaobao/saveResumeCheck
- 请求参数:
  - link
  - uid
  - site_id
  - content
- 返回结果:
  - results (Boolean)

### 保存简历 (save_resume)

用于简历保存, 转发评审操作

- 接口地址: /exiaobao/saveResumeData
- 请求参数:
  - link
  - uid
  - site_id
  - content
  - folder_id
  - review_resume
- 返回结果:
  - delivery_address 待处理流程中简历地址 (优先取, 取不到则取 folder_address)
  - folder_address 文件夹中简历地址
  - resume_id 简历、职位打点需要
  - review_link 转发评审对应跳转链接
- 示例:
  ```js
  {
    err_no: 0,
    err_msg: '',
    results: {
      resume_id: '25618889',
      folder_id: '101641',
      position_id: '0',
      folder_link: 'resume?id=25618889&tob_resume_id=2000025618889122627',
      delivery_link: '',
      folder_address:
        'http://www.testing2.ifchange.com/resume?id=25618889&tob_resume_id=2000025618889122627',
      tob_resume_id: '2000025618889122627',
      icdc_resume_id: '25618889',
      lock_status: 0,
      review_link:
        'http://www.testing2.ifchange.com/e-bot/review?icdc_resume_id=25618889&tob_resume_id=2000025618889122627&delivery_source=10021',
      delivery_address: ''
    }
  }
  ```

### 职位分发标记

用于标记, e 小宝填充职位查询职位详情时, 用哪个职位 id

- 接口地址: /atsng/positionAction/saveDistributeChannel
- 请求参数:
  - channel
  - tob_position_id
  - uid
- 返回结果:
  - results (Boolean) 为 true 时, 跳转第三方链接
- 示例:

### 职位详情 (position_info)

用于职位自动填充

- 接口地址: /api/position/distributePositionInfo
- 请求参数:
  - uid
  - channel
- 返回结果:
- 示例:
  ```js
  {
    status: 1,
    data: {
      address: '上海市黄浦区马',
      number: 0,
      gender: 0,
      manager_years: 0,
      description:
        '参与需求移交会',
      requirement:
        '熟练掌握软件测',
      organization: 1062,
      recruit_type: 1,
      category_id: 159,
      position_code: '',
      age_begin: '',
      age_end: '',
      id: 6875477,
      name: 'WEB 测试工程师 - 云超',
      salary_begin: 0,
      salary_end: '',
      annual_salary_begin: 200000,
      annual_salary_end: 500000,
      experience_begin: 0,
      experience_end: 0,
      degree_id: 1,
      degree_name: '本科',
      department: '测试部门',
      email:
        'ifchangetest2016@163.com tin55g.liu@ifchange.com yunchao.zhou@ifchange.com',
      category_name: '自动化测试',
      company_name: '中国2移动通信集团设计',
      company_description:
        '    HR：基于海'
    }
  }
  ```

### 数据统计 (resume_count)

- 接口地址: /atsng/ebaby/getDuplicationData
- 请求参数:
  - uid
- 返回结果:
- 示例:
  ```js
  [
    {
      title: "累计帮您节省",
      tips: [
        "每份简历按照30元进行计算",
        "父账号数据为父、子账号的总和",
        "人才库简历越多，查重效率越高",
      ],
      count: 24930,
      unit: "元",
    },
    { title: "已查重简历", count: 831 },
    { title: "已查看简历", count: 906 },
  ];
  ```

### 不在匹配列表中或 mark 不存在标记 (warn)

外网渠道访问过多无法调通达到一定次数时, 会触发邮件报警

- 接口地址: /atsng/ebaby/monitor
- 请求参数:
  - url
  - uid
  - siteType
  - localDomain
  - version
- 返回结果: 无
- 示例:

### pv 打点 (pv)

点击打点使用

- 接口地址: https://pv.testing2.ifchange.com/t.gif

### 版本历史记录 (version_list)

e 小宝的版本记录

- 接口地址: //external.testing2.ifchange.com/exiaobao/getExiaobaoVersionList
- 请求参数:
  - size
  - page
  - browser_type
- 返回结果:
- 示例:
  ```js
  {
    err_no: 0,
    err_msg: "",
    results: {
      data: [
        { version: "1.6.6", data: ["e小宝运营活动"] },
        {
          version: "1.4.0",
          data: ["更新说明@#￥%……\u0026*（）", "更新说明", "更新说明"],
        }
      ],
      pagination: { page: "1", size: "1000", total: "17" },
    },
  }
  ```

### socket 连接 (socket_url)

主要用于一些订阅消息的服务端推送, 比如 猎头重复简历提醒、猎头推荐提醒、其他信息

- 接口地址: //ebot.testing2.ifchange.com
- 请求参数:
- 返回结果:
- 示例:
