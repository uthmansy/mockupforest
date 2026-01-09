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
  useState,
} from "react";
import { MockupSceneProps } from "@/components/MockupEditor/types";
import { DesignLayer } from "./DesignLayer";
import BaseLayer from "./BaseLayer";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { ColorLayer } from "./ColorLayer";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";
import { useTextures } from "@/app/hooks/useTextures";
import { BackgroundLayer } from "./BackgroundLayer";
import { Spinner } from "@heroui/react";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
  BrightnessContrast,
} from "@react-three/postprocessing";

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

  // -------------------------------------------------
  // SIMPLE ZOOM STATE  (scales the wrapper div)
  // -------------------------------------------------
  const [zoom, setZoom] = useState(1);

  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(
      (z) => THREE.MathUtils.clamp(z - e.deltaY * 0.0015, 0.5, 3) // range 0.5 → 3
    );
  };

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
    if (!hasDesignLayers) return false;
    if (values.length === 0) return true;
    return values.some(Boolean);
  }, [designLoadings, designLayers]);

  const isAnyColorLoading = useMemo(() => {
    const values = Object.values(colorLoadings);
    const hasColorLayers = colorLayers.length > 0;
    if (!hasColorLayers) return false;
    if (values.length === 0) return true;
    return values.some(Boolean);
  }, [colorLoadings, colorLayers]);

  const { uv, base, setUvTexture, setBaseTexture } = useGlobalSettingsStore();
  const { uvTexture, baseTexture } = useTextures({ uv, base });

  useEffect(() => {
    if (uvTexture) setUvTexture(uvTexture);
    if (baseTexture) setBaseTexture(baseTexture);
  }, [uvTexture, baseTexture, setUvTexture, setBaseTexture]);

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

  useEffect(() => setGlRef(glRef), []);

  const renderedLayers = useMemo(() => {
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    return sortedLayers.map((layer) => {
      if (layer.type === "design") {
        return (
          <DesignLayer
            key={layer.id}
            id={layer.id}
            height={layer.height}
            width={layer.width}
            design={layer.design}
            mask={layer.mask}
            zIndex={layer.zIndex}
            croppedArea={layer.croppedAreaPixels}
            noiseAmount={layer.noiseThreshold}
            highlightIntensity={layer.highlightsIntensity}
            shadowIntensity={layer.shadowIntensity}
          />
        );
      }

      if (layer.type === "background") {
        return (
          <BackgroundLayer
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
    <div className="relative w-full h-full flex items-start md:items-center justify-center overflow-hidden p-6">
      {(baseAndUvLoading || isAnyDesignLoading || isAnyColorLoading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-xs z-50 bg-neutral-200">
          <Spinner color="primary" label="Loading..." variant="wave" />
        </div>
      )}

      {/* ZOOM WRAPPER  */}
      <div
        onWheel={handleWheelZoom} // ← zoom event
        className="relative flex items-center justify-center w-full max-w-md md:max-w-max md:w-auto overflow-hidden  h-auto md:h-[90%]"
        style={{
          aspectRatio,
          transform: `scale(${zoom})`, // ← apply zoom
          transformOrigin: "center center", // keep zoom centered
          transition: "transform 0.1s linear", // smooth zoom
        }}
      >
        <Canvas
          style={{ width: "100%", height: "100%", background: "#000000" }}
          dpr={1}
          gl={{
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            glRef.current = gl;
            gl.setSize(canvasWidth, canvasHeight, false);
          }}
          frameloop="demand"
        >
          <OrthographicCamera makeDefault {...cameraProps} />

          <BaseLayer height={canvasHeight} width={canvasWidth} src={base} />

          {renderedLayers}
        </Canvas>
      </div>
    </div>
  );
};
