"use client";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";
import React, { RefObject, useState } from "react";
import { GrDownload } from "react-icons/gr";
import * as THREE from "three";

interface Props {
  glRef: RefObject<THREE.WebGLRenderer | null>;
}

function Download({ glRef }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const global = useGlobalSettingsStore();

  const handleDownload = () => {
    if (!glRef.current) return;
    setIsExporting(true);
    setTimeout(() => {
      try {
        const link = document.createElement("a");
        link.download = `${global.name}.png`;
        link.href = glRef.current!.domElement.toDataURL("image/png");
        link.click();
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isExporting}
      className="bg-secondary-bg rounded-md px-5 py-2 uppercase text-sm"
      style={{
        cursor: isExporting ? "not-allowed" : "pointer",
      }}
    >
      {isExporting ? "Exporting..." : "Export"}
    </button>
  );
}

export default Download;
