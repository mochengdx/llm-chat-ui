export const en = {
  common: {
    settings: "Settings",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    copy: "Copy",
    speak: "Speak",
    stopSpeaking: "Stop Speaking",
    regenerate: "Regenerate",
    location: "Shanghai, China", // Or generic "Location"
    update: "Update",
    you: "You",
    modelName: "Simple LLM Chat",
    editMessage: "Edit Message",
    mention: "Mention",
    tag: "Tag",
    openCanvas: "Open Canvas",
    copyCode: "Copy Code"
  },
  sidebar: {
    newChat: "New Chat",
    recent: "Recent",
    help: "Help",
    activity: "Activity"
  },
  input: {
    placeholder: "Ask Simple LLM Chat...",
    fullScreen: "Full screen edit",
    uploadFiles: "Upload files",
    addFromDrive: "Add from Drive",
    photos: "Photos",
    importCode: "Import code",
    tools: "Tools",
    createVideos: "Create videos",
    chooseModel: "Choose your model"
  },
  artifact: {
    code: "Artifact Code",
    run: "Run Code"
  },
  chat: {
    hello: "Hello, Human",
    howCanIHelp: "How can I help you today?",
    newChat: "New Chat",
    inputPlaceholder: "Type a message...",
    thinking: "Thinking...",
    thinkingProcess: "Thinking Process",
    showThought: "Show thought process",
    hideThought: "Hide thought process",
    error: "Sorry, I encountered an error. Please try again.",
    chips: {
      createImage: "Create Image",
      write: "Write",
      build: "Build",
      deepResearch: "Deep Research",
      createVideo: "Create Video",
      learn: "Learn"
    },
    booth: {
      title: "3D Viewer",
      loading: "LOADING MODEL...",
      modelName: "Exhibition Booth Model",
      source: "Model Source: Generated",
      webgl: "WebGL 2.0 Enabled",
      size: "1.2MB • GLB"
    }
  },
  settings: {
    general: "General",
    features: "Features",
    interface: "Interface",
    language: "Language",
    theme: "Theme",
    usageMode: "Usage Mode",
    modes: {
      general: { label: "General", desc: "Standard experience" },
      developer: { label: "Developer", desc: "Code & Tools focused" },
      creative: { label: "Creative", desc: "Minimalist interface" }
    },
    featuresTab: {
      title: "Capabilities",
      thinking: {
        title: "Thinking Process",
        desc: "Show internal reasoning steps"
      },
      tools: {
        title: "Advanced Tools",
        desc: "Enable Deep Research, Python exec, etc"
      }
    },
    interfaceTab: {
      title: "Theme & Layout",
      theme: {
        title: "Dark Mode",
        desc: "Toggle theme"
      },
      density: {
        title: "Compact Density",
        desc: "Reduce spacing"
      }
    }
  }
};

export type Translations = typeof en;
