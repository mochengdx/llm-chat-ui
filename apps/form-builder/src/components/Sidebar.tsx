import { Field, useBuilderStore } from "@origami/core";
import { Calendar, CheckSquare, CircleDot, Hash, List, Sliders, Star, ToggleLeft, Type, Upload } from "lucide-react";
import React from "react";

const COMPONENT_TYPES = [
  { type: "text", label: "单行文本", icon: <Type size={16} />, group: "basic" },
  { type: "textarea", label: "多行文本", icon: "¶", group: "basic" },
  { type: "number", label: "数字输入", icon: <Hash size={16} />, group: "basic" },
  { type: "select", label: "下拉选择", icon: "▼", group: "select" },
  { type: "radio", label: "单选框", icon: <CircleDot size={16} />, group: "select" },
  { type: "checkbox", label: "多选框", icon: <CheckSquare size={16} />, group: "select" },
  { type: "switch", label: "开关", icon: <ToggleLeft size={16} />, group: "select" },
  { type: "date", label: "日期时间", icon: <Calendar size={16} />, group: "advanced" },
  { type: "slider", label: "滑块", icon: <Sliders size={16} />, group: "advanced" },
  { type: "rate", label: "评分", icon: <Star size={16} />, group: "advanced" },
  { type: "upload", label: "文件/图片", icon: <Upload size={16} />, group: "advanced" },
  { type: "array", label: "对象列表", icon: <List size={16} />, group: "layout" }
];

const Sidebar: React.FC = () => {
  const { addField } = useBuilderStore();

  const handleAddField = (type: string) => {
    const newField: Field = {
      id: `field_${Date.now()}`,
      type,
      title: `未命名${COMPONENT_TYPES.find((c) => c.type === type)?.label}`,
      required: false,
      options: ["select", "radio", "checkbox"].includes(type) ? [{ label: "A", value: "a" }] : undefined,
      subFields: []
    };
    addField(newField);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">组件库</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {["basic", "select", "advanced", "layout"].map((group) => (
          <div key={group}>
            <div className="text-[10px] font-semibold text-gray-400 mb-2 uppercase px-1">{group}</div>
            <div className="grid grid-cols-2 gap-2">
              {COMPONENT_TYPES.filter((c) => c.group === group).map((comp) => (
                <button
                  key={comp.type}
                  onClick={() => handleAddField(comp.type)}
                  className="flex flex-col items-center justify-center p-3 border border-gray-100 bg-white rounded-lg hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group text-gray-600 hover:text-indigo-600"
                >
                  <span className="mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {typeof comp.icon === "string" ? (
                      <span className="text-base font-bold">{comp.icon}</span>
                    ) : (
                      comp.icon
                    )}
                  </span>
                  <span className="text-xs">{comp.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
