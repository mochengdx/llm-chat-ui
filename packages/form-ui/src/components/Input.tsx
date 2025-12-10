import React from "react";
import { cn } from "./base";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all",
        error ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300",
        "disabled:bg-gray-100 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
