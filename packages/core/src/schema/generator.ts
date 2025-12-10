import { Field, Schema } from "../types";

export const generateSchema = (fields: Field[]): Schema => {
  const buildProperties = (fieldList: Field[]) => {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    fieldList.forEach((field) => {
      const base: any = { title: field.title };
      if (field.description) base.description = field.description;
      let typeSchema: any = {};
      if (field.type === "array") {
        const subProps = field.subFields ? buildProperties(field.subFields) : { properties: {}, required: [] };
        typeSchema = {
          type: "array",
          uiWidget: "array",
          items: { type: "object", properties: subProps.properties, required: subProps.required }
        };
      } else {
        typeSchema = {
          type: ["number", "slider", "rate"].includes(field.type)
            ? "number"
            : field.type === "switch"
              ? "boolean"
              : "string",
          uiWidget: field.type
        };
        if (field.placeholder) typeSchema.placeholder = field.placeholder;
        if (field.validationRegex) typeSchema.pattern = field.validationRegex;
        if (field.errorMsg) typeSchema.errorMessage = field.errorMsg;
        if (field.minLength) typeSchema.minLength = field.minLength;
        if (field.maxLength) typeSchema.maxLength = field.maxLength;
        if (field.minimum !== undefined) typeSchema.minimum = field.minimum;
        if (field.maximum !== undefined) typeSchema.maximum = field.maximum;

        // Upload constraints
        if (field.type === "upload") {
          typeSchema.accept = field.accept;
          typeSchema.maxFileSize = field.maxFileSize;
        }

        if (["select", "radio", "checkbox"].includes(field.type) && field.options) {
          typeSchema.enum = field.options.map((o) => o.value);
          typeSchema.enumNames = field.options.map((o) => o.label);
          if (field.type === "checkbox")
            typeSchema = {
              type: "array",
              items: { type: "string", enum: typeSchema.enum, enumNames: typeSchema.enumNames },
              uniqueItems: true
            };
        }
      }
      properties[field.id] = { ...base, ...typeSchema };
      if (field.required) required.push(field.id);
    });
    return { properties, required };
  };
  const { properties, required } = buildProperties(fields);
  return { type: "object", title: "GeneratedForm", properties, required };
};
