"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { Area } from "react-easy-crop";

interface DesignLayerProps {
  uvPass?: string;
  mask: string;
  design: string | null;
  width: number;
  height: number;
  zIndex: number;
  croppedArea?: Area | null;
}

export const DesignLayer: React.FC<DesignLayerProps> = ({
  uvPass,
  mask,
  design,
  width,
  height,
  zIndex,
  croppedArea,
}) => {
  const { gl } = useThree();
  const setLoading = useLayersStore((s) => s.setLoading);

  const [uvTexture, setUvTexture] = useState<THREE.Texture | null>(null);
  const [designTexture, setDesignTexture] = useState<THREE.Texture | null>(
    null
  );
  const [maskTexture, setMaskTexture] = useState<THREE.Texture | null>(null);
  const [designDimensions, setDesignDimensions] = useState({
    width: 1,
    height: 1,
  });

  // Track loading state internally to prevent race conditions
  const isLoadingRef = useRef(false);

  // Load textures
  useEffect(() => {
    if (!design) {
      // Immediate cleanup when design becomes null
      if (uvTexture) uvTexture.dispose();
      if (designTexture) designTexture.dispose();
      if (maskTexture) maskTexture.dispose();

      setUvTexture(null);
      setDesignTexture(null);
      setMaskTexture(null);
      setDesignDimensions({ width: 1, height: 1 });

      if (isLoadingRef.current) {
        setLoading(false);
        isLoadingRef.current = false;
      }
      return;
    }

    setLoading(true);
    isLoadingRef.current = true;
    let canceled = false;

    const exrLoader = new EXRLoader();
    const textureLoader = new THREE.TextureLoader();

    const loadUvTexture = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        exrLoader.load(
          url,
          (texture) => {
            if (canceled) {
              texture.dispose();
              return;
            }
            texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            texture.colorSpace = THREE.NoColorSpace;
            texture.anisotropy = Math.min(
              16,
              gl.capabilities.getMaxAnisotropy()
            );
            resolve(texture);
          },
          undefined,
          (error) => {
            console.error("Failed to load UV texture:", error);
            reject(error);
          }
        );
      });

    const loadTexture = (url: string, srgb = true) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          url,
          (texture) => {
            if (canceled) {
              texture.dispose();
              return;
            }
            const img = texture.image as HTMLImageElement;
            if (img) {
              console.log("img from loader:", img.naturalHeight);
              setDesignDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
              });
            }
            texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            texture.colorSpace = srgb
              ? THREE.SRGBColorSpace
              : THREE.NoColorSpace;
            texture.anisotropy = Math.min(
              16,
              gl.capabilities.getMaxAnisotropy()
            );
            resolve(texture);
          },
          undefined,
          (error) => {
            console.error("Failed to load texture:", url, error);
            reject(error);
          }
        );
      });
    if (!uvPass) return;
    Promise.all([loadUvTexture(uvPass), loadTexture(design), loadTexture(mask)])
      .then(([uv, designTex, maskTex]) => {
        if (!canceled) {
          setUvTexture(uv);
          setDesignTexture(designTex);
          setMaskTexture(maskTex);
          setLoading(false);
          isLoadingRef.current = false;
        }
      })
      .catch((err) => {
        if (!canceled) {
          console.error("Texture load error:", err);
          setLoading(false);
          isLoadingRef.current = false;
        }
      });

    return () => {
      canceled = true;
      // Only set loading to false if we were actually loading
      if (isLoadingRef.current) {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };
  }, [uvPass, design, mask, gl, setLoading]);

  // Compute uniforms declaratively
  const uniforms = useMemo(() => {
    if (!uvTexture || !designTexture || !maskTexture) return null;

    const uvMin = new THREE.Vector2(
      (croppedArea?.x || 0) / designDimensions.width,
      1.0 -
        ((croppedArea?.y || 0) + (croppedArea?.height || 0)) /
          designDimensions.height
    );

    const uvMax = new THREE.Vector2(
      ((croppedArea?.x || 0) + (croppedArea?.width || 0)) /
        designDimensions.width,
      1.0 - (croppedArea?.y || 0) / designDimensions.height
    );

    return {
      uvPassTexture: { value: uvTexture },
      designTexture: { value: designTexture },
      maskTexture: { value: maskTexture },
      cropOffset: { value: uvMin }, // acts as uvMin
      cropScale: { value: uvMax }, // acts as uvMax
    };
  }, [
    uvTexture,
    designTexture,
    maskTexture,
    croppedArea,
    width,
    height,
    designDimensions,
  ]);

  // Debug: log when textures are loaded
  useEffect(() => {
    if (uvTexture && designTexture && maskTexture) {
    }
  }, [uvTexture, designTexture, maskTexture, design, croppedArea]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (uvTexture) uvTexture.dispose();
      if (designTexture) designTexture.dispose();
      if (maskTexture) maskTexture.dispose();
    };
  }, [uvTexture, designTexture, maskTexture]);

  if (!uniforms) {
    return null;
  }

  return (
    <mesh position={[0, 0, zIndex]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        key={`${designTexture?.uuid}-${croppedArea?.x}-${croppedArea?.y}`}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;
          uniform sampler2D uvPassTexture;
          uniform sampler2D designTexture;
          uniform sampler2D maskTexture;
          uniform vec2 cropOffset;
          uniform vec2 cropScale;
          varying vec2 vUv;

          void main() {
            vec2 mappedUV = texture2D(uvPassTexture, vUv).rg;
            mappedUV = clamp(mappedUV, 0.0, 1.0);

            // Define your design UV range
            vec2 uvMin = cropOffset;
            vec2 uvMax = cropScale;

            // Remap UVs into the defined subrange
            vec2 designUV = uvMin + mappedUV * (uvMax - uvMin);

            // Sample the design within this range
            vec4 designColor = texture2D(designTexture, designUV);

            // Sample the mask normally
            vec4 maskColor = texture2D(maskTexture, vUv);

            // Apply threshold to mask to ensure white areas are opaque and dark areas are transparent
            float maskValue = maskColor.r;
            float threshold = 0.1; // Adjust this value based on your mask
            float alpha = step(threshold, maskValue);

            // Alternative: Use smoothstep for smoother edges if needed
            // float alpha = smoothstep(0.1, 0.3, maskValue);

            // Apply mask with threshold
            gl_FragColor = vec4(designColor.rgb, designColor.a * alpha);
          }
        `}
        uniforms={uniforms}
        transparent
        depthTest
        depthWrite={false}
      />
    </mesh>
  );
};
