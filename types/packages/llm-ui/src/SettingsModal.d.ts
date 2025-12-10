import type { UserSettings } from "@llm/core";
declare const SettingsModal: ({ isOpen, onClose, settings, updateSettings }: {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    updateSettings: (k: keyof UserSettings, v: any) => void;
}) => import("react/jsx-runtime").JSX.Element | null;
export default SettingsModal;
//# sourceMappingURL=SettingsModal.d.ts.map