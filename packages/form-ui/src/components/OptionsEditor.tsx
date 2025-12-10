import { Plus, X } from "lucide-react";
import React from "react";
import { Button } from "./base";
import { Input } from "./Input";

export const OptionsEditor = ({
  options,
  onChange
}: {
  options?: { label: string; value: string }[];
  onChange: (opts: any[]) => void;
}) => {
  const addOption = () => {
    onChange([...(options || []), { label: "新选项", value: `opt_${Date.now()}` }]);
  };
  const updateOption = (idx: number, key: string, val: string) => {
    const newOpts = [...(options || [])];
    (newOpts[idx] as any)[key] = val;
    onChange(newOpts);
  };
  const removeOption = (idx: number) => {
    onChange((options || []).filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-gray-50 rounded border border-gray-200 p-2 space-y-2">
      <div className="flex text-[10px] text-gray-400 font-medium px-1">
        <span className="flex-[1.5]">显示文字</span>
        <span className="flex-1 ml-2">实际值</span>
        <span className="w-5"></span>
      </div>
      {(options || []).map((opt, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <Input
            className="flex-[1.5] h-7 text-xs"
            value={opt.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(idx, "label", e.target.value)}
          />
          <Input
            className="flex-1 h-7 text-xs font-mono text-gray-600"
            value={opt.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(idx, "value", e.target.value)}
          />
          <button onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500">
            <X size={14} />
          </button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addOption}
        className="w-full border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 h-8"
      >
        <Plus size={12} className="mr-1" /> 添加选项
      </Button>
    </div>
  );
};
