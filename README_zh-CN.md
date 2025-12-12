# Simple LLM Chat (简体中文)

一个基于 React、Tailwind CSS 和 TypeScript 构建的现代化、响应式且功能丰富的 LLM 聊天界面。本项目采用 Monorepo 架构，提供统一的核心库和 UI 组件库，同时支持 PC 端和移动端应用。

## 功能特性

- **多平台支持**:
  - **PC Web**: 功能齐全的桌面端界面，包含侧边栏、设置和 Artifact 面板。
  - **Mobile Web**: 针对移动端优化的体验，支持触摸操作和响应式布局。
- **高级流式传输**:
  - 实时响应流式传输。
  - 支持 Server-Sent Events (SSE) 和 WebSocket 协议。
  - 可扩展的 `StreamAdapter` 架构。
- **丰富的内容渲染**:
  - **Markdown**: 完整的 Markdown 支持，包括表格、列表和格式化。
  - **代码高亮**: 支持代码块语法高亮和复制功能。
  - **Artifacts**: 专用的面板用于查看和管理生成的代码或内容。
- **思考过程**: 可视化模型的"思维链"或推理过程（支持展开/折叠）。
- **个性化设置**:
  - 主题切换（亮色/暗色模式）。
  - 模型选择。
  - 使用模式（通用、开发者、创意）。
- **开发者友好**:
  - **Monorepo**: 使用 pnpm workspaces 管理模块化开发。
  - **类型安全**: 使用 TypeScript 构建。
  - **现代技术栈**: React, Vite, Tailwind CSS, Zustand.

## 扩展能力

聊天界面具有高度的可扩展性，允许开发者通过 Markdown 指令（Markdown Directives）将自定义 React 组件直接注入到聊天流中。

### 自定义组件注入

您可以在应用程序中注册自定义组件，并通过特定的 Markdown 语法 `::component-name[content]{prop="value"}` 触发它们。

#### 内置示例

1.  **用户资料卡片** (`::user-profile`) 显示丰富的用户资料卡片。

    ```markdown
    ::user-profile[用户简介内容]{name="张三" role="开发工程师" avatar="https://example.com/avatar.png" bio="全栈开发者"}
    ```

2.  **增强图片组件** (`::image-plus`) 渲染带有标题、描述和链接的图片。

    ```markdown
    ::image-plus[图片描述]{src="https://example.com/image.png" name="图片名称" info="详细信息" link="https://example.com"}
    ```

3.  **数据列表** (`::data-list`) 根据 JSON 数据渲染结构化列表。
    ```markdown
    ::data-list[项目状态概览]{title="Q4 交付物" data='[{"title": "前端迁移", "status": "已完成", "desc": "迁移至 React 18"}, {"title": "后端 API", "status": "进行中", "desc": "实现 GraphQL 端点"}]'}
    ```

## 项目结构

本项目采用 Monorepo 结构组织：

- **apps/**
  - `pc`: 桌面端 Web 应用。
  - `mobile`: 移动端 Web 应用。
- **packages/**
  - `core`: 核心业务逻辑、类型定义和流式适配器。
  - `ui`: 共享 UI 组件（聊天界面、Markdown 渲染器、设置）。
  - `store`: 状态管理（Zustand stores）。
  - `utils`: 共享工具函数。

## 快速开始

### 前置要求

- Node.js (v18+)
- pnpm (v8+)

### 安装

1. 克隆仓库:

   ```bash
   git clone <repository-url>
   cd llm-chat-ui
   ```

2. 安装依赖:
   ```bash
   pnpm install
   ```

### 开发

启动开发服务器:

- **PC 应用**:

  ```bash
  pnpm dev:pc
  ```

- **移动端应用**:
  ```bash
  pnpm dev:mobile
  ```

### 构建

构建所有包和应用:

```bash
pnpm build:all
```

构建特定目标:

```bash
pnpm build:pc      # 构建 PC 应用
pnpm build:mobile  # 构建移动端应用
pnpm build:ui      # 构建 UI 包
```

## 许可证

MIT
