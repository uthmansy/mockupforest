"use client";
import React, { RefObject, useState } from "react";
import { GrDownload } from "react-icons/gr";
import * as THREE from "three";

interface Props {
  glRef: RefObject<THREE.WebGLRenderer | null>;
}

function Download({ glRef }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = () => {
    if (!glRef.current) return;
    setIsExporting(true);
    setTimeout(() => {
      try {
        const link = document.createElement("a");
        link.download = "mockup.png";
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
      className="w-14 h-14 flex items-center justify-center bg-white"
      style={{
        cursor: isExporting ? "not-allowed" : "pointer",
      }}
    >
      {isExporting ? "Exporting..." : <GrDownload className="text-lg" />}
    </button>
  );
}

export default Download;
