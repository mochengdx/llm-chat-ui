import { Field } from "../types";

export const validateFormStructure = (fields: Field[]): string[] => {
  const errors: string[] = [];
  const topLevelIds = new Set<string>();
  fields.forEach((field, index) => {
    if (!field.id || !field.id.trim()) errors.push(`第 ${index + 1} 个组件 Key 不能为空`);
    else if (topLevelIds.has(field.id)) errors.push(`重复 Key: "${field.id}"`);
    else topLevelIds.add(field.id);

    if (field.type === "array" && field.subFields) {
      const subIds = new Set<string>();
      field.subFields.forEach((sub, subIdx) => {
        if (!sub.id || !sub.id.trim()) errors.push(`"${field.title}" 的子项 Key 不能为空`);
        else if (subIds.has(sub.id)) errors.push(`"${field.title}" 内部重复 Key: "${sub.id}"`);
        else subIds.add(sub.id);
      });
    }
  });
  return errors;
};
