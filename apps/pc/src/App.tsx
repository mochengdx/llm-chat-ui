import ChatMain from "@llm/ui/src/ChatMain";
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
      "user-profile": UserProfile as any,
      "image-plus": ImagePlus as any,
      "data-list": DataList as any
    }
  };

  //   自己实现的适配器实例
  //   const myAdapter = new MyCustomAdapter();
  return <ChatMain onBeforeSend={handleBeforeSend} onStreamTransform={handleStreamTransform} extensions={extensions} />;
};

export default App;
