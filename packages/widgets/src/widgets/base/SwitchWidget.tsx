import { Field } from "@origami/core";
import { Switch } from "@origami/form-ui";
import React from "react";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
}

const SwitchWidget: React.FC<WidgetProps> = ({ field, value, onChange }) => {
  return <Switch checked={!!value} onChange={onChange} disabled={field.disabled} />;
};

export default SwitchWidget;
