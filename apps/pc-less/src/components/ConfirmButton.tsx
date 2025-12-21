import React from "react";
import styles from "./ConfirmButton.module.less";

interface ConfirmButtonProps {
  message?: string;
  onSend?: (message: string) => void;
  children?: React.ReactNode;
  node?: any;
  [key: string]: any;
}

/**
 * ConfirmButton Component
 *
 * A custom directive component that renders a confirmation button.
 * When clicked, it sends a predefined message back to the chat.
 *
 * Usage in Markdown:
 * ::confirm-button[Confirm Action]{message="I confirm the action"}
 */
export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ message, children, onSend, node }) => {
  // We can get message from props (if passed by remark-directive-rehype) or node attributes
  const messageToSend = message || node?.attributes?.message || "Confirmed";

  // children usually contains the text content of the directive
  // e.g. [Confirm Action] -> children
  // But react-markdown might pass it differently.
  // If children is a string or simple element, we can use it.
  // Or we can look at node.children[0].value

  const buttonText =
    children && React.Children.count(children) > 0 ? children : node?.children?.[0]?.value || "Confirm";

  const handleClick = () => {
    if (onSend) {
      onSend(messageToSend);
    } else {
      console.warn("onSend callback is not available");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.label}>Action Required</span>
        <button onClick={handleClick} className={styles.button}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};
