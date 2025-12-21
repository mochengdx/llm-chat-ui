import React from "react";
import { Translations } from "../../../locales/en";

export interface CodeBlockRendererProps {
  content: string;
  language: string;
  t?: Translations;
  onSend?: (message: string) => void;
}

export type CodeBlockRenderer = React.FC<CodeBlockRendererProps>;

export interface RendererRegistry {
  [language: string]: CodeBlockRenderer;
}

export interface DirectiveComponentProps {
  node: any;
  onSend?: (message: string) => void;
  [key: string]: any;
}

export type DirectiveComponent = React.FC<DirectiveComponentProps>;

export interface DirectiveRegistry {
  [directiveName: string]: DirectiveComponent;
}

export interface ChatExtensions {
  /**
   * Custom renderers for code blocks (e.g. ```booth)
   */
  codeBlockRenderers?: RendererRegistry;
  /**
   * Custom components for markdown directives (e.g. :::user-profile)
   */
  directiveComponents?: DirectiveRegistry;
}
