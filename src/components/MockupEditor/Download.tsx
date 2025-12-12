"use client";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";
import React, { RefObject, useState } from "react";
import { BsDownload } from "react-icons/bs";
import * as THREE from "three";
import { ImSpinner8 } from "react-icons/im";
import { Spinner } from "@heroui/react";

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
      className="h-[3rem] w-38 mx-0 flex items-center justify-center overflow-hidden bg-primary text-black uppercase text-sm"
      style={{
        cursor: isExporting ? "not-allowed" : "pointer",
      }}
    >
      {isExporting ? (
        <span className="flex space-x-3 items-center">
          {
            //@ts-ignore
            <Spinner color="black" size="sm" />
          }
          <span>Exporting...</span>
        </span>
      ) : (
        <span className="flex space-x-3 items-center">
          <BsDownload className="text-xl" /> <span>Export</span>
        </span>
      )}
    </button>
  );
}

export default Download;
