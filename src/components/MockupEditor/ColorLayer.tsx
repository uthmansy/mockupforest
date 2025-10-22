"use client";

import React, { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";

interface ColorLayerProps {
  mask: string; // Mask texture URL
  color?: string; // Flat color to apply
  width: number;
  height: number;
  zIndex: number;
  shadowIntensity?: number;
  highlightIntensity?: number;
  noiseAmount?: number;
  id: number;
}

export const ColorLayer: React.FC<ColorLayerProps> = ({
  mask,
  color = "#ffffff",
  width,
  height,
  zIndex,
  shadowIntensity = 0.55,
  highlightIntensity = 1.42,
  noiseAmount = 0,
  id,
}) => {
  const { gl } = useThree();
  const setLoading = useLayersStore((s) => s.setLoading);
  const global = useGlobalSettingsStore(); // 👈 access shared global textures
  const setColorLoading = useLayersStore((s) => s.setColorLoading);

  const maskTex = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorRef = useRef(new THREE.Color(color));
  const [ready, setReady] = useState(false);

  const hasRenderedRef = useRef(false);

  useFrame(() => {
    if (!hasRenderedRef.current && materialRef.current) {
      hasRenderedRef.current = true;
      // Now it's been submitted to GPU at least once
      // Optional: defer one more frame if you want extra safety
      queueMicrotask(() => {
        setColorLoading(id, false); // or notify parent
      });
    }
  });

  // 🔹 Load only the mask (base is global now)
  useEffect(() => {
    let canceled = false;
    const loader = new THREE.TextureLoader();
    setColorLoading(id, true);

    loader.load(
      mask,
      (texture) => {
        if (canceled) return;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());

        maskTex.current = texture;
        setReady(true);
        // setLoading(false);
      },
      undefined,
      (err) => {
        if (!canceled) {
          console.error("Error loading mask texture:", err);
          setColorLoading(id, false);
        }
      }
    );

    return () => {
      canceled = true;
      maskTex.current?.dispose();
      maskTex.current = null;
      setColorLoading(id, false);
    };
  }, [mask, gl, setLoading]);

  // 🔹 Reactively update color
  useEffect(() => {
    colorRef.current.set(color);
  }, [color]);

  // 🔹 Sync uniforms every frame
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.flatColor.value.copy(colorRef.current);
      materialRef.current.uniforms.shadowIntensity.value = shadowIntensity;
      materialRef.current.uniforms.highlightIntensity.value =
        highlightIntensity;
    }
  });

  // 🔹 Check readiness
  if (!ready || !maskTex.current || !global.baseTexture) return null;

  return (
    <mesh position={[0, 0, zIndex]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        key={`${shadowIntensity}-${highlightIntensity}-${noiseAmount}`}
        ref={materialRef}
        transparent
        depthTest
        depthWrite={false}
        uniforms={{
          maskTexture: { value: maskTex.current },
          baseTexture: { value: global.baseTexture }, // 👈 use global base
          flatColor: { value: colorRef.current },
          shadowIntensity: { value: shadowIntensity },
          highlightIntensity: { value: highlightIntensity },
          noiseAmount: { value: noiseAmount },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
         precision highp float;

          uniform sampler2D maskTexture;
          uniform sampler2D baseTexture;
          uniform vec3 flatColor;
          uniform float shadowIntensity;
          uniform float highlightIntensity;
          uniform float noiseAmount;

          varying vec2 vUv;

          // Simple hash-based noise
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
            // --- Sample base and mask ---
            vec4 mask = texture2D(maskTexture, vUv);
            if (mask.a < 0.01 && mask.r < 0.01) discard;

            vec3 baseCol = texture2D(baseTexture, vUv).rgb;

            // --- Base lighting normalization ---
            float brightness = dot(baseCol, vec3(0.3333));
            float mid = 0.35;
            float t = smoothstep(mid - 0.3, mid + 0.67, brightness);
            // float low = brightness * 1.5;
            float low = pow(brightness, 1.2) * 1.5;
            float high = 0.2 + (brightness - 0.55);
            float normalized = mix(low, high, t);

            // --- Add slight procedural noise ---
            float noise = random(vUv * 1024.0) * 2.0 - 1.0;
            normalized = clamp(normalized + noise * noiseAmount, 0.0, 1.0);

            // --- Adaptive brightness calibration ---
            float colorBrightness = dot(flatColor, vec3(0.299, 0.587, 0.114));

            // Slightly compress very bright colors so white areas don’t blow out
            float adaptiveScale = mix(1.0, 0.85, smoothstep(0.8, 1.0, colorBrightness));
            vec3 calibratedColor = flatColor * adaptiveScale;

            // Adaptive shadow: brighter colors get slightly stronger shadows
            float adaptiveShadowIntensity = shadowIntensity * mix(1.0, 1.25, smoothstep(0.6, 1.0, colorBrightness));

            // --- Lighting factors ---
            float shadowFactor = mix(1.0 - adaptiveShadowIntensity, 1.0, normalized);
            float highlightFactor = smoothstep(0.2, 1.0, normalized) * highlightIntensity;

            // --- Apply lighting ---
            vec3 shadowed = calibratedColor * shadowFactor;
            float highlightBoost = (1.0 - colorBrightness) * 0.5;
            vec3 highlighted = calibratedColor + baseCol * highlightFactor * (1.0 + highlightBoost);

            vec3 finalCol = mix(shadowed, highlighted, normalized);
            finalCol = clamp(finalCol, 0.0, 1.0);
            finalCol = max(finalCol, calibratedColor * 0.3); // brightness floor

            // --- Smooth mask edge ---
            float alpha = smoothstep(0.1, 0.3, mask.r);
            gl_FragColor = vec4(finalCol, alpha);
          }

        `}
      />
    </mesh>
  );
};
