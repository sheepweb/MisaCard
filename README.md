# MisaCard

一个基于 Next.js 的 MujiCard 卡片管理系统，支持卡片查询和自动激活功能。

## ✨ 功能特性

- 🔍 **卡片查询** - 输入卡密快速查询卡片信息
- 🚀 **自动激活** - 检测到未激活卡片时自动调用激活 API
- 🔒 **API 代理** - 后端代理转发请求，保护真实 API 地址
- 📋 **一键复制** - 支持复制卡号、CVC、有效期等信息
- ⚡ **性能优化** - 使用 React.memo、useCallback、骨架屏等优化技术
- 🎨 **精美 UI** - 蓝色渐变背景，字段高亮显示

## 🛠️ 技术栈

- **框架**: Next.js 16.0.0 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **运行时**: React 18+

## 🚀 快速开始

### 安装依赖

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 运行开发服务器

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
app/
├── api/
│   └── card/
│       └── [card_id]/
│           ├── route.ts          # 查询 API 代理
│           └── activate/
│               └── route.ts      # 激活 API 代理
├── components/
│   ├── CardInfoDisplay.tsx       # 卡片信息展示组件
│   └── CardInfoSkeleton.tsx      # 骨架屏组件
├── utils/
│   └── helpers.ts                # 工具函数（日志、错误处理）
├── page.tsx                      # 主页面
├── types.ts                      # TypeScript 类型定义
└── globals.css                   # 全局样式
```

## 🎯 核心功能说明

### 自动激活流程

1. 用户输入卡密并查询
2. 系统检测卡片状态（card_number、card_cvc、card_exp_date 是否为 null）
3. 如果未激活，自动调用激活 API
4. 激活成功后直接显示完整卡片信息（无需重复查询）

### API 代理架构

- **查询**: `GET /api/card/[card_id]` → `GET https://mujicard.com/api/card/{card_id}`
- **激活**: `POST /api/card/[card_id]/activate` → `POST https://mujicard.com/api/card/activate/{card_id}`

## 📝 开发说明

### 环境变量

项目使用环境感知的日志系统：
- 开发环境：显示详细日志
- 生产环境：仅显示错误日志

### 代码优化

- ✅ 使用工具函数统一错误处理和日志
- ✅ 提取样式常量减少重复代码
- ✅ 配置驱动的骨架屏组件
- ✅ 优化激活流程，减少 50% HTTP 请求

## 📄 License

MIT

## 🙏 致谢

本项目基于 [Next.js](https://nextjs.org) 构建。
