import React from "react";
import { cn } from "./base";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled, className }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      className={cn(
        "w-12 h-6 rounded-full transition-colors relative",
        checked ? "bg-indigo-600" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div
        className={cn(
          "w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all",
          checked ? "left-7" : "left-1"
        )}
      />
    </button>
  );
};
