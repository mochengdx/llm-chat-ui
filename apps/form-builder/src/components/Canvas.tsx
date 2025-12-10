import { Field, useBuilderStore } from "@origami/core";
import { Plus, Star, Trash2, Upload } from "lucide-react";
import React from "react";

const Canvas: React.FC = () => {
  const { fields, selectedFieldId, setSelectedFieldId, removeField, setEditingSubFieldId } = useBuilderStore();

  const handleSelect = (id: string) => {
    setSelectedFieldId(id);
    setEditingSubFieldId(null);
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeField(id);
  };

  const renderPreviewComponent = (field: Field) => {
    const commonClass = "w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-400";
    const renderOptions = (opts: any[]) => (
      <div className="flex flex-wrap gap-2">
        {(opts || []).map((o) => (
          <span key={o.value} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
            {o.label}
          </span>
        ))}
      </div>
    );

    if (field.type === "array") {
      return (
        <div className="border border-dashed border-indigo-200 bg-indigo-50/30 rounded p-3 space-y-2">
          {field.subFields && field.subFields.length > 0 ? (
            <div className="grid gap-2">
              {field.subFields.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 bg-white px-2 py-2 rounded border border-gray-100 shadow-sm"
                >
                  <span className="text-[10px] text-white bg-gray-400 px-1 rounded uppercase w-8 text-center">
                    {sub.type.slice(0, 3)}
                  </span>
                  <span className="text-xs text-gray-700 flex-1">{sub.title}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{sub.id}</span>
                </div>
              ))}
              <div className="text-xs text-indigo-500 text-center mt-2 border-t border-dashed border-indigo-200 pt-2 flex items-center justify-center gap-1">
                <Plus size={12} /> 点击“添加一项”将重复上述结构
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400 text-center italic py-2">请在右侧配置列表包含的字段</div>
          )}
        </div>
      );
    }

    switch (field.type) {
      case "textarea":
        return <div className={`${commonClass} h-20`}>{field.placeholder}</div>;
      case "select":
        return (
          <div className={`${commonClass} flex justify-between`}>
            <span>请选择...</span>
            <span>▼</span>
          </div>
        );
      case "radio":
        return <div className="mt-1">{renderOptions(field.options || [])}</div>;
      case "checkbox":
        return <div className="mt-1">{renderOptions(field.options || [])}</div>;
      case "switch":
        return (
          <div className="w-10 h-5 bg-gray-200 rounded-full relative">
            <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1 shadow"></div>
          </div>
        );
      case "slider":
        return (
          <div className="w-full h-2 bg-gray-200 rounded relative mt-2">
            <div className="w-1/3 h-full bg-indigo-300 rounded"></div>
            <div className="w-4 h-4 bg-white border border-gray-300 rounded-full absolute top-[-4px] left-1/3 shadow"></div>
          </div>
        );
      case "rate":
        return (
          <div className="flex gap-1 text-gray-300">
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} />
            <Star size={16} />
          </div>
        );
      case "upload":
        return (
          <div className={`${commonClass} flex items-center gap-2 text-gray-400`}>
            <Upload size={14} /> 点击上传文件
          </div>
        );
      default:
        return <div className={commonClass}>{field.placeholder || "输入框占位符"}</div>;
    }
  };

  return (
    <div className="flex-1 bg-gray-100/80 p-8 overflow-y-auto flex justify-center" onClick={() => handleSelect("")}>
      <div className="w-full max-w-2xl bg-white min-h-[800px] shadow-sm rounded-lg flex flex-col">
        <div className="h-12 border-b border-gray-100 flex items-center px-6 bg-gray-50/30 rounded-t-lg">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          </div>
          <div className="ml-4 text-xs text-gray-400 font-medium">New Form</div>
        </div>

        <div className="flex-1 p-8 space-y-4">
          {fields.length === 0 && (
            <div className="h-64 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-3">
              <Plus size={32} className="text-gray-300" />
              <p className="text-sm">点击左侧组件添加到此处</p>
            </div>
          )}

          {fields.map((field) => (
            <div
              key={field.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(field.id);
              }}
              className={`
                relative group rounded-lg border-2 transition-all cursor-pointer p-4
                ${selectedFieldId === field.id ? "border-indigo-500 bg-indigo-50/10 ring-4 ring-indigo-500/10" : "border-transparent hover:border-indigo-200 hover:bg-gray-50"}
              `}
            >
              <div className="mb-2 flex justify-between items-start">
                <label className="text-sm font-bold text-gray-700 select-none">
                  {field.title}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {selectedFieldId === field.id && (
                  <button
                    onClick={(e) => handleRemove(e, field.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {renderPreviewComponent(field)}

              {field.description && <p className="text-xs text-gray-400 mt-1.5">{field.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
