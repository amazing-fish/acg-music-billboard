# 二游节奏榜 | ACG Music Billboard

## 项目简介
二游节奏榜聚焦二次元手游音乐，提供周榜、月榜等榜单内容，让玩家快速了解热门主题曲、角色专辑与最新 OST 活动。项目从原型到上线全程保持中文本地化表达，强调沉浸式的游戏音乐体验。

## 快速开始
1. 安装依赖：`npm install`
2. 本地开发：`npm run dev`
3. 生产构建：`npm run build`

> 初期默认启用 mock 数据；在 UI 稳定后需配置真实接口或生成静态数据再切换环境变量。

## 可用脚本
- `npm run dev`：启动 Vite 开发服务器。
- `npm run build`：执行 `vue-tsc` 类型检查并产出生产包。
- `npm run preview`：本地预览构建结果。
- `npm run fetch:data`：抓取网易云 ACG 榜单并生成 `public/data/billboard.json` 静态快照。

## 技术栈
- `Vite 5` + `Vue 3` + `TypeScript`：基础构建与组件开发框架。
- `Vue Router 4`：负责首页与榜单详情视图的路由切换。
- `Pinia`：集中管理榜单、筛选条件与播放状态。
- `Tailwind CSS 3`：构建深色主题与响应式布局。
- `Axios`（规划中）：处理真实数据源 HTTP 请求。
- `Vitest` + `@vue/test-utils`（规划中）：组件与数据逻辑单元测试。
- `ESLint` + `Prettier`（规划中）：TypeScript/Vue 代码规范与格式化。

## 路由结构
- `/`：首页，展示榜单筛选器、核心榜单卡片与即将到来的活动。
- `/board/:id`：榜单详情页，显示完整榜单条目、冠军曲目与热度统计。
- 未匹配路径重定向至 `/`。

## 核心交互
- 榜单周期筛选：通过顶部筛选器快速切换「全部 / 周榜 / 月榜 / 活动榜」。
- 榜单卡片预览：首页卡片展示前三曲目与热度走势，支持跳转详情。
- 榜单详情：提供冠军高亮、热度统计汇总以及完整条目列表。

## 真实数据抓取与切换
- 数据来源：网易云音乐官方 ACG 榜单（综合榜 71385702、动画榜 3001835560、游戏榜 3001795926）。
- 运行 `npm run fetch:data` 可生成最新快照，文件输出到 `public/data/billboard.json`。
- 在 `.env.local` 中设置 `VITE_USE_MOCK=false` 后重新启动服务即可读取真实数据。
  - 若有自建后端，可设置 `VITE_API_BASE_URL` 指向 `billboard/snapshot` 接口。
  - 若静态托管 JSON，可设置 `VITE_DATA_ENDPOINT` 覆盖默认的 `/data/billboard.json`。
- 若请求失败且未配置远程接口，前端会自动回退至 mock 数据并在控制台提示。

## 数据策略
- 开发早期：使用 `src/mocks/` 下的静态数据，配合 `Pinia` Store 驱动 UI 验证。
- 切换条件：当榜单、详情、筛选、活动模块可用且完成设计验收时，替换为真实数据源并移除 mock 注入。
- 真实数据：优先对接官方或可信榜单接口；如需自建后端，可规划定时抓取脚本并提供缓存层。

## 环境变量
- `VITE_USE_MOCK`：`true | false`，控制是否使用 mock 数据，未设定时开发模式默认 `true`。
- `VITE_API_BASE_URL`：真实数据源基础地址，启用后需提供 `/billboard/snapshot` 接口。
- `VITE_DATA_ENDPOINT`：静态 JSON 的访问地址，默认 `/data/billboard.json`。

## 组件与页面结构
- `src/pages/HomePage.vue`：首页容器，负责加载榜单与活动数据。
- `src/pages/BoardDetailPage.vue`：榜单详情页面，展示统计信息与完整条目。
- `src/components/RankingFilterBar.vue`：榜单周期筛选器。
- `src/components/RankingBoardCard.vue`：榜单卡片组件，包含榜单概览与跳转按钮。
- `src/components/RankingBoardEntry.vue`：榜单预览条目，供首页卡片使用。
- `src/components/RankingBoardEntryFull.vue`：榜单详情条目，展示热度、票数与提及量。
- `src/components/RankingBoardSkeleton.vue`：骨架屏组件，用于榜单加载态。
- `src/components/UpcomingActivityList.vue`：活动列表组件，展示近期音乐活动。

## 目录规划（当前）
```
acg-music-billboard/
├── .vscode/
├── readme.md
├── AGENTS.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── data/
│       └── billboard.json
├── scripts/
│   └── fetch-real-data.mjs
└── src/
    ├── App.vue
    ├── assets/
    ├── components/
    │   ├── RankingBoardCard.vue
    │   ├── RankingBoardEntry.vue
    │   ├── RankingBoardEntryFull.vue
    │   ├── RankingBoardSkeleton.vue
    │   ├── RankingFilterBar.vue
    │   └── UpcomingActivityList.vue
    ├── mocks/
    │   └── rankings.ts
    ├── pages/
    │   ├── BoardDetailPage.vue
    │   └── HomePage.vue
    ├── router/
    │   └── index.ts
    ├── services/
    │   └── rankingService.ts
    ├── stores/
    │   └── rankingStore.ts
    ├── styles/
    │   └── main.css
    ├── types/
    │   └── music.ts
    └── main.ts
```

## 开发里程碑（进度）
1. ✅ 使用 Vite 初始化 Vue3 + TypeScript 项目，配置 Tailwind。
2. ✅ 创建基础目录、注入 Pinia Store 与 mock 数据。
3. ✅ 建立路由骨架并拆分首页核心组件。
4. ✅ 加入榜单筛选、详情页热度统计与真实数据抓取脚本。
5. ⏳ 接入真实数据源接口（若有后台），完善 Axios 服务层与缓存策略。
6. ⏳ 补充测试、部署脚本与文档，准备上线。

## 维护约定
- 所有文案默认使用简体中文，不规划其他语系。
- 组件、状态、样式文件遵循 TypeScript + Vue 组合最佳实践，命名保持英文连字符。
- 开发过程中及时更新文档，记录 mock 数据结构、真实数据字段与接口变更差异。
- 提交信息保持清晰（例：`feat: build weekly ranking page`）。
