import { Field } from "@origami/core";
import { Select } from "@origami/form-ui";
import React from "react";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const SelectWidget: React.FC<WidgetProps> = ({ field, value, onChange, error }) => {
  const safeValue = value === undefined || value === null ? "" : value;
  return (
    <div className="relative">
      <Select value={safeValue} onChange={(e) => onChange(e.target.value)} disabled={field.disabled} error={!!error}>
        <option value="">请选择...</option>
        {field.options &&
          field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </Select>
    </div>
  );
};

export default SelectWidget;
