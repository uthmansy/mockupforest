// src/components/MockupEditor/Sidebar.tsx
"use client";

import React from "react";
import FileUpload from "./FileUpload";
import Picker from "./Picker";
import { useSidebarStore } from "@/app/stores/useSidebarStore";

export default function Sidebar() {
  const layers = useSidebarStore((state) => state.sidebarLayers);

  return (
    <aside className="w-full  text-white">
      {layers.map((layer) => {
        return layer.type === "design" ? (
          <div key={layer.id} className="border-b border-white/10 p-3">
            <FileUpload layerId={layer.id} label="Your Design" />
          </div>
        ) : (
          <div key={layer.id} className="border-b border-white/10 p-3">
            <Picker layerId={layer.id} />
          </div>
        );
      })}
    </aside>
  );
}
