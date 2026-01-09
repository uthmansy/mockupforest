"use client";
import { ContentType } from "@/app/dashboard/page";
import { Grid, FileText } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeContent: ContentType;
  setActiveContent: (content: ContentType) => void;
}

function Sidebar({ activeContent, setActiveContent }: SidebarProps) {
  const menuItems = [
    { icon: Grid, label: "Dashboard", key: "dashboard" as ContentType },
    { icon: FileText, label: "Projects", key: "projects" as ContentType },
  ];

  return (
    <div
      className={`w-64 bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col`}
    >
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveContent(item.key)}
            className={`flex items-center w-full p-4 cursor-pointer space-x-3.5 rounded-xl transition-colors ${
              activeContent === item.key
                ? "bg-primary text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
