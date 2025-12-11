import type { Message } from "@llm/core";
import { Sparkles, User } from "lucide-react";
import { memo } from "react";

interface MessageAvatarProps {
  role: Message["role"];
  modelUsed?: string;
}

export const MessageAvatar = memo(({ role, modelUsed }: MessageAvatarProps) => {
  if (role === "model") {
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center">
        <Sparkles
          className={`animate-pulse ${
            modelUsed?.includes("Thinking") ? "text-blue-500 dark:text-blue-400" : "text-red-500 dark:text-red-400"
          }`}
          size={20}
        />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#3c4043] flex items-center justify-center">
      <User size={16} className="text-gray-600 dark:text-gray-300" />
    </div>
  );
});
