import { create } from "zustand";
import { Field } from "../types";

interface RunnerState {
  formData: Record<string, any>;
  errors: Record<string, string>;
  setFormData: (data: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  updateField: (id: string, value: any) => void;
  validate: (fields: Field[]) => boolean;
}

export const useRunnerStore = create<RunnerState>((set, get) => ({
  formData: {},
  errors: {},
  setFormData: (data) => set({ formData: data }),
  setErrors: (errors) => set({ errors }),
  updateField: (id, value) =>
    set((state) => {
      const newFormData = { ...state.formData, [id]: value };
      const newErrors = { ...state.errors };
      if (newErrors[id]) {
        delete newErrors[id];
      }
      return { formData: newFormData, errors: newErrors };
    }),
  validate: (fields) => {
    const { formData } = get();
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const checkField = (field: Field, value: any, path: string) => {
      if (field.required) {
        const isEmpty =
          value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          newErrors[path] = "此项为必填项";
          isValid = false;
        }
      }
      if (field.minLength && value && value.length < field.minLength) {
        newErrors[path] = `至少输入 ${field.minLength} 个字符`;
        isValid = false;
      }
      if (value && field.validationRegex && !newErrors[path]) {
        try {
          if (!new RegExp(field.validationRegex).test(value)) {
            newErrors[path] = field.errorMsg || "格式不正确";
            isValid = false;
          }
        } catch (e) {}
      }
      if (value && field.validation?.pattern && !newErrors[path]) {
        try {
          if (!new RegExp(field.validation.pattern).test(value)) {
            newErrors[path] = field.validation.message || "格式不正确";
            isValid = false;
          }
        } catch (e) {}
      }
      if (field.type === "array" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (field.subFields) {
            field.subFields.forEach((sub) => {
              checkField(sub, item[sub.id], `${path}.${index}.${sub.id}`);
            });
          }
        });
      }
    };

    fields.forEach((field) => checkField(field, formData[field.id], field.id));
    set({ errors: newErrors });
    return isValid;
  }
}));
