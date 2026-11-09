# PICKCAT 还原版

使用 **Vue 2.7 + pnpm** 还原的 PICKCAT 社区站点，并通过 **uv + FastAPI** 反向代理原站 API、托管前端构建产物。项目重点保证在 **IE11** 中可正常运行。

- 原站：<https://pickcat.dao3.fun/>
- 本地预览：<http://127.0.0.1:8000>

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端框架 | Vue 2.7.16 |
| 路由 | Vue Router 3.6.5（history 模式） |
| 请求 | axios 0.27.2 |
| 构建 | Vue CLI 5 / webpack 5 / pnpm |
| 样式 | SCSS，无 CSS 变量、Grid、flex gap、sticky、clamp |
| 兼容 | Babel + core-js 3 + regenerator-runtime，IE11 legacy 包 |
| 后端 | Python 3.10+ / uv / FastAPI / httpx / uvicorn |

## 目录结构

```text
.
├── backend/
│   ├── main.py              # FastAPI：/api 反代 + app.frontend() 托管前端
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── public/              # logo、横幅、编辑器图标等静态资源
│   ├── src/
│   │   ├── api/             # /api/v1 请求封装
│   │   ├── components/      # 页头、页脚、卡片、侧边栏等
│   │   ├── directives/      # 富文本渲染与 @用户解析
│   │   ├── router/          # 路由表
│   │   ├── store/           # 会话、板块缓存
│   │   ├── styles/          # 全局样式与主题
│   │   ├── utils/           # 时间、计数、WebP 检测、主题
│   │   ├── views/           # 页面
│   │   ├── App.vue
│   │   └── main.js
│   ├── babel.config.js
│   ├── vue.config.js
│   ├── package.json
│   └── pnpm-lock.yaml
└── README.md
```

## 功能

- 首页信息流：关注 / 推荐 / 最新，游标分页加载
- 板块页、分类页
- 帖子详情：正文、@用户解析、评论区站内链接本地化、评论排序与分页
- 作品页：精选横幅、关注 / 推荐 / 最新、作品网格
- 作品详情页
- 搜索：帖子 / 作品 / 用户及数量统计
- 用户主页：资料、统计、精选帖子与作品
- 登录 / 注册 / 发帖 UI
- 明暗主题（浅色 / 深色 / 跟随系统）
- 桌面、平板、移动端响应式与移动端底栏
- 404 页面

## 快速开始

### 1. 启动后端（同时托管前端）

```bash
cd backend
uv sync
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

打开 <http://127.0.0.1:8000>。

### 2. 前端开发模式

开发模式下 Vue CLI 会把 `/api` 代理到 `https://pickcat.dao3.fun`：

```bash
cd frontend
pnpm install
pnpm serve
```

默认地址：<http://localhost:8080>。

### 3. 构建前端

```bash
cd frontend
pnpm build
```

产物输出到 `frontend/dist`，后端会直接读取该目录，无需重启 uvicorn。

## 关于 CORS 与反向代理

原站 API 对跨域请求不返回 `Access-Control-Allow-Origin`，浏览器直接请求会被 CORS 拦截，因此使用 FastAPI 转发：

- `GET/POST/PUT/PATCH/DELETE /api/{path}` → `https://pickcat.dao3.fun/api/{path}`
- 转发 `Accept`、`Content-Type`、`Cookie`、`User-Agent` 等必要请求头
- 保留 `Content-Type`、`Cache-Control`、`ETag`、多个 `Set-Cookie` 等响应头
- 前端与 API 同源，因此不需要额外 CORS 配置

后端通过下面的方式托管 SPA：

```python
app.frontend("/", directory=str(FRONTEND_DIR), fallback="index.html", check_dir=False)
```

FastAPI 会优先匹配 `/api` 路径操作，其余请求再交给前端静态文件与 `index.html` 回退。

## IE11 兼容说明

`pnpm build` 会根据 `browserslist` 同时生成现代包和 legacy 包：

- 现代包：`type="module"`
- legacy 包：`nomodule`，IE11 会自动加载

已处理以下兼容点：

- Babel 将 legacy 代码编译为 ES5，`core-js 3` 注入 `Promise`、`Object.assign` 等 polyfill
- 禁用 CSS 变量、Grid、flex gap、`position: sticky`、`clamp()`、`aspect-ratio`、`oklch`
- Autoprefixer 生成 `-ms-flex` / `-ms-inline-flexbox` 前缀
- 页头使用 `position: fixed`，不使用 `sticky`
- 图片封面使用 `background-size: cover`，不使用 `object-fit`
- IE11 不支持 WebP 时：
  - 头像降级为用户名首字
  - 正文图片显示 `[图片]` 占位
  - 表情显示 `[表情]`
  - 作品封面显示标题首字与渐变底色
- @用户解析仅使用 ES5 语法与 Promise，可在 IE11 中运行

兼容性校验命令：

```bash
cd frontend
pnpm build
npx es-check@7 es5 'dist/js/*legacy*.js'
```

## @用户与站内链接

原站正文中的提及是下面这种只有内部 ID 的占位：

```html
<span class="markdown-user-mention" data-user-id="01a0b869-...">@{01a0b869-...}</span>
```

前端在 [rich.js](frontend/src/directives/rich.js) 中：

1. 扫描 `.markdown-user-mention[data-user-id]`
2. 请求 `/api/v1/users/{id}` 获取用户名
3. 渲染为 `@用户名`，链接到 `/profile/{id}`，新标签页打开
4. 全局缓存用户名，避免重复请求
5. 失败时降级为 `@用户`

同一处还会把正文和评论中指向 `https://pickcat.dao3.fun` 的链接改写为当前启动地址：

- `https://pickcat.dao3.fun/forum/post/...` → `http://当前地址/forum/post/...`
- 站内链接在当前标签页打开
- 其他外部链接保持新标签页打开

## 主要路由

| 路径 | 页面 |
| --- | --- |
| `/` | 首页信息流 |
| `/forum` | 板块 |
| `/forum/category/:slug` | 分类 |
| `/forum/post/:id` | 帖子详情 |
| `/forum/editor` | 发帖 UI |
| `/works` | 作品列表 |
| `/works/:id` | 作品详情 |
| `/search` | 搜索 |
| `/profile/:id` | 用户主页 |
| `/login` / `/register` | 登录 / 注册 UI |

## 已知限制

- 登录、注册需要原站人机验证，静态还原版本未接入，因此仅提供 UI
- 点赞、收藏、评论、发帖等写操作需要登录态，目前会提示“请先登录”
- 首页“关注”和作品页“关注”在未登录时显示登录提示
- 正文中的正文图片与表情来自原站 WebP 接口，IE11 下使用文字占位
- 页面数据实时读取原站 API，原站内容变化会直接影响展示
