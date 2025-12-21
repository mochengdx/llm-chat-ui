import { ChatMain } from "@llm/ui-less";
import { ConfirmButton } from "./components/ConfirmButton";
import { DataList } from "./components/DataList";
import { ImagePlus } from "./components/ImagePlus";
import { UserProfile } from "./components/UserProfile";

const App = () => {
  // AOP Hook: Before sending message
  const handleBeforeSend = async (message: string) => {
    console.log("[AOP] Intercepted send:", message);

    // Example 1: Filter specific keywords
    if (message.includes("forbidden")) {
      alert("Message contains forbidden words!");
      return ""; // Cancel sending
    }

    // Example 2: Add prompt prefix
    if (message.startsWith("/translate")) {
      return `Please translate the following text to Chinese: ${message.replace("/translate", "")}`;
    }

    return message;
  };

  // AOP Hook: Transform received stream
  const handleStreamTransform = (chunk: string) => {
    // Example: Simple transformation (e.g., masking sensitive info)
    // return chunk.replace(/password/g, "***");
    return chunk;
  };

  // Define custom extensions
  const extensions = {
    directiveComponents: {
      "user-profile": UserProfile,
      "image-plus": ImagePlus,
      "data-list": DataList,
      "confirm-button": ConfirmButton
    }
  };

  // Define custom triggers
  const triggers = {
    mentions: [
      {
        id: "support",
        label: "Support Team",
        description: "Mention the support team"
        // No prompt -> Standard mention behavior (inserts text)
        // 无 prompt -> 标准提及行为（插入文本）
      },
      {
        id: "translator",
        label: "Translator",
        description: "Activate translation mode",
        // Has prompt -> Capability behavior (adds chip)
        // 有 prompt -> 能力行为（添加胶囊）
        prompt: "You are a professional translator. Please translate the following text into elegant Chinese."
      }
    ],
    tags: [
      {
        id: "custom-directive",
        label: "Custom Directive",
        description: "A custom injected directive",
        prompt: "Please use the custom directive: ::custom-directive[Content]{prop='value'}"
      }
    ]
  };

  //   自己实现的适配器实例
  //   const myAdapter = new MyCustomAdapter();
  return (
    <ChatMain
      onBeforeSend={handleBeforeSend}
      onStreamTransform={handleStreamTransform}
      extensions={extensions}
      triggers={triggers}
    />
  );
};

export default App;
