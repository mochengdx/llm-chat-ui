# Origami Form Engine

A modern, high-performance form engine built with React, TypeScript, and Tailwind CSS.

## Project Structure

This project is a Monorepo managed by pnpm workspaces.

### Apps

- **apps/form-builder**: A visual drag-and-drop form builder application.
- **apps/form-runner**: A standalone form renderer application.

### Packages

- **packages/core**: Core logic, state management (Zustand), and schema definitions.
- **packages/form-ui**: Shared UI components and utilities.
- **packages/default-widgets**: Default set of form widgets (Input, Select, Date, etc.) and the `FormRunner` component.
- **packages/ts-config**: Shared TypeScript configurations.

## Getting Started

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Start Form Builder**

   ```bash
   pnpm dev:builder
   ```

3. **Start Form Runner**

   ```bash
   pnpm dev:runner
   ```

## Development

- **Build all packages**: `pnpm build`
- **Clean**: `pnpm clean`
