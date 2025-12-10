import { Field, Schema } from "../types";

export const parseSchemaToFields = (schema: Schema): Field[] => {
  if (!schema || !schema.properties) return [];
  const properties = schema.properties;
  const requiredList = schema.required || [];

  return Object.keys(properties).map((key) => {
    const prop = properties[key];
    const isArray = prop.type === "array";

    let options = undefined;
    if (prop.enum) {
      options = prop.enum.map((val: string, i: number) => ({
        value: val,
        label: prop.enumNames && prop.enumNames[i] ? prop.enumNames[i] : val
      }));
    } else if (prop.items && prop.items.enum) {
      options = prop.items.enum.map((val: string, i: number) => ({
        value: val,
        label: prop.items.enumNames && prop.items.enumNames[i] ? prop.items.enumNames[i] : val
      }));
    }

    let subFields: Field[] = [];
    if (isArray && prop.items && prop.items.type === "object" && prop.items.properties) {
      subFields = parseSchemaToFields(prop.items);
    }

    return {
      id: key,
      title: prop.title || key,
      type:
        prop.uiWidget ||
        (isArray ? "array" : prop.type === "number" ? "number" : prop.type === "boolean" ? "switch" : "text"),
      description: prop.description || "",
      placeholder: prop.placeholder || "",
      required: requiredList.includes(key),
      options: options,
      minimum: prop.minimum,
      maximum: prop.maximum,
      minLength: prop.minLength,
      maxLength: prop.maxLength,
      validationRegex: prop.pattern,
      errorMsg: prop.errorMessage,
      accept: prop.accept,
      maxFileSize: prop.maxFileSize,
      subFields: subFields
    };
  });
};
