import { visit } from "unist-util-visit";

/**
 * This plugin transforms remark directives (:::name) into hast nodes (HTML-like)
 * that react-markdown can render via its `components` prop.
 */
export default function remarkDirectiveRehype() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node.type === "textDirective" || node.type === "leafDirective" || node.type === "containerDirective") {
        const data = node.data || (node.data = {});
        const tagName = node.name;

        // Transform to a hast element (HTML tag)
        // e.g. :::user-profile -> <user-profile>
        data.hName = tagName;
        data.hProperties = node.attributes || {};
      }
    });
  };
}
