"use client";

import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { MockupSceneProps } from "@/components/MockupEditor/types";
import { DesignLayer } from "./DesignLayer";
import BaseLayer from "./BaseLayer";
import Download from "./Download";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export interface MockupCanvasProps extends MockupSceneProps {
  canvasWidth?: number;
  canvasHeight?: number;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  canvasWidth = 4000,
  canvasHeight = 3000,
}) => {
  const glRef = useRef<THREE.WebGLRenderer>(null);

  const layers = useLayersStore((state) => state.layers);
  const loading = useLayersStore((state) => state.loading);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white z-50">
          <AiOutlineLoading3Quarters className="animate-spin text-5xl mb-4" />
          <p className="text-sm uppercase tracking-wider">Loading..</p>
        </div>
      )}
      <div
        className="relative flex items-center justify-center w-[90vw] max-w-[800px] bg-gray-200 overflow-hidden"
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
        }}
      >
        <Download glRef={glRef} />
        <Canvas
          style={{ width: "100%", height: "100%" }}
          dpr={1}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          onCreated={({ gl }) => {
            glRef.current = gl;
            gl.setSize(canvasWidth, canvasHeight, false);
          }}
        >
          <OrthographicCamera
            makeDefault
            left={-canvasWidth / 2}
            right={canvasWidth / 2}
            top={canvasHeight / 2}
            bottom={-canvasHeight / 2}
            near={0}
            far={1000}
            position={[0, 0, 100]}
          />

          <BaseLayer
            height={canvasHeight}
            width={canvasWidth}
            src="/editor/beauty.jpg"
          />

          {layers.map((layer) => (
            <DesignLayer
              key={layer.id}
              height={layer.height}
              width={layer.width}
              design={layer.design}
              uvPass={layer.uvPass}
              mask={layer.mask}
              zIndex={layer.zIndex}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
};
