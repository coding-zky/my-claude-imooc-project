# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人财务管理应用 — 多页面纯前端记账应用，无构建工具，浏览器直接打开 `003.前端开发工程师/frontend/pages/register.html` 或 `home.html` 即可运行。

## 文件架构

```
001.产品经理（PRD）/个人财务管理工具-PRD.md  ← 需求文档 V1.0.1（功能清单、分类表、数据结构、配色方案）

003.前端开发工程师/frontend/
├── assets/                              ← 图片、字体等静态资源
├── css/
│   └── style.css                        ← 设计系统：CSS 变量令牌、亮/暗双主题、组件样式
├── js/
│   ├── storage.js                       ← 数据层：LocalStorage CRUD、sessionStorage 会话管理
│   └── app.js                           ← 应用层：动态创建共享组件、页面逻辑、认证流程
├── pages/
│   ├── register.html                    ← 注册页
│   ├── login.html                       ← PIN 登录页
│   ├── home.html                        ← 首页（仪表盘）
│   ├── dashboard.html                   ← 统计页（收支分析）
│   ├── budget.html                      ← 预算页
│   └── settings.html                    ← 设置页（我的）
└── traditional_finance_management/
    └── DESIGN.md                        ← 设计规范文档
```

**加载顺序**: `storage.js` → `app.js`（后者依赖前者定义的全局函数）。每个 HTML 页面独立加载这两个脚本。

## 页面架构

- **多页面应用**: 每个模块独立为 `.html` 文件，通过 `<a>` 标签导航
- **页面标识**: `<body data-page="...">` 标识当前页面，JS 据此执行对应逻辑
- **动态组件**: `app.js` 动态创建共享 UI（底部导航、记账弹窗、确认框、Toast）

## 数据层关键设计

- **存储键**:
  - `finance_tracker` — 交易数据 `{ transactions, categories, budget }`
  - `finance_user` — 用户档案 `{ id, nickname, avatar, pin, ... }`
  - `finance_session` — sessionStorage 登录状态（跨页面持久）
- **首次初始化**: 生成 30 天随机示例数据，含 1-3 笔/天支出 + 第 0/15/28 天收入
- **ID 生成**: `tx_` 前缀用于交易，`cat_` 前缀用于分类，均以时间戳 + 随机后缀构成
- **预设分类**: 15 个（10 支出 + 5 收入），`isDefault: true` 的分类不可删除
- **分类删除**: 自动将该分类下的交易迁移到对应的「其他支出」/「其他收入」
- **日期格式**: 统一使用 `YYYY-MM-DD` 字符串，月查询用 `startsWith(prefix)` 匹配

## 认证流程

1. **注册** (`register.html`): 设置昵称、头像、可选 PIN 码
2. **登录** (`login.html`): 若设置了 PIN，需验证后才能进入主应用
3. **会话管理**: `sessionStorage.setItem('finance_session', 'active')` 标记已登录
4. **鉴权守卫**: 每个主页面加载时检查用户档案和会话状态，未通过则重定向

## 视图状态管理

`App` 对象持有当前页面状态（`currentYear`, `currentMonth`, `editingTxId` 等）。每个页面独立运行，月份状态在页面内管理。

`renderPage()` 根据当前页面调用对应渲染方法：
- `home` → `renderHome()` — 概览卡片 + 流水列表
- `dashboard` → `renderStats()` — CSS conic-gradient 饼图 + 排行榜
- `budget` → `renderBudget()` — SVG 环形图 + 预算统计
- `settings` → `renderSettings()` — 用户信息 + 分类管理

## 外部依赖

- **Google Fonts**: Plus Jakarta Sans 字体，通过 `@import` 加载
- **无 Chart.js**: 饼图使用 CSS `conic-gradient` 实现，无外部依赖
- **纯原生**: 无框架、无构建工具，浏览器直接打开即可运行
