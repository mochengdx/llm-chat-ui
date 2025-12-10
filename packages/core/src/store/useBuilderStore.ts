import { create } from "zustand";
import { Field } from "../types";

interface BuilderState {
  fields: Field[];
  selectedFieldId: string | null;
  editingSubFieldId: string | null;
  setFields: (fields: Field[]) => void;
  setSelectedFieldId: (id: string | null) => void;
  setEditingSubFieldId: (id: string | null) => void;
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  removeField: (id: string) => void;
  addSubField: (parentId: string, subField: Field) => void;
  updateSubField: (parentId: string, subId: string, updates: Partial<Field>) => void;
  removeSubField: (parentId: string, subId: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  fields: [],
  selectedFieldId: null,
  editingSubFieldId: null,
  setFields: (fields) => set({ fields }),
  setSelectedFieldId: (id) => set({ selectedFieldId: id }),
  setEditingSubFieldId: (id) => set({ editingSubFieldId: id }),
  addField: (field) =>
    set((state) => ({ fields: [...state.fields, field], selectedFieldId: field.id, editingSubFieldId: null })),
  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      selectedFieldId: updates.id && state.selectedFieldId === id ? updates.id : state.selectedFieldId
    })),
  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
      selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
      editingSubFieldId: state.editingSubFieldId // Reset if needed, but simple for now
    })),
  addSubField: (parentId, subField) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === parentId ? { ...f, subFields: [...(f.subFields || []), subField] } : f))
    })),
  updateSubField: (parentId, subId, updates) =>
    set((state) => ({
      fields: state.fields.map((f) => {
        if (f.id === parentId && f.subFields) {
          return {
            ...f,
            subFields: f.subFields.map((sf) => (sf.id === subId ? { ...sf, ...updates } : sf))
          };
        }
        return f;
      }),
      editingSubFieldId: updates.id && state.editingSubFieldId === subId ? updates.id : state.editingSubFieldId
    })),
  removeSubField: (parentId, subId) =>
    set((state) => ({
      fields: state.fields.map((f) => {
        if (f.id === parentId && f.subFields) {
          return { ...f, subFields: f.subFields.filter((sf) => sf.id !== subId) };
        }
        return f;
      }),
      editingSubFieldId: state.editingSubFieldId === subId ? null : state.editingSubFieldId
    }))
}));
