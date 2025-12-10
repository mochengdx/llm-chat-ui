import React from "react";

const InputMain: React.FC<{ value: string; onChange: (v: string) => void; onSend: () => void; disabled?: boolean }> = ({
  value,
  onChange,
  onSend,
  disabled
}) => (
  <div className="flex gap-2">
    <input
      className="flex-1 border rounded px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) onSend();
      }}
      placeholder="Type a message..."
      disabled={disabled}
    />
    <button onClick={onSend} className="px-4 py-2 rounded bg-blue-600 text-white" disabled={disabled}>
      Send
    </button>
  </div>
);

export default InputMain;
