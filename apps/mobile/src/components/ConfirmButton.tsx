import React from "react";

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
  const messageToSend = message || node?.attributes?.message || "Confirmed";

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
    <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-300">Action Required</span>
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
