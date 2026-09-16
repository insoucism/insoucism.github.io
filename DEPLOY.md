# 部署上线

这个站点是**纯静态**的：没有构建步骤，没有依赖。
要发布的就是 `personal-site/` 目录本身，`index.html` 在根目录。

> 部署前先改掉占位内容：姓名（`index.html` 里的 `林未生`）、邮箱（`hi@example.com`，共两处）、
> GitHub 链接（`https://github.com/`）。花两分钟，「关于」和「写信」两节才像你自己的。

---

## 方案 A · Cloudflare Pages（推荐：国内访问相对最好，免备案，不用命令行）

1. 打开 <https://dash.cloudflare.com> 注册/登录（免费）
2. 左侧 **Workers 和 Pages** → **创建** → **Pages** → **上传资产**
3. 项目名填 `sui-ji`（随你），然后把 `personal-site` **文件夹里**的内容拖进去
   （`index.html`、`404.html`、`favicon.svg`、`css/`、`js/`）
4. 点部署，几十秒后拿到网址：`https://sui-ji.pages.dev`
5. 以后更新：进同一个项目 → **创建新部署** → 重新上传

## 方案 B · Netlify Drop（最快，约 30 秒出网址）

1. 打开 <https://app.netlify.com/drop>
2. 把 `personal-site` 文件夹整个拖进虚线框
3. 立刻得到 `https://随机名.netlify.app`
4. 想改成好记的名字或长期保留，注册个账号即可（Drop 的临时站点不注册会过期）

## 方案 C · Vercel（命令行，需要 Node）

```powershell
cd "D:\Deepseek workplace\coding\personal-site"
npx.cmd vercel --prod
```

首次运行会让你在浏览器里登录确认，之后每条命令都会打印线上网址。

> **注意**：在 PowerShell 里如果报「禁止运行脚本 / npx.ps1」，
> 把 `npx` 写成 `npx.cmd` 就好（本机就是这种情况）。
> 另外 `*.vercel.app` 在国内直连常不稳定，介意的话优先选方案 A。

## 方案 D · GitHub Pages（适合长期维护）

这个目录已经是 git 仓库，首次提交也做好了。仓库里附带一键脚本：

**第 1 步 · 在网页上建一个空仓库**

打开 <https://github.com/new>：

- **Repository name** 建议直接填 `你的用户名.github.io`
  （这样站点地址是 `https://你的用户名.github.io/`，根路径，样式和 404 页面都不用改）
- 可见性选 **Public**
- **不要勾** Add a README file、Add .gitignore、Choose a license
  （勾了会产生一个提交，导致下面 push 被拒）

**第 2 步 · 推送**

在 `personal-site` 目录里跑（两种都行）：

```powershell
# 方式一：双击 deploy-github.cmd，按提示输入用户名

# 方式二：命令行
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-github.ps1 -User 你的用户名
```

脚本会设置 `origin`、推送 `main`、并打印访问地址。不会强推、不会重写历史。
它会弹一次 GitHub 登录窗口，在浏览器里确认即可（用的是系统自带的 Git 凭据管理器，
脚本看不到你的密码）。想先看不动手，加 `-SkipPush`。

**第 3 步 · 等待发布**

用户站点（仓库名 = `用户名.github.io`）一般自动发布，等一两分钟访问 `https://你的用户名.github.io/`。
若 404，去仓库 **Settings → Pages**，确认 Source 是 `Deploy from a branch`、分支 `main`、目录 `/(root)`。

> **如果仓库名不是 `用户名.github.io`**：那就是子路径站点，网址形如
> `https://用户名.github.io/仓库名/`，需要手动开 Pages，而且 `404.html` 里
> `/css/style.css`、`/js/main.js`、`/favicon.svg` 三处绝对路径要改成相对路径，否则 404 页会掉样式。
>
> **提交身份**目前是占位的（`未生 <hi@example.com>`），换成你自己的：
> ```powershell
> git config user.name "你的名字"
> git config user.email "你的邮箱"
> git commit --amend --reset-author --no-edit
> ```

---

## 关于域名与备案

- `*.pages.dev`、`*.netlify.app` 这类平台自带域名**不需要备案**，注册完就能用
- 想绑自己的域名：这些国外平台免备案，但需要域名能正常解析；若域名和服务器都在国内，则需要 ICP 备案
- 换域名后不用改代码，`index.html` 里全是相对路径

## 更新网站

改完文件重新上传 / 重新 `git push` 就行，**不需要构建命令**，也没有缓存策略要配。
