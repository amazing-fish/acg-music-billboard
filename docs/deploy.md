# 部署指南

## GitHub Pages 自动部署
- 仓库已配置 `.github/workflows/deploy.yml`，当推送到 `main` 或手动触发 workflow 时会自动执行：
  1. `npm ci`
  2. `npm run fetch:data`
  3. `npm run build -- --base=/acg-music-billboard/`
  4. 将 `dist/` 发布到 GitHub Pages

## 本地手动部署
1. 运行 `npm run fetch:data` 以生成最新的 `public/data/billboard.json`
2. 构建产物：
   ```bash
   npm run build -- --base=/acg-music-billboard/
   ```
3. 将 `dist/` 目录中的静态文件上传至任意静态托管平台

> 如果部署到不同路径，可将 `--base=/自定义路径/` 调整为目标根路径。
