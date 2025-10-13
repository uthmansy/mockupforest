// src/components/MockupEditor/Sidebar.tsx
"use client";

import React from "react";
import FileUpload from "./FileUpload";
import Picker from "./Picker";
import { useSidebarStore } from "@/app/stores/useSidebarStore";

export default function Sidebar() {
  const layers = useSidebarStore((state) => state.sidebarLayers);
  const handleClearAll = () => {};
  console.log("sidebar rendered");

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

          {/* <div className="mt-6 space-y-3">
            <button
              onClick={handleClearAll}
              className="w-full p-4 bg-secondary uppercase tracking-wider rounded-md hover:bg-secondary-bg hover:text-black cursor-pointer transition-all duration-75 text-sm"
            >
              Clear Design
            </button>
          </div> */}
        </div>
      </div>
    </aside>
  );
}
