import { Field } from "@origami/core";
import { Input } from "@origami/form-ui";
import React from "react";

interface DateWidgetProps {
  field: Field;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const DateWidget: React.FC<DateWidgetProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {field.title}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        type="datetime-local"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.disabled}
        error={!!error}
      />
      {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
export default DateWidget;
