"use client";

import Sidebar from "./Sidebar";
import dynamic from "next/dynamic";
import { MockupCanvas } from "./MockupCanvas";
import MobileBar from "./MobileBar";
import { useState, useEffect, RefObject } from "react";
import * as THREE from "three";
import Download from "./Download";

export default function MockupEditor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [glRef, setGlRef] = useState<RefObject<THREE.WebGLRenderer | null>>();

  useEffect(() => {
    setIsMounted(true);
    setIsLargeScreen(window.matchMedia("(min-width: 768px)").matches);
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);

    const handleResize = () => {
      setIsLargeScreen(window.matchMedia("(min-width: 768px)").matches);
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render anything until mounted on client
  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-800">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-black overflow-hidden">
      {isLargeScreen && (
        <div className="w-72 min-w-80 h-full overflow-y-auto max-h-full bg-neutral-800 border-white/20 p-6 py-10 border-r-[0.5px] scrollbar-dark">
          <Sidebar />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="h-14 border-white/20 border-b bg-neutral-800 flex items-center justify-end">
          {glRef && <Download glRef={glRef} />}
        </div>
        <MockupCanvas
          setGlRef={setGlRef}
          canvasWidth={2000}
          canvasHeight={1500}
        />
      </div>

      {isMobile && (
        <div className="bg-neutral-700">
          <MobileBar />
        </div>
      )}
    </div>
  );
}
