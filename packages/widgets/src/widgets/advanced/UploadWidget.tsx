import { Field } from "@origami/core";
import { AvatarUpload, DocumentUpload, FileUpload } from "@origami/form-ui";
import React from "react";

interface WidgetProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const UploadWidget: React.FC<WidgetProps> = ({ field, value, onChange, error }) => {
  const safeValue = value === undefined || value === null ? "" : value;
  const lowerId = field.id.toLowerCase();

  // 1. Avatar Upload Style
  if (lowerId.includes("avatar") || lowerId.includes("photo")) {
    return (
      <div>
        <AvatarUpload value={safeValue} onChange={onChange} disabled={field.disabled} />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }

  // 2. Contract/Document Upload Style
  if (lowerId.includes("contract") || lowerId.includes("doc") || lowerId.includes("file")) {
    return (
      <div className="space-y-1">
        <DocumentUpload value={safeValue} onChange={onChange} disabled={field.disabled} />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  // 3. Default Upload Style
  return (
    <div className="space-y-2">
      <FileUpload
        value={safeValue}
        onChange={onChange}
        accept={field.accept}
        disabled={field.disabled}
        maxSize={field.maxFileSize ? field.maxFileSize / 1024 : undefined}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default UploadWidget;
