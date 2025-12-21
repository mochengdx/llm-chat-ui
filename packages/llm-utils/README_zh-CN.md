# @llm/utils (简体中文)

LLM 聊天应用的通用工具函数与辅助类。

## 功能特性

- **字符串工具**: URL 提取、验证和处理。
- **类型辅助**: 通用的 TypeScript 工具类型。
- **共享逻辑**: 跨包复用的通用逻辑。

## 安装

```bash
pnpm add @llm/utils
```

## 使用

```typescript
import { extractUrls } from "@llm/utils";

const urls = extractUrls("Check this https://example.com");
```
