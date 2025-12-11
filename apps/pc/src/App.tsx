import ChatMain from "@llm/ui/src/ChatMain";

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

  //   自己实现的适配器实例
  //   const myAdapter = new MyCustomAdapter();
  return <ChatMain onBeforeSend={handleBeforeSend} onStreamTransform={handleStreamTransform} />;
};

export default App;
