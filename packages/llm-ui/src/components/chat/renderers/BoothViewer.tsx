import { Box, Cuboid, Maximize, RotateCw, ZoomIn } from "lucide-react";
import React, { useState } from "react";
import { CodeBlockRendererProps } from "./types";

export const BoothViewer: React.FC<CodeBlockRendererProps> = ({ content, t }) => {
  // Assume content is a URL or a JSON config. For simplicity, let's treat it as a URL if it starts with http
  // otherwise treat it as a description.
  const isUrl = content.trim().startsWith("http");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-gray-900 border border-gray-700 shadow-lg relative group">
      {/* Header / Toolbar */}
      <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2 text-white/90">
          <Cuboid size={16} className="text-blue-400" />
          <span className="text-xs font-medium tracking-wide uppercase">{t?.chat.booth.title || "3D Viewer"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 transition-colors">
            <RotateCw size={14} />
          </button>
          <button className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 transition-colors">
            <ZoomIn size={14} />
          </button>
          <button className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 transition-colors">
            <Maximize size={14} />
          </button>
        </div>
      </div>

      {/* Main Viewport Area */}
      <div className="w-full h-64 md:h-80 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
        {/* Grid Background Effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            transform: "perspective(500px) rotateX(60deg) translateY(-100px) scale(2)"
          }}
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 text-blue-400">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono">{t?.chat.booth.loading || "LOADING MODEL..."}</span>
          </div>
        ) : (
          <div className="relative z-0 flex flex-col items-center animate-fade-in">
            {/* Placeholder 3D Object Representation */}
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-2 border-blue-500/30 rounded-lg transform rotate-45 animate-pulse" />
              <div className="absolute inset-2 border-2 border-purple-500/30 rounded-lg transform -rotate-12" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Box size={48} className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
            </div>

            <div className="mt-6 text-center px-4">
              <p className="text-sm font-medium text-gray-200">{t?.chat.booth.modelName || "Exhibition Booth Model"}</p>
              <p className="text-xs text-gray-500 mt-1 font-mono max-w-xs truncate">
                {isUrl ? content.trim() : t?.chat.booth.source || "Model Source: Generated"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-800/50 px-4 py-2 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
        <span>{t?.chat.booth.webgl || "WebGL 2.0 Enabled"}</span>
        <span>{t?.chat.booth.size || "1.2MB • GLB"}</span>
      </div>
    </div>
  );
};
