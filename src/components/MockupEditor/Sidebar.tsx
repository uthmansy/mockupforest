// src/components/MockupEditor/Sidebar.tsx
"use client";

import React, { useState } from "react";
import { ChangeEvent } from "react";
import { SidebarProps } from "./types";
import { useLayersStore } from "@/app/stores/useLayersStore";

// ✅ Define FileUpload INSIDE this file
interface FileUploadProps {
  label: string;
  accept?: string;
  layerId: number;
}

function FileUpload({ label, accept = "image/*", layerId }: FileUploadProps) {
  const { updateLayer } = useLayersStore();
  const createFileHandler =
    (
      onResult: (result: {
        file: File | null;
        src: string | null;
        preview: string | null;
      }) => void
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      if (!file) {
        onResult({ file: null, src: null, preview: null });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        onResult({ file, src, preview: src });
      };
      reader.onerror = () => {
        console.error("Error reading file");
        onResult({ file: null, src: null, preview: null });
      };
      reader.readAsDataURL(file);
    };

  return (
    <div className="mb-4">
      {/* <label className="block text-sm font-medium mb-2">{label}</label> */}
      <input
        type="file"
        accept={accept}
        onChange={createFileHandler((result) => {
          console.log("File upload result for layer:", layerId, result);
          // TODO: update your Zustand store with the uploaded file here
          updateLayer(layerId, { design: result.src });
        })}
        className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 transition-all duration-75 cursor-pointer rounded-md text-sm text-white/50"
      />
    </div>
  );
}

export default function Sidebar() {
  const layers = useLayersStore((state) => state.layers);

  const handleClearAll = () => {};

  return (
    <aside className="w-full border-r-[0.5px] border-white/20 p-6 py-20 overflow-y-auto bg-black h-full text-white">
      <div className="space-y-6">
        <div>
          <div className="mb-6">
            {layers.map((layer) => (
              <FileUpload
                key={layer.id}
                layerId={layer.id}
                label="Your Design"
              />
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleClearAll}
              className="w-full p-4 bg-secondary uppercase tracking-wider rounded-md hover:bg-secondary-bg hover:text-black cursor-pointer transition-all duration-75 text-sm"
            >
              Clear Design
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
