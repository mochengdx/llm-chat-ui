import { visit } from "unist-util-visit";

interface UnistNode {
  type: string;
  data?: any;
  position?: any;
  [key: string]: any;
}

interface DirectiveNode extends UnistNode {
  name: string;
  attributes?: Record<string, string>;
  data?: {
    hName?: string;
    hProperties?: Record<string, string>;
    [key: string]: any;
  };
}

/**
 * This plugin transforms remark directives (:::name) into hast nodes (HTML-like)
 * that react-markdown can render via its `components` prop.
 */
export default function remarkDirectiveRehype() {
  return (tree: UnistNode) => {
    visit(tree, (node) => {
      if (node.type === "textDirective" || node.type === "leafDirective" || node.type === "containerDirective") {
        const directiveNode = node as DirectiveNode;
        const data = directiveNode.data || (directiveNode.data = {});
        const tagName = directiveNode.name;

        // Transform to a hast element (HTML tag)
        // e.g. :::user-profile -> <user-profile>
        data.hName = tagName;
        data.hProperties = directiveNode.attributes || {};
      }
    });
  };
}
