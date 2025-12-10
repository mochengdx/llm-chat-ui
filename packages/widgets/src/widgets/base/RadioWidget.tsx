import { Field } from "@origami/core";
import { Radio } from "@origami/form-ui";
import React from "react";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
}

export const RadioWidget: React.FC<WidgetProps> = ({ field, value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4 pt-1">
      {field.options &&
        field.options.map((opt) => (
          <Radio
            key={opt.value}
            label={opt.label}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            disabled={field.disabled}
          />
        ))}
    </div>
  );
};
