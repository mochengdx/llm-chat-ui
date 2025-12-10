import { Star } from "lucide-react";
import React from "react";
import { cn } from "./base";

export interface RateProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export const Rate: React.FC<RateProps> = ({ value = 0, onChange, max = 5, disabled, className }) => {
  return (
    <div className={cn("flex gap-1", disabled && "opacity-50 cursor-not-allowed", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => !disabled && onChange?.(starValue)}
            disabled={disabled}
            className={cn(
              "transition-transform hover:scale-110 focus:outline-none",
              disabled && "cursor-not-allowed hover:scale-100"
            )}
          >
            <Star
              size={24}
              className={cn(
                "transition-colors",
                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
