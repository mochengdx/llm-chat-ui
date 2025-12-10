import { generateSchema, parseSchemaToFields, useBuilderStore } from "@origami/core";
import { FormRunner } from "@origami/form-runner";
import { ClipboardList, Code, FileJson, Import, Play, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import Sidebar from "./components/Sidebar";

interface FormBuilderProps {
  onPublish?: (schema: any) => void;
  initialSchema?: any;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onPublish, initialSchema }) => {
  const { fields, setFields, setSelectedFieldId } = useBuilderStore();
  const [showJson, setShowJson] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialSchema) {
      setFields(parseSchemaToFields(initialSchema));
    }
  }, [initialSchema, setFields]);

  useEffect(() => {
    if (showJson) {
      setJsonInput(JSON.stringify(generateSchema(fields), null, 2));
    }
  }, [showJson, fields]);

  const handleRestoreFromJson = () => {
    try {
      const parsedSchema = JSON.parse(jsonInput);
      if (!parsedSchema.properties) {
        alert("无效 Schema");
        return;
      }
      setFields(parseSchemaToFields(parsedSchema));
      setSelectedFieldId(null);
      alert("还原成功");
      setShowJson(false);
    } catch (e: any) {
      alert("JSON Error: " + e.message);
    }
  };

  const handlePublish = () => {
    setIsSaving(true);
    const schema = generateSchema(fields);
    onPublish?.(schema);
    setTimeout(() => setIsSaving(false), 1000);
  };

  if (isPreviewMode) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-indigo-900 text-white px-4 py-3 flex justify-between items-center shadow-md z-10">
          <span className="font-bold flex items-center gap-2">
            <Play size={18} /> 模拟预览中
          </span>
          <button
            onClick={() => setIsPreviewMode(false)}
            className="bg-white/20 hover:bg-white/30 text-xs px-3 py-1.5 rounded"
          >
            退出预览
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <FormRunner fields={fields} onSubmit={(data) => alert(JSON.stringify(data, null, 2))} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full relative">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-gray-100/80">
        <div className="h-14 bg-white border-b border-gray-200 flex justify-between items-center px-4 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all border ${showJson ? "bg-gray-800 border-gray-800 text-white" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
            >
              <Code size={14} /> {showJson ? "关闭编辑器" : "JSON"}
            </button>
            <button
              onClick={() => setIsPreviewMode(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all border bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-medium"
            >
              <Play size={14} fill="currentColor" /> 试运行
            </button>
          </div>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              "发布中..."
            ) : (
              <>
                <Save size={16} /> 发布表单
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <Canvas />

          {showJson && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col p-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileJson size={20} /> Schema JSON 编辑器
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(jsonInput)}
                    className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-600"
                  >
                    <ClipboardList size={14} /> 复制
                  </button>
                  <button
                    onClick={handleRestoreFromJson}
                    className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded shadow-sm"
                  >
                    <Import size={14} /> 应用更改
                  </button>
                </div>
              </div>
              <textarea
                className="flex-1 w-full border border-gray-300 rounded-lg p-4 font-mono text-sm bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <PropertiesPanel />
    </div>
  );
};

export default FormBuilder;
