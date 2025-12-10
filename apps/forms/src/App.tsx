import { parseSchemaToFields } from "@origami/core";
import { FormBuilder } from "@origami/form-builder";
import { FormRunner } from "@origami/form-runner";
import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState<"edit" | "run">("edit");
  const [schema, setSchema] = useState<any>(null);

  const handlePublish = (newSchema: any) => {
    console.log("Published Schema:", newSchema);
    setSchema(newSchema);
    setMode("run");
  };

  const handleBack = () => {
    setMode("edit");
  };

  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden">
      {mode === "edit" ? (
        <FormBuilder onPublish={handlePublish} />
      ) : (
        <div className="h-full flex flex-col">
          <div className="p-4 bg-white border-b flex justify-between items-center">
            <h1 className="text-lg font-bold">Form Preview</h1>
            <button onClick={handleBack} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              Back to Editor
            </button>
          </div>
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
              {schema ? (
                <FormRunner
                  fields={parseSchemaToFields(schema)}
                  onSubmit={(data) => console.log("Form Submitted:", data)}
                />
              ) : (
                <div className="text-center text-gray-500">No schema to display</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
