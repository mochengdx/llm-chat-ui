import { Field } from "@origami/core";
import { Slider } from "@origami/form-ui";
import React from "react";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const SliderWidget: React.FC<WidgetProps> = ({ field, value, onChange }) => {
  return (
    <div className={`flex items-center gap-4 ${field.disabled ? "opacity-50" : ""}`}>
      <div className="flex-1">
        <Slider
          min={field.minimum || 0}
          max={field.maximum || 100}
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={field.disabled}
        />
      </div>
      <span className="text-sm font-mono font-medium text-gray-600 min-w-[30px] text-right">{value || 0}</span>
    </div>
  );
};

export default SliderWidget;
