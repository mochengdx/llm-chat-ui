import React from "react";

export interface CodeBlockRendererProps {
  content: string;
  language: string;
}

export type CodeBlockRenderer = React.FC<CodeBlockRendererProps>;

export interface RendererRegistry {
  [language: string]: CodeBlockRenderer;
}
