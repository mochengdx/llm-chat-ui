import React from "react";
import { cn } from "./base";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min?: number;
  max?: number;
  value?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, value = 0, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn("relative w-full h-6 flex items-center", props.disabled && "opacity-50", className)}>
        <div className="absolute w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
          <div className="h-full bg-indigo-600" style={{ width: `${percentage}%` }} />
        </div>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          value={value}
          className="absolute w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow pointer-events-none transition-all"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";
