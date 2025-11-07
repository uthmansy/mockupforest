"use client";

import Sidebar from "./Sidebar";
import { MockupCanvas } from "./MockupCanvas";
import MobileBar from "./MobileBar";
import { useState, useEffect, RefObject } from "react";
import * as THREE from "three";
import Download from "./Download";
import { Mockup } from "@/types/db";
import { Group, Layer, useLayersStore } from "@/app/stores/useLayersStore";
import { useSidebarStore } from "@/app/stores/useSidebarStore";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";
import { useAuthStore } from "@/app/stores/useAuthStore";
import SettingsPanel from "./SettingsPanel";
import Link from "next/link";
import Image from "next/image";
import AppHeader from "./AppHeader";

interface Props {
  mockupData?: Mockup;
}

export default function MockupEditor({ mockupData }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [glRef, setGlRef] = useState<RefObject<THREE.WebGLRenderer | null>>();
  const { setLayers, setGroups, layers } = useLayersStore();
  const { syncWithLayers } = useSidebarStore();
  const { updateGlobal, canvasHeight, canvasWidth } = useGlobalSettingsStore();

  const { loading, user, checkLoginStatus } = useAuthStore();

  useEffect(() => {
    const handleSession = async () => {
      await checkLoginStatus();
    };
    handleSession();
  }, []);

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

  useEffect(() => {
    setIsLoading(true);
    //@ts-ignore
    const data: { layers: Layer[]; global: GlobalSettings; groups: Group[] } =
      mockupData?.mockup_data;
    setLayers(
      data.layers.map((layer) => {
        // 🔒 Ensure crop is always valid
        const crop =
          layer.crop && !isNaN(layer.crop.x) && !isNaN(layer.crop.y)
            ? layer.crop
            : { x: 0, y: 0 };

        // 🔒 Ensure zoom is a valid number >= 0.1
        const zoom =
          layer.zoom && !isNaN(layer.zoom) && layer.zoom > 0 ? layer.zoom : 1;

        // 🔒 Ensure aspectRatio is valid (not 0, NaN, or Infinity)
        let aspectRatio = layer.aspectRatio;
        if (
          aspectRatio == null ||
          isNaN(aspectRatio) ||
          aspectRatio <= 0 ||
          !isFinite(aspectRatio)
        ) {
          // Fallback: use width/height if available, else 1
          aspectRatio =
            layer.width && layer.height ? layer.width / layer.height : 1;
        }

        return {
          ...layer,
          mask: `${mockupData?.source_url}/${layer.mask}`,
          design: `${mockupData?.source_url}/${layer.design}`,
          width: layer.width * 0.5,
          height: layer.height * 0.5,
          // crop,
          // zoom,
          // aspectRatio,
        };
      })
    );

    setGroups(data.groups);
    updateGlobal({
      ...data.global,
      uv: `${mockupData?.source_url}/${data.global?.uv}`,
      base: `${mockupData?.source_url}/${data.global?.base}`,
    });
    syncWithLayers(data.layers);
    setIsLoading(false);
  }, [mockupData]);

  // Don't render anything until mounted on client
  if (!isMounted || !mockupData || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-800">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!mockupData) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-800">
        <div className="text-white">Error Loading Assets</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {isLargeScreen && (
        <div className="md:w-60 xl:w-72 h-full overflow-y-auto max-h-full bg-neutral-900 border-white/20 border-r-[0.5px] scrollbar-dark">
          <Sidebar />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <AppHeader glRef={glRef} mockupData={mockupData} user={user} />
        <MockupCanvas
          setGlRef={setGlRef}
          canvasWidth={canvasWidth * 0.5 || 2000}
          canvasHeight={canvasHeight * 0.5 || 1500}
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
