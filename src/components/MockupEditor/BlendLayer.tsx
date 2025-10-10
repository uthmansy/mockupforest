"use client";

import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";

interface BlendLayerProps {
  width: number;
  height: number;
}

export const BlendLayer: React.FC<BlendLayerProps> = ({ width, height }) => {
  // Base texture (sRGB color image)
  const baseTexture = useLoader(THREE.TextureLoader, "/editor/beauty.jpg");

  // Mask texture (data/alpha channel — should NOT be sRGB)
  const maskTexture = useLoader(THREE.TextureLoader, "/editor/mask.jpg");

  // Highlight EXR (already in linear space)
  const highlightEXR = useLoader(EXRLoader, "/editor/h.exr");

  // Configure color spaces correctly
  baseTexture.colorSpace = THREE.SRGBColorSpace; // ✅ for color images
  maskTexture.colorSpace = THREE.NoColorSpace; // ✅ for data/masks
  highlightEXR.colorSpace = THREE.LinearSRGBColorSpace; // ✅ EXR is linear

  // Optional: set filtering for EXR (already linear, so LinearFilter is fine)
  highlightEXR.minFilter = THREE.LinearFilter;
  highlightEXR.magFilter = THREE.LinearFilter;
  highlightEXR.needsUpdate = true;

  // --- SHADOW MATERIAL (Multiply blend) ---
  const shadowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: baseTexture },
        uMask: { value: maskTexture },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform sampler2D uMask;

        // Linear to sRGB approximation
        vec3 linearTosRGB(vec3 color) {
          return pow(color, vec3(1.0 / 2.2));
        }

        void main() {
          vec4 tex = texture2D(uTexture, vUv);
          vec4 mask = texture2D(uMask, vUv);

          float luminance = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
          float shadowRegion = smoothstep(0.0, 0.4, 1.0 - luminance);
          float alpha = mask.r * shadowRegion * 0.9;
          vec3 shadowColor = tex.rgb * alpha;

          // Convert to sRGB for display since Canvas expects sRGB output
          shadowColor = linearTosRGB(shadowColor);
          
          gl_FragColor = vec4(shadowColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.MultiplyBlending,
      premultipliedAlpha: true,
      depthWrite: false,
    });
  }, [baseTexture, maskTexture]);

  // --- HIGHLIGHT MATERIAL (Additive blend using EXR) ---
  const highlightMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uEXR: { value: highlightEXR },
        uMask: { value: maskTexture },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform sampler2D uEXR;   // linear
        uniform sampler2D uMask;  // raw data

        void main() {
          vec4 exrColor = texture2D(uEXR, vUv);   // linear HDR
          vec4 mask = texture2D(uMask, vUv);      // raw alpha

          float alpha = mask.r * 0.4;
          vec3 highlightColor = exrColor.rgb * alpha;

          gl_FragColor = vec4(highlightColor, alpha); // linear output
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [highlightEXR, maskTexture]);

  return (
    <>
      {/* Shadow layer (Multiply blending) */}
      <mesh position={[0, 0, 10]}>
        <planeGeometry args={[width, height]} />
        <primitive object={shadowMaterial} attach="material" />
      </mesh>

      {/* Highlight layer (Additive blending using EXR) */}
      <mesh position={[0, 0, 11]}>
        <planeGeometry args={[width, height]} />
        <primitive object={highlightMaterial} attach="material" />
      </mesh>
    </>
  );
};
