import React from "react";

const LayoutMain: React.FC<{
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ sidebar, header, main, footer }) => (
  <div className="flex h-screen w-full bg-white text-gray-900">
    <aside className="w-64 border-r bg-gray-50 h-full flex-shrink-0 hidden md:block">{sidebar}</aside>
    <div className="flex-1 flex flex-col h-full">
      <header className="border-b p-4 flex items-center justify-between bg-white sticky top-0 z-10">{header}</header>
      <main className="flex-1 overflow-y-auto p-4 bg-white">{main}</main>
      {footer && <footer className="border-t p-4 bg-white">{footer}</footer>}
    </div>
  </div>
);

export default LayoutMain;
