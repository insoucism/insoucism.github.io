# 碎集 · 个人网站

一个静态个人网站。零依赖、零构建，双击 `index.html` 就能看。
风格取向：**简约、破碎感、诗意**。

## 目录

```
personal-site/
├─ index.html      所有文案与结构都在这里
├─ 404.html        找不到页面时显示（沿用同一套样式）
├─ css/style.css   设计变量、排版、动效
├─ js/main.js      交互逻辑（原生 JS，无框架）
├─ favicon.svg
├─ DEPLOY.md       部署上线的四种方式
└─ README.md
```

## 本地预览

方式一：直接双击 `index.html`。

方式二（推荐，滚动/剪贴板行为与线上一致）：

```powershell
cd "D:\Deepseek workplace\coding\personal-site"
npx --yes serve . -l 4173
# 打开 http://localhost:4173
```

## 已实现的交互

| 位置 | 交互 |
| --- | --- |
| 首屏标题「林未生」 | 鼠标靠近时笔画被推开、发虚，移开自动聚回；**点击或按回车整块碎开再长回来** |
| 首屏诗句 | 「换一句」随机切换，带模糊淡出的换行效果 |
| 背景 | Canvas 尘埃缓慢上浮 + 贯穿全页的细裂纹（载入时缓缓画出来）+ 跟随指针的微光 |
| 顶栏 | 滚动出现分隔线、当前章节导航高亮、顶部 1px 阅读进度条 |
| 明暗 | 右上角按钮切换，跟随系统默认，选择写入 localStorage |
| 关于 | 进入视口时上浮淡入（骨架式入场，逐项延迟） |
| 作品 | 手风琴展开，高度平滑过渡；标题悬停左移、编号与加号联动 |
| 字 | 原生 `details` 折叠，展开有轻微上浮 |
| 写信 | 点击邮箱复制到剪贴板，带成功反馈；`execCommand` 兜底 |
| 通用 | 锚点平滑滚动（带顶栏偏移）、跳过导航链接、`prefers-reduced-motion` 下关闭全部动效 |

## 改成你自己的

文案全部在 `index.html` 里，直接改文字即可，无需动 CSS/JS：

- **姓名**：`<h1 id="hero-title">林未生</h1>`，字数随意，JS 会自动逐字拆开（建议 2–4 字）。
- **诗句**：`js/main.js` 顶部的 `lines` 数组，随便加。
- **邮箱**：两处，`.facts` 里的那行 + `#copy-mail` 的 `data-mail` 属性和按钮内文字。
- **作品 / 短文**：复制一个 `<article class="work">` 或 `<details class="word">` 改内容即可。

改风格只动 `css/style.css` 顶部的 `:root` 变量：

```css
--bg      /* 纸色 */
--ink     /* 墨色 */
--accent  /* 朱砂红，唯一强调色，别加第二个 */
--serif   /* 中文字体栈，默认宋体系 */
--measure /* 正文栏宽，默认 42rem */
```

## 下一步可以加

- 作品详情页 / 独立博文（Markdown 直出）
- 深浅色之外的第三套配色（比如「夜雨」）

## 部署

见 `DEPLOY.md`：不用构建，把 `personal-site/` 整个目录传上去即可。
最省事的是 Cloudflare Pages 或 Netlify Drop 拖拽上传，不需要命令行。

## 说明

- 无外部字体与外链资源，离线可用（`GitHub` 链接是占位，记得替换）。
- 所有动效都尊重系统的「减少动态效果」设置。
