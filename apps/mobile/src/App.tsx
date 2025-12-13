import ChatMobile from "@llm/ui/src/ChatMobile";
import { ConfirmButton } from "./components/ConfirmButton";

const App = () => {
  const extensions = {
    directiveComponents: {
      "confirm-button": ConfirmButton
    }
  };

  return <ChatMobile extensions={extensions} />;
};

export default App;
