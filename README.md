# 解压小游戏合集

纯前端解压小游戏网站，包含 32 款即开即玩的小游戏，无需登录与后端。

## 游戏列表

| 游戏 | 说明 |
|------|------|
| 捏泡泡纸 | 点击捏爆气泡 |
| 电子木鱼 | 敲击累计功德 |
| 指尖陀螺 | 滑动拨动旋转 |
| 试管倒水 | 颜色排序过关 |
| 收纳抽屉 | 拖拽物品归位 |
| 打地鼠 | 30 秒计分挑战 |
| 碎纸机 | 拖纸粉碎 |
| 擦玻璃 | 擦除雾气 |
| 呼吸泡泡 | 跟随节奏呼吸 |
| 涂鸦板 | 自由绘画 |
| 戳泡泡 | 点击上升气泡 |
| 捏压力球 | 按住捏扁回弹 |
| 抛硬币 | 随机正反面 |
| 掷骰子 | 摇动看点数 |
| 猜拳 | 石头剪刀布 |
| 撕纸 | 逐条撕下 |
| 禅意沙盘 | 耙沙画纹 |
| 雨窗 | 点击溅雨滴 |
| 迷你钢琴 | 琴键演奏 |
| 翻牌记忆 | 图案配对 |
| 数字华容道 | 3×3 滑动拼图 |
| 水波纹 | 点击起涟漪 |
| 接星星 | 30 秒接星星 |
| 叠方块 | 对齐叠塔 |
| 吸尘器 | 吸走灰尘 |
| 浇水植物 | 浇水成长 |
| 雪球 | 摇晃飘雪 |
| 磁铁 | 吸引铁屑 |
| 揭贴纸 | 撕开看惊喜 |
| 盖章 | 纸上盖章 |
| 钟摆 | 物理摆动 |
| 爆戳键盘 | 狂按解压 |

## 国内访问（推荐 GitHub Pages）

Vercel（`*.vercel.app`）在国内通常需要梯子。已为仓库配置 **GitHub Pages** 自动部署：

**访问地址：** https://lucky-billy.github.io/stress-games/

首次启用（按顺序操作）：

1. **Settings → Actions → General → Workflow permissions** 选 **Read and write permissions**，保存  
2. 推送代码后，打开 **Actions**，等 **Deploy GitHub Pages** 跑绿（会生成 `gh-pages` 分支）  
3. **Settings → Pages → Build and deployment → Source** 选 **Deploy from a branch**  
   - Branch：**gh-pages**  
   - Folder：**/ (root)**  
4. 保存后访问：**https://lucky-billy.github.io/stress-games/**

若 deploy 曾报 `Ensure GitHub Pages has been enabled`，按上面第 3 步改成分支部署即可，然后在 Actions 里 **Re-run all jobs**。

之后每次 `push` 到 `main` 会自动更新。国内访问 GitHub Pages 也不保证 100% 稳定，但一般比 Vercel 更容易打开。

## 部署到 Vercel（海外 / 需梯子）

仓库：[github.com/lucky-billy/stress-games](https://github.com/lucky-billy/stress-games)

- 地址：https://stress-games.vercel.app
- **Build Command**：`npm run build`（不要用 `build:pages`）
- **Output Directory**：`dist`

`vercel.json` 已配置 SPA 路由。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址（通常为 http://localhost:5173）。

## 构建与预览

```bash
npm run build
npm run preview
```

构建产物在 `dist/` 目录，可部署到任意静态托管（Vercel、Netlify、GitHub Pages 等）。

- Vercel：`base: './'`（`npm run build`）
- GitHub Pages：`base: '/stress-games/'`（`GITHUB_PAGES=true npm run build:pages`）

## 技术栈

- Vite + React 18 + TypeScript
- React Router（按游戏懒加载分包）
- Web Audio API 合成音效

## 扩展新游戏

1. 在 `src/games/<slug>/Game.tsx` 新建游戏组件（默认导出）
2. 在 `src/games/registry.ts` 的 `gameList` 中注册一项
