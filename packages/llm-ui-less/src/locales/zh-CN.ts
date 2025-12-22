import type { Translations } from "./en";

export const zhCN: Translations = {
  common: {
    settings: "设置",
    close: "关闭",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    copy: "复制",
    speak: "朗读",
    stopSpeaking: "停止朗读",
    regenerate: "重新生成",
    location: "中国，上海",
    update: "更新",
    you: "你",
    modelName: "Smart LLM Chat",
    editMessage: "编辑消息",
    mention: "提及",
    tag: "标签",
    openCanvas: "在画布中打开",
    copyCode: "复制代码"
  },
  sidebar: {
    newChat: "新对话",
    recent: "最近",
    help: "帮助",
    activity: "活动"
  },
  input: {
    placeholder: "向 Smart LLM Chat 提问...",
    fullScreen: "全屏编辑",
    uploadFiles: "上传文件",
    addFromDrive: "从云端硬盘添加",
    photos: "照片",
    importCode: "导入代码",
    tools: "工具",
    createVideos: "生成视频",
    chooseModel: "选择模型"
  },
  artifact: {
    code: "Artifact 代码",
    run: "运行代码"
  },
  chat: {
    hello: "你好，人类",
    howCanIHelp: "今天有什么可以帮你的吗？",
    newChat: "新对话",
    inputPlaceholder: "输入消息...",
    thinking: "思考中...",
    thinkingProcess: "思考过程",
    showThought: "查看思考过程",
    hideThought: "隐藏思考过程",
    error: "抱歉，我遇到了一些错误，请重试。",
    chips: {
      createImage: "生成图片",
      write: "写作",
      build: "构建",
      deepResearch: "深度研究",
      createVideo: "生成视频",
      learn: "学习"
    },
    booth: {
      title: "3D 预览",
      loading: "加载模型中...",
      modelName: "展台模型",
      source: "模型来源：生成",
      webgl: "已启用 WebGL 2.0",
      size: "1.2MB • GLB"
    }
  },
  settings: {
    general: "通用",
    features: "功能",
    interface: "界面",
    language: "语言",
    theme: "主题",
    usageMode: "使用模式",
    modes: {
      general: { label: "通用", desc: "标准体验" },
      developer: { label: "开发者", desc: "专注于代码和工具" },
      creative: { label: "创意", desc: "极简界面" }
    },
    featuresTab: {
      title: "功能能力",
      thinking: {
        title: "思考过程",
        desc: "显示内部推理步骤"
      },
      tools: {
        title: "高级工具",
        desc: "启用深度研究、Python执行等"
      }
    },
    interfaceTab: {
      title: "主题与布局",
      theme: {
        title: "深色模式",
        desc: "切换主题"
      },
      density: {
        title: "紧凑模式",
        desc: "减少间距"
      }
    }
  }
};
