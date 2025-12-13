import { UserSettings } from "@llm/core";
import { en } from "../locales/en";
import { zhCN } from "../locales/zh-CN";

const translations = {
  en,
  "zh-CN": zhCN
};

export const useTranslation = (settings: UserSettings) => {
  const lang = settings.language || "en";
  const t = translations[lang];

  return { t, lang };
};
