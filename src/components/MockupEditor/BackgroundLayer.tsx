"use client";

import React, { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";

interface BackgroundLayerProps {
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

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  mask,
  color = "#ffffff",
  width,
  height,
  zIndex,
  shadowIntensity = 2.0,
  highlightIntensity = 0.16,
  noiseAmount = 0,
  id,
}) => {
  const { gl } = useThree();
  const setLoading = useLayersStore((s) => s.setLoading);
  const global = useGlobalSettingsStore();
  const setColorLoading = useLayersStore((s) => s.setColorLoading);

  const maskTex = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorRef = useRef(new THREE.Color(color));
  const [ready, setReady] = useState(false);
  const hasRenderedRef = useRef(false);

  useFrame(() => {
    if (!hasRenderedRef.current && materialRef.current) {
      hasRenderedRef.current = true;
      queueMicrotask(() => {
        setColorLoading(id, false);
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
  }, [mask, gl, setLoading, id, setColorLoading]);

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
      materialRef.current.uniforms.noiseAmount.value = noiseAmount;
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
          baseTexture: { value: global.baseTexture },
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
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
          }

          void main() {
            // --- Sample base and mask ---
            vec4 mask = texture2D(maskTexture, vUv);
            if (mask.a < 0.01 && mask.r < 0.01) discard;

            vec3 baseCol = texture2D(baseTexture, vUv).rgb;

            // --- Calculate base brightness ---
            float brightness = dot(baseCol, vec3(0.3333));
            
            // --- Normalize brightness with smoother curve ---
            float normalized = pow(brightness, 1.1) * 1.1;
            normalized = clamp(normalized, 0.0, 1.0);

            // --- Calculate color brightness for adaptive effects ---
            float colorBrightness = dot(flatColor, vec3(0.299, 0.587, 0.114));

            // --- FIXED: Better color calibration that preserves highlights for dark colors ---
            float adaptiveScale = 1.0;
            if (colorBrightness < 0.3) {
              // For dark colors, use gentler scaling to preserve highlight details
              adaptiveScale = mix(0.85, 1.0, colorBrightness / 0.3);
            } else {
              // Bright colors get slight compression to prevent blowout
              adaptiveScale = mix(1.0, 0.9, smoothstep(0.3, 1.0, colorBrightness));
            }
            vec3 calibratedColor = flatColor * adaptiveScale;

            // --- FIXED: More balanced shadow intensity ---
            float adaptiveShadowIntensity = shadowIntensity;
            if (colorBrightness < 0.5) {
              // Slightly reduce shadow intensity for very dark colors but not too much
              adaptiveShadowIntensity = shadowIntensity * mix(0.7, 1.0, colorBrightness / 0.5);
            }

            // --- Lighting factors ---
            float shadowFactor = mix(1.0 - adaptiveShadowIntensity, 1.0, normalized);
            
            // FIXED: Ensure dark colors still get highlights from base texture
            float highlightFactor = smoothstep(0.1, 0.8, normalized) * highlightIntensity;
            
            // Don't reduce highlights for dark colors - let them show base texture details
            // highlightFactor remains unchanged for all colors

            // --- FIXED: Apply lighting with better balance for dark colors ---
            vec3 shadowed = calibratedColor * shadowFactor;
            
            // Use base color for highlights - this is key for dark colors to show texture
            float highlightBoost = (1.0 - colorBrightness) * 0.4;
            vec3 highlighted = calibratedColor + baseCol * highlightFactor * (0.7 + highlightBoost);

            // Mix between shadow and highlight based on normalized brightness
            vec3 finalCol = mix(shadowed, highlighted, normalized);
            
            // FIXED: Better clamping that preserves highlight details for dark colors
            finalCol = clamp(finalCol, 0.0, 1.0);
            
            // Ensure dark colors don't get blown out but can still show highlights
            if (colorBrightness < 0.2) {
              finalCol = min(finalCol, calibratedColor * 2.0); // Allow some highlight
            } else {
              finalCol = max(finalCol, calibratedColor * 0.2); // brightness floor
            }

            // --- FIXED: Apply visible artistic noise to final color ---
            // Apply noise in a way that's actually visible
            float noise1 = random(vUv * 512.0) * 2.0 - 1.0;
            float noise2 = random(vUv * 256.0 + 0.5) * 2.0 - 1.0;
            float combinedNoise = (noise1 + noise2) * 0.5;
            
            // Apply noise to the final color with user-controlled intensity
            finalCol += combinedNoise * noiseAmount * 0.15;

            // --- Apply dithering to eliminate banding ---
            float dither = random(gl_FragCoord.xy) - 0.5;
            finalCol += dither / 255.0;

            // Ensure we don't go out of bounds after dithering and noise
            finalCol = clamp(finalCol, 0.0, 1.0);

            // --- Smooth mask edge ---
            float alpha = smoothstep(0.1, 0.3, mask.r);
            
            gl_FragColor = vec4(finalCol, alpha);
          }
        `}
      />
    </mesh>
  );
};
