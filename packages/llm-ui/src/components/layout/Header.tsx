import React from "react";

const HeaderMain: React.FC<{ onSettings: () => void }> = ({ onSettings }) => (
  <div className="flex items-center justify-between w-full">
    <h1 className="text-xl font-bold">LLM Chat</h1>
    <button onClick={onSettings} className="px-3 py-1 rounded bg-gray-200">
      Settings
    </button>
  </div>
);

export default HeaderMain;
