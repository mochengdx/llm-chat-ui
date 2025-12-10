import { Field, useRunnerStore } from "@origami/core";
import { WidgetFactory } from "@origami/widgets";
import { AlertCircle, Eye, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface FormRunnerProps {
  fields: Field[];
  initialValues?: Record<string, any>;
  onSubmit?: (data: any) => void;
}

export const FormRunner: React.FC<FormRunnerProps> = ({ fields, initialValues, onSubmit }) => {
  const { formData, errors, setFormData, updateField, validate } = useRunnerStore();
  const [showPreview, setShowPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState<"visual" | "json">("visual");

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    } else {
      // Initialize defaults
      const defaults: Record<string, any> = {};
      fields.forEach((f) => {
        if (f.type === "array") defaults[f.id] = [];
        else if (f.type === "checkbox") defaults[f.id] = [];
        else if (f.type === "switch") defaults[f.id] = false;
        else if (f.type === "number") defaults[f.id] = f.minimum || 0;
        else defaults[f.id] = "";
      });
      setFormData(defaults);
    }
  }, [fields, initialValues, setFormData]);

  const handleSubmit = () => {
    if (validate(fields)) {
      onSubmit?.(formData);
    } else {
      alert("请检查表单中的错误项");
    }
  };

  return (
    <div className="p-8 space-y-6">
      {fields.map((field) => (
        <div key={field.id} className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            {field.title} {field.required && <span className="text-red-500">*</span>}
          </label>
          <WidgetFactory
            field={field}
            value={formData[field.id]}
            onChange={(v) => updateField(field.id, v)}
            path={field.id}
            errors={errors}
          />
          {field.description && <p className="text-xs text-gray-400">{field.description}</p>}
          {errors[field.id] && (
            <div className="flex items-center gap-1 text-xs text-red-500 animate-pulse font-medium">
              <AlertCircle size={12} /> {errors[field.id]}
            </div>
          )}
        </div>
      ))}
      <div className="pt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="flex-1 py-3 text-lg bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Eye size={20} /> 数据预览
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 text-lg bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          确认提交
        </button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">填写内容确认</h3>
                <div className="flex bg-gray-100 rounded p-0.5">
                  <button
                    onClick={() => setPreviewTab("visual")}
                    className={`text-xs px-3 py-1 rounded transition-all ${previewTab === "visual" ? "bg-white shadow text-indigo-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    可视化
                  </button>
                  <button
                    onClick={() => setPreviewTab("json")}
                    className={`text-xs px-3 py-1 rounded transition-all ${previewTab === "json" ? "bg-white shadow text-indigo-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    JSON源
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50">
              {previewTab === "json" ? (
                <pre className="text-xs text-[#9cdcfe] font-mono p-6 leading-relaxed bg-[#1e1e1e] h-full">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              ) : (
                <div className="p-6 space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-400 mb-1">{field.title}</div>
                      <div className="text-sm text-gray-800 font-medium break-all">
                        {field.type === "array" ? (
                          <div className="space-y-2 mt-2">
                            {(formData[field.id] || []).map((item: any, i: number) => (
                              <div key={i} className="bg-gray-50 p-2 rounded border border-gray-100 text-xs">
                                <div className="font-bold text-gray-400 mb-1">Item {i + 1}</div>
                                {field.subFields?.map((sub: Field) => (
                                  <div key={sub.id} className="flex gap-2">
                                    <span className="text-gray-500">{sub.title}:</span>
                                    <span>{String(item[sub.id])}</span>
                                  </div>
                                ))}
                              </div>
                            ))}
                            {(formData[field.id] || []).length === 0 && (
                              <span className="text-gray-400 italic">无数据</span>
                            )}
                          </div>
                        ) : (
                          String(
                            formData[field.id] === undefined || formData[field.id] === "" ? "-" : formData[field.id]
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setShowPreview(false)}
              >
                返回修改
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                onClick={() => {
                  setShowPreview(false);
                  handleSubmit();
                }}
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
