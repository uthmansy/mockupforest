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
      <div className="space-y-6">
        <div>
          <div className="mb-6">
            {layers.map((layer) => {
              return layer.type === "design" ? (
                <FileUpload
                  key={layer.id}
                  layerId={layer.id}
                  label="Your Design"
                />
              ) : (
                <Picker key={layer.id} layerId={layer.id} />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
