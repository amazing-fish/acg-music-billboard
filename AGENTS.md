# 二游节奏榜协作指引（AGENTS）

## 目标与范围
- 仅在 `acg-music-billboard` 目录内创建、修改文件，保持项目结构干净。
- 聚焦二次元手游音乐榜单体验，不扩展至其他娱乐类别或多语言版本。
- 所有界面、提示与日期等内容保持中文本地化表达。

## 技术栈约束
- 固定使用 `Vite 5 + Vue 3 + TypeScript`，组件统一采用 `<script setup lang="ts">`。
- 路由层使用 `Vue Router 4`，首页与榜单详情需通过路由切换；全局状态统一交由 `Pinia` 管理。
- 样式基于 `Tailwind CSS 3`，复用样式时优先使用 `@apply`。
- HTTP 请求需封装在 `src/services/` 中（规划基于 `Axios`），同时保留 mock 兜底流程。
- 测试框架基线为 `Vitest` + `@vue/test-utils`；新增核心逻辑需补充单测。
- 代码质量工具固定为 `ESLint` + `Prettier`，调整规则需在文档说明原因。

## 数据处理策略
- mock 数据集中存放于 `src/mocks/`，提供类型定义（参见 `src/types/music.ts`）。
- `useRankingStore` 负责榜单加载与周期筛选（`BoardFilter`），切换真实数据时须保留错误兜底与加载态。
- 环境变量：`VITE_USE_MOCK` 默认 `true`（开发期使用 mock），`VITE_API_BASE_URL` 在启用真实接口时必填，`VITE_DATA_ENDPOINT` 可覆盖静态 JSON 路径。
- 通过 `npm run fetch:data` 抓取网易云 ACG 榜单生成 `public/data/billboard.json`，执行后需确认文件入库并在文档记录抓取时间。
- 若真实数据获取失败且无远程接口，需评估影响并回退至 mock，同时记录问题与处理方案。

## 组件约定
- 公共组件位于 `src/components/`，包括筛选器、榜单卡片、条目预览/详情、骨架屏与活动列表。
- 页面组件位于 `src/pages/`，负责组合 store 数据与公共组件。
- 新增组件需提供必要的 TypeScript props 定义，并保持展示文案中文化。

## 实施约定
- 新增依赖前评估体积与与 Vite/Vue3 兼容性，并在 README/AGENTS 记录用途。
- 组件、store、服务层命名使用英文连字符或驼峰，中文仅用于展示文案常量。
- 复杂逻辑可添加简洁中文注释说明数据流或交互意图，避免注释冗长。
- 提交信息保持规范：`feat:`、`fix:`、`refactor:`、`chore:` 等约定用法。

## 文档与沟通
- README 与本文件需同步更新，确保技术栈、流程与约束一致。
- 新增数据同步脚本、打包命令或部署流程时，须在文档补充步骤说明。
- 遇到目标冲突或权限受限等问题，先记录信息并与需求方确认后再执行。

## 待明确事项（后续补充）
- 真实数据源/API 详细列表与接入节奏
- 视觉规范（色板、字体、响应式断点）
- 部署环境、发布流程与监控方案
