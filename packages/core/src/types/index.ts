export interface Field {
  id: string;
  title: string;
  type: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  validationRegex?: string;
  errorMsg?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
  accept?: string;
  maxFileSize?: number;
  subFields?: Field[];
  customClass?: string;
  disabled?: boolean;
}

export interface Schema {
  type: string;
  title?: string;
  properties: Record<string, any>;
  required?: string[];
  uiOrder?: string[];
}
