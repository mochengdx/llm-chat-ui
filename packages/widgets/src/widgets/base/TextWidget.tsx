import { Field } from "@origami/core";
import { Input } from "@origami/form-ui";
import React from "react";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const TextWidget: React.FC<WidgetProps> = ({ field, value, onChange, error }) => {
  const safeValue = value === undefined || value === null ? "" : value;
  return (
    <div className="relative">
      <Input
        type={field.type === "number" ? "number" : "text"}
        value={safeValue}
        onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
        disabled={field.disabled}
        error={!!error}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
      />
      {field.maxLength && (
        <span className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none bg-white px-1 rounded">
          {String(safeValue).length}/{field.maxLength}
        </span>
      )}
    </div>
  );
};

export default TextWidget;
