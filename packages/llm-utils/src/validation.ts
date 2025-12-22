import type { SendContext, SendValidator } from "@llm/core";

export const defaultSendValidators: SendValidator[] = [
  // 1. Must have content (text or attachments)
  (ctx) => ctx.input.trim().length > 0 || ctx.attachments.length > 0,
  // 2. No attachments should be uploading
  (ctx) => !ctx.attachments.some((a) => a.status === "uploading")
];

export function validateSend(context: SendContext, validators: SendValidator[] = defaultSendValidators): boolean {
  return validators.every((validator) => validator(context));
}
