import { Field } from "@origami/core";
import { AlertCircle, Plus, X } from "lucide-react";
import React from "react";
import { WidgetFactory } from "../../WidgetFactory";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  path: string;
  errors: Record<string, string>;
}

const ArrayWidget: React.FC<WidgetProps> = ({ field, value, onChange, path, errors }) => {
  const items = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    if (field.disabled) return;
    const newItem: any = {};
    if (field.subFields) {
      field.subFields.forEach((sub) => {
        newItem[sub.id] = sub.type === "switch" ? false : sub.type === "number" ? 0 : "";
      });
    }
    onChange([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    if (field.disabled) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, subId: string, subValue: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [subId]: subValue };
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="border border-gray-200 rounded-lg bg-gray-50/50 relative group overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase">Item {idx + 1}</span>
            <button
              onClick={() => handleRemove(idx)}
              className={`text-gray-400 hover:text-red-500 transition-colors ${field.disabled ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={field.disabled}
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {field.subFields &&
              field.subFields.map((sub) => (
                <div key={sub.id}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {sub.title} {sub.required && <span className="text-red-400">*</span>}
                  </label>
                  <WidgetFactory
                    field={{ ...sub, disabled: field.disabled || sub.disabled }}
                    value={item[sub.id]}
                    onChange={(subValue: any) => handleChange(idx, sub.id, subValue)}
                    path={`${path}.${idx}.${sub.id}`}
                    errors={errors}
                  />
                  {sub.description && <p className="text-[10px] text-gray-400 mt-1">{sub.description}</p>}
                  {errors[`${path}.${idx}.${sub.id}`] && (
                    <div className="flex items-center gap-1 text-[10px] text-red-500 animate-pulse font-medium mt-1">
                      <AlertCircle size={10} /> {errors[`${path}.${idx}.${sub.id}`]}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        disabled={field.disabled}
        className={`w-full flex items-center justify-center gap-2 text-sm text-indigo-600 font-medium px-4 py-3 border border-dashed border-indigo-300 rounded-lg transition-colors ${field.disabled ? "cursor-not-allowed opacity-50 bg-gray-50" : "hover:bg-indigo-50"}`}
      >
        <Plus size={16} /> 添加一项
      </button>
    </div>
  );
};

export default ArrayWidget;
