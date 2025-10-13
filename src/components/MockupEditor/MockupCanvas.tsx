"use client";

import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import { MockupSceneProps } from "@/components/MockupEditor/types";
import { DesignLayer } from "./DesignLayer";
import BaseLayer from "./BaseLayer";
import Download from "./Download";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ColorLayer } from "./ColorLayer";
import { EXRLoader } from "three/examples/jsm/Addons.js";

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
  useEffect(() => setGlRef(glRef), [glRef]);
  const {
    global,
    // updateGlobal,
    layers,
    loading,
    setLoading,
    setUvTexture,
    setBaseTexture,
  } = useLayersStore();

  useEffect(() => {
    const exrLoader = new EXRLoader();
    const textureLoader = new THREE.TextureLoader();

    // Start loading
    setLoading(true);

    let uvDone = false;
    let baseDone = false;

    const checkDone = () => {
      if (uvDone && baseDone) setLoading(false);
    };

    // Load UV
    if (!global.uvTexture && global.uv) {
      exrLoader.load(
        global.uv,
        (tex) => {
          tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.colorSpace = THREE.NoColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          setUvTexture(tex);
          uvDone = true;
          checkDone();
        },
        undefined,
        () => {
          console.error("Failed to load UV EXR");
          uvDone = true; // mark as done anyway
          checkDone();
        }
      );
    } else {
      uvDone = true;
    }

    // Load base
    if (!global.baseTexture && global.base) {
      textureLoader.load(
        global.base,
        (tex) => {
          tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          setBaseTexture(tex);
          baseDone = true;
          checkDone();
        },
        undefined,
        () => {
          console.error("Failed to load base texture");
          baseDone = true;
          checkDone();
        }
      );
    } else {
      baseDone = true;
    }

    checkDone();
  }, [global.uv, global.base]);

  return (
    <div className="relative w-full h-full flex items-start md:items-center justify-center overflow-hidden p-6">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white z-50">
          <AiOutlineLoading3Quarters className="animate-spin text-5xl mb-4" />
          <p className="text-sm uppercase tracking-wider">Loading..</p>
        </div>
      )}
      <div
        className="relative flex items-center justify-center w-full max-w-[800px] bg-gray-200 overflow-hidden rounded-lg"
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
        }}
      >
        {/* <Download glRef={glRef} /> */}
        <Canvas
          style={{ width: "100%", height: "100%" }}
          dpr={1}
          gl={{
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            preserveDrawingBuffer: true,
            antialias: true,
          }}
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
            src={global.base}
          />

          {layers.map((layer) => {
            return layer.type === "design" ? (
              <DesignLayer
                key={layer.id}
                height={layer.height}
                width={layer.width}
                design={layer.design || null}
                mask={layer.mask}
                zIndex={layer.zIndex}
                croppedArea={layer.croppedArea}
              />
            ) : (
              <ColorLayer
                key={layer.id}
                height={layer.height}
                width={layer.width}
                mask={layer.mask}
                zIndex={layer.zIndex}
                color={layer.color}
              />
            );
          })}
        </Canvas>
      </div>
    </div>
  );
};
