import { Field } from "@origami/core";
import React from "react";
import DateWidget from "./widgets/advanced/DateWidget";
import RateWidget from "./widgets/advanced/RateWidget";
import SliderWidget from "./widgets/advanced/SliderWidget";
import UploadWidget from "./widgets/advanced/UploadWidget";
import CheckboxWidget from "./widgets/base/CheckboxWidget";
import { RadioWidget } from "./widgets/base/RadioWidget";
import SelectWidget from "./widgets/base/SelectWidget";
import SwitchWidget from "./widgets/base/SwitchWidget";
import TextAreaWidget from "./widgets/base/TextAreaWidget";
import TextWidget from "./widgets/base/TextWidget";
import ArrayWidget from "./widgets/layout/ArrayWidget";

// Placeholder for other widgets
const PlaceholderWidget = ({ field }: { field: Field }) => (
  <div className="p-2 border border-gray-200 rounded text-gray-400 text-sm">
    Widget type "{field.type}" not implemented yet.
  </div>
);

const WIDGET_MAP: Record<string, React.FC<any>> = {
  text: TextWidget,
  number: TextWidget, // Reuse TextWidget for number
  textarea: TextAreaWidget,
  select: SelectWidget,
  radio: RadioWidget,
  checkbox: CheckboxWidget,
  switch: SwitchWidget,
  date: DateWidget,
  slider: SliderWidget,
  rate: RateWidget,
  upload: UploadWidget,
  array: ArrayWidget
};

interface WidgetFactoryProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  path: string;
  errors: Record<string, string>;
}

export const WidgetFactory: React.FC<WidgetFactoryProps> = ({ field, value, onChange, path, errors }) => {
  const Component = WIDGET_MAP[field.type] || PlaceholderWidget;
  const error = errors[path];

  return (
    <div className={`widget-wrapper ${field.customClass || ""}`}>
      <Component field={field} value={value} onChange={onChange} error={error} path={path} errors={errors} />
    </div>
  );
};
