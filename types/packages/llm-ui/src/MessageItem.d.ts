import type { Message } from "@llm/core";
declare const MessageItem: import("react").MemoExoticComponent<({ msg, onEdit, onRegenerate, onOpenCanvas }: {
    msg: Message;
    onEdit: (id: string, newContent: string) => void;
    onRegenerate: () => void;
    onOpenCanvas: (code: string) => void;
}) => import("react/jsx-runtime").JSX.Element>;
export default MessageItem;
//# sourceMappingURL=MessageItem.d.ts.map