import { Field } from "@origami/core";
import { Checkbox } from "@origami/form-ui";
import React from "react";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
}

const CheckboxWidget: React.FC<WidgetProps> = ({ field, value, onChange }) => {
  const currentVals = Array.isArray(value) ? value : [];

  const toggleCheck = (optVal: string) => {
    if (field.disabled) return;
    if (currentVals.includes(optVal)) {
      onChange(currentVals.filter((v: string) => v !== optVal));
    } else {
      onChange([...currentVals, optVal]);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 pt-1">
      {field.options &&
        field.options.map((opt) => (
          <Checkbox
            key={opt.value}
            label={opt.label}
            checked={currentVals.includes(opt.value)}
            onChange={() => toggleCheck(opt.value)}
            disabled={field.disabled}
          />
        ))}
    </div>
  );
};

export default CheckboxWidget;
