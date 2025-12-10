import { Field } from "@origami/core";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { FormRunner } from "./FormRunner";

// Sample schema for demonstration
const SAMPLE_FIELDS: Field[] = [
  {
    id: "name",
    type: "text",
    title: "姓名",
    required: true,
    placeholder: "请输入姓名"
  },
  {
    id: "age",
    type: "number",
    title: "年龄",
    required: true
  },
  {
    id: "gender",
    type: "radio",
    title: "性别",
    options: [
      { label: "男", value: "male" },
      { label: "女", value: "female" }
    ]
  },
  {
    id: "avatar",
    type: "upload",
    title: "头像",
    description: "请上传您的头像"
  },
  {
    id: "contract",
    type: "upload",
    title: "合同文件",
    description: "请上传相关合同文件 (PDF/Word)"
  }
];

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Form Data:", data);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-md w-full">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">提交成功</h2>
          <p className="text-gray-500 mt-2 text-center">您的信息已成功提交，感谢您的配合。</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            再次填写
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 px-8 py-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">信息收集表</h1>
            <p className="text-indigo-100 mt-2 text-sm opacity-90">请仔细填写以下信息</p>
          </div>
        </div>
        <FormRunner fields={SAMPLE_FIELDS} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
