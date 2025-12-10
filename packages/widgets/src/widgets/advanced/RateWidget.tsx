import { Field } from "@origami/core";
import { Rate } from "@origami/form-ui";
import React from "react";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
}

const RateWidget: React.FC<WidgetProps> = ({ field, value, onChange }) => {
  return <Rate value={value} onChange={onChange} disabled={field.disabled} />;
};

export default RateWidget;
