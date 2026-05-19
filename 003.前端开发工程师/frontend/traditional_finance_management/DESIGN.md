# 传统财务管理工具设计规范

> 基于 Stitch 生成的设计系统配置，适配移动端优先的记账应用

---

## 1. 设计理念

### 1.1 产品定位
- **类型**: 个人财务管理工具 / 记账应用
- **风格**: 现代简约、专业可信
- **关键词**: 清晰、高效、安全、温暖

### 1.2 设计原则
- **数据优先**: 让数字成为视觉焦点
- **层级分明**: 重要信息突出，次要信息收敛
- **操作便捷**: 减少点击层级，核心功能一触即达
- **情感化设计**: 适度使用图标和颜色传递温度

---

## 2. 色彩系统

### 2.1 亮色模式 (Light Mode)

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--primary` | `#0F172A` | 主色调、重要按钮、导航激活态 |
| `--primary-hover` | `#1E293B` | 主色悬停态 |
| `--on-primary` | `#FFFFFF` | 主色背景上的文字 |
| `--secondary` | `#1E3A8A` | 次要强调色 |
| `--accent` | `#A16207` | 强调色、链接、可点击提示 |
| `--accent-light` | `#FEF3C7` | 强调色背景 |

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--bg` | `#F8FAFC` | 页面背景 |
| `--surface` | `#FFFFFF` | 卡片、容器背景 |
| `--surface-hover` | `#F1F5F9` | 悬停态背景 |
| `--border` | `#E2E8F0` | 边框、分割线 |

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--text` | `#020617` | 主文字 |
| `--text-secondary` | `#475569` | 次要文字、标签 |
| `--text-tertiary` | `#94A3B8` | 辅助文字、占位符 |

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--expense` | `#DC2626` | 支出金额、警告 |
| `--expense-bg` | `#FEF2F2` | 支出背景 |
| `--income` | `#059669` | 收入金额、成功 |
| `--income-bg` | `#ECFDF5` | 收入背景 |

### 2.2 暗色模式 (Dark Mode)

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--primary` | `#1E40AF` | 主色调（暗色模式下更亮） |
| `--primary-hover` | `#2563EB` | 主色悬停态 |
| `--secondary` | `#3B82F6` | 次要强调色 |
| `--accent` | `#059669` | 强调色 |
| `--accent-light` | `#064E3B` | 强调色背景 |

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--bg` | `#0F172A` | 页面背景 |
| `--surface` | `#1E293B` | 卡片、容器背景 |
| `--surface-hover` | `#273449` | 悬停态背景 |
| `--border` | `rgba(255,255,255,0.08)` | 边框、分割线 |

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--text` | `#F1F5F9` | 主文字 |
| `--text-secondary` | `#94A3B8` | 次要文字 |
| `--text-tertiary` | `#64748B` | 辅助文字 |

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--expense` | `#EF4444` | 支出金额 |
| `--expense-bg` | `#450A0A` | 支出背景 |
| `--income` | `#10B981` | 收入金额 |
| `--income-bg` | `#052E16` | 收入背景 |

---

## 3. 字体系统

### 3.1 字体家族

```css
--font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

- **主字体**: Plus Jakarta Sans
- **回退字体**: 系统无衬线字体

### 3.2 字重

| 字重 | 值 | 用途 |
|------|-----|------|
| Light | 300 | 大标题装饰 |
| Regular | 400 | 正文 |
| Medium | 500 | 标签、按钮 |
| SemiBold | 600 | 小标题、强调 |
| Bold | 700 | 标题、金额数字 |

### 3.3 字号比例

| 名称 | 尺寸 | 用途 |
|------|------|------|
| xs | 0.75rem (12px) | 辅助文字、标签 |
| sm | 0.875rem (14px) | 次要文字 |
| base | 1rem (16px) | 正文基准 |
| lg | 1.125rem (18px) | 小标题 |
| xl | 1.25rem (20px) | 标题 |
| 2xl | 1.5rem (24px) | 大标题 |
| 3xl | 2rem (32px) | 页面标题 |

### 3.4 行高

```css
line-height: 1.6;  /* 正文 */
line-height: 1.4;  /* 标题 */
line-height: 1.2;  /* 大标题 */
```

---

## 4. 间距系统

### 4.1 基础间距

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--space-xs` | 4px | 紧凑间距 |
| `--space-sm` | 8px | 元素内间距 |
| `--space` | 16px | 标准间距 |
| `--space-lg` | 24px | 区块间距 |
| `--space-xl` | 32px | 大间距 |

### 4.2 应用示例

```
页面内边距: var(--space)
卡片内边距: var(--space)
列表项间距: var(--space-xs)
区块间距: var(--space-lg)
```

---

## 5. 圆角系统

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--radius-sm` | 8px | 小元素（标签、输入框） |
| `--radius` | 12px | 卡片、按钮 |
| `--radius-lg` | 16px | 大卡片、区块 |
| `--radius-xl` | 20px | 弹窗、底部面板 |
| `--radius-full` | 9999px | 圆形按钮、头像 |

---

## 6. 阴影系统

### 6.1 亮色模式

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | 微阴影 |
| `--shadow` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | 标准阴影 |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)` | 中等阴影 |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)` | 大阴影 |
| `--shadow-xl` | `0 20px 40px rgba(0,0,0,0.12)` | 弹窗阴影 |

### 6.2 暗色模式

阴影透明度提高 30%-50%，以适应深色背景。

---

## 7. 动效规范

### 7.1 过渡时长

| 类型 | 时长 | 用途 |
|------|------|------|
| 快速 | 150ms | 悬停、激活态 |
| 标准 | 200ms | 颜色、透明度 |
| 中等 | 300ms | 弹窗、滑动 |

### 7.2 缓动函数

```css
--transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

- **ease-out**: 进入动画
- **ease-in**: 退出动画
- **cubic-bezier(0.4, 0, 0.2, 1)**: 标准缓动

### 7.3 关键动画

```css
/* 页面淡入 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 弹窗滑入 */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

/* 错误抖动 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-4px); }
}
```

---

## 8. 响应式断点

| 断点 | 宽度 | 用途 |
|------|------|------|
| 移动端 | < 768px | 主要适配 |
| 桌面端 | ≥ 768px | 边框、阴影增强 |

### 8.1 容器限制

```css
#app {
  max-width: 480px;
  margin: 0 auto;
}
```

移动端优先，最大宽度 480px，居中显示。

---

## 9. 组件规范

### 9.1 底部导航

- 高度: 72px
- 图标尺寸: 24px
- 文字尺寸: 0.65rem
- 中间按钮偏移: -20px
- FAB 直径: 52px

### 9.2 卡片

- 内边距: var(--space)
- 边框: 1px solid var(--border)
- 圆角: var(--radius)

### 9.3 按钮

- 内边距: 14px var(--space-lg)
- 圆角: var(--radius-full)
- 最小高度: 44px

### 9.4 输入框

- 内边距: 12px var(--space)
- 边框: 1px solid var(--border)
- 圆角: var(--radius)
- 字号: 0.95rem

---

## 10. 可访问性

### 10.1 颜色对比度

- 主文字与背景: ≥ 7:1 (AAA)
- 次要文字与背景: ≥ 4.5:1 (AA)
- 功能色与背景: ≥ 3:1

### 10.2 焦点状态

```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 10.3 动效偏好

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. 图标规范

### 11.1 导航图标

使用 SVG 内联图标，确保：
- 尺寸: 24px
- 描边宽度: 2px
- 描边端点: round
- 描边连接: round

### 11.2 分类图标

使用 Emoji 图标，便于用户自定义：
- 尺寸: 1.3rem (列表) / 1.5rem (选择器)
- 存储为字符串，支持用户配置

---

## 12. 文件引用

```html
<!-- 样式表 -->
<link rel="stylesheet" href="../css/style.css"/>

<!-- 脚本 -->
<script src="../js/storage.js"></script>
<script src="../js/app.js"></script>
```

---

*最后更新: 2026-05*
