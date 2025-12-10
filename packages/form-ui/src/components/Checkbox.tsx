import { CheckSquare } from "lucide-react";
import React from "react";
import { cn } from "./base";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, ...props }, ref) => {
    return (
      <label
        className={cn(
          "flex items-center gap-2 cursor-pointer group",
          props.disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <input type="checkbox" ref={ref} className="peer sr-only" checked={checked} onChange={onChange} {...props} />
          <div
            className={cn(
              "w-4 h-4 border-2 rounded transition-all flex items-center justify-center",
              checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white group-hover:border-indigo-400"
            )}
          >
            {checked && <CheckSquare size={10} className="text-white" />}
          </div>
        </div>
        <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
