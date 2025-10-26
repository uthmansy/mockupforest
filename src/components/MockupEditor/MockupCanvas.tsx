"use client";

import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { MockupSceneProps } from "@/components/MockupEditor/types";
import { DesignLayer } from "./DesignLayer";
import BaseLayer from "./BaseLayer";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ColorLayer } from "./ColorLayer";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";
import { useTextures } from "@/app/hooks/useTextures";

export interface MockupCanvasProps extends MockupSceneProps {
  canvasWidth?: number;
  canvasHeight?: number;
  setGlRef: Dispatch<
    SetStateAction<RefObject<THREE.WebGLRenderer | null> | undefined>
  >;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  canvasWidth = 2000,
  canvasHeight = 1500,
  setGlRef,
}) => {
  const glRef = useRef<THREE.WebGLRenderer>(null);
  const { layers, baseAndUvLoading, designLoadings, colorLoadings } =
    useLayersStore();
  const designLayers = useMemo(
    () => layers.filter((l) => l.type === "design"),
    [layers]
  );
  const colorLayers = useMemo(
    () => layers.filter((l) => l.type === "color"),
    [layers]
  );

  const isAnyDesignLoading = useMemo(() => {
    const values = Object.values(designLoadings);
    const hasDesignLayers = designLayers.length > 0;

    if (!hasDesignLayers) return false; // nothing to wait for
    if (values.length === 0) return true; // waiting for first registration
    return values.some(Boolean); // any still loading
  }, [designLoadings, designLayers]);

  const isAnyColorLoading = useMemo(() => {
    const values = Object.values(colorLoadings);
    const hasColorLayers = colorLayers.length > 0;

    if (!hasColorLayers) return false; // nothing to wait for
    if (values.length === 0) return true; // waiting for first registration
    return values.some(Boolean); // any still loading
  }, [colorLoadings, colorLayers]);

  const { uv, base, setUvTexture, setBaseTexture } = useGlobalSettingsStore();

  const { uvTexture, baseTexture } = useTextures({ uv, base });

  useEffect(() => {
    if (uvTexture) setUvTexture(uvTexture);
    if (baseTexture) setBaseTexture(baseTexture);
  }, [uvTexture, baseTexture, setUvTexture, setBaseTexture]);

  // Memoize these values to prevent unnecessary re-renders
  const aspectRatio = useMemo(
    () => `${canvasWidth} / ${canvasHeight}`,
    [canvasWidth, canvasHeight]
  );
  const cameraProps = useMemo(
    () => ({
      left: -canvasWidth / 2,
      right: canvasWidth / 2,
      top: canvasHeight / 2,
      bottom: -canvasHeight / 2,
      near: 0,
      far: 1000,
      position: [0, 0, 100] as [number, number, number],
    }),
    [canvasWidth, canvasHeight]
  );

  // Set glRef once on mount
  useEffect(() => {
    setGlRef(glRef);
  }, []); // Empty dependency array since glRef is stable

  // Memoize layers rendering
  const renderedLayers = useMemo(() => {
    // Sort layers by zIndex before mapping
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    return sortedLayers.map((layer) => {
      if (layer.type === "design") {
        return (
          <DesignLayer
            key={layer.id}
            id={layer.id}
            height={layer.height}
            width={layer.width}
            design={layer.design || null}
            mask={layer.mask}
            zIndex={layer.zIndex}
            croppedArea={layer.croppedAreaPixels}
            noiseAmount={layer.noiseThreshold}
            highlightIntensity={layer.highlightsIntensity}
            shadowIntensity={layer.shadowIntensity}
          />
        );
      }

      return (
        <ColorLayer
          key={layer.id}
          height={layer.height}
          width={layer.width}
          mask={layer.mask}
          zIndex={layer.zIndex}
          color={layer.color}
          noiseAmount={layer.noiseThreshold}
          id={layer.id}
          highlightIntensity={layer.highlightsIntensity}
          shadowIntensity={layer.shadowIntensity}
        />
      );
    });
  }, [layers]);

  return (
    <div className="relative w-full h-full flex items-start md:items-center justify-center overflow-hidden p-6 bg-neutral-800">
      {(baseAndUvLoading || isAnyDesignLoading || isAnyColorLoading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center  backdrop-blur-xs text-white z-50 bg-neutral-800">
          <AiOutlineLoading3Quarters className="animate-spin text-5xl mb-4" />
          <p className="text-sm uppercase tracking-wider">Loading..</p>
        </div>
      )}
      <div
        className="relative flex items-center justify-center w-full max-w-[800px] bg-gray-200 overflow-hidden shadow-md"
        style={{ aspectRatio }}
      >
        <Canvas
          style={{ width: "100%", height: "100%" }}
          dpr={1}
          gl={{
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: "high-performance", // Add this for better GPU performance
          }}
          onCreated={({ gl }) => {
            glRef.current = gl;
            gl.setSize(canvasWidth, canvasHeight, false);
          }}
          // Add performance optimizations
          frameloop="demand" // Only render when necessary
        >
          <OrthographicCamera makeDefault {...cameraProps} />

          <BaseLayer height={canvasHeight} width={canvasWidth} src={base} />

          {renderedLayers}
        </Canvas>
      </div>
    </div>
  );
};
