import React from "react";
import { cn } from "./base";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ className, label, ...props }, ref) => {
  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer group",
        props.disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <input type="radio" ref={ref} className="peer sr-only" {...props} />
        <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all" />
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
      <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{label}</span>
    </label>
  );
});
Radio.displayName = "Radio";
