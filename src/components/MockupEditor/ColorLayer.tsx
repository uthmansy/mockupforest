"use client";

import React, { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";

interface ColorLayerProps {
  mask: string;
  color?: string;
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
  const setColorLoading = useLayersStore((s) => s.setColorLoading);
  const global = useGlobalSettingsStore();

  const maskTex = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorRef = useRef(new THREE.Color(color));

  const [ready, setReady] = useState(false);
  const hasRenderedRef = useRef(false);

  // Load mask texture
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
        // texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());

        maskTex.current = texture;
        setReady(true);
      },
      undefined,
      (err) => {
        if (!canceled) {
          console.error("Mask load error:", err);
          setColorLoading(id, false);
        }
      }
    );

    return () => {
      canceled = true;
      maskTex.current?.dispose();
      maskTex.current = null;
    };
  }, [mask, gl, setColorLoading]);

  // Reactive color update
  useEffect(() => {
    colorRef.current.set(color);
  }, [color]);

  // Update uniforms every frame
  useFrame(() => {
    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      u.flatColor.value.copy(colorRef.current);
      u.shadowIntensity.value = shadowIntensity;
      u.highlightIntensity.value = highlightIntensity;
      u.noiseAmount.value = noiseAmount;
    }
  });

  // Notify when first rendered
  useFrame(() => {
    if (!hasRenderedRef.current && materialRef.current) {
      hasRenderedRef.current = true;
      queueMicrotask(() => setColorLoading(id, false));
    }
  });

  if (!ready || !maskTex.current || !global.baseTexture) return null;

  return (
    <mesh position={[0, 0, zIndex]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
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

          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
            vec4 mask = texture2D(maskTexture, vUv);
            if (mask.a < 0.01 && mask.r < 0.01) discard;

            vec3 baseCol = texture2D(baseTexture, vUv).rgb;

            float brightness = dot(baseCol, vec3(0.3333));
            float mid = 0.35;
            float t = smoothstep(mid - 0.3, mid + 0.67, brightness);

            float low = pow(brightness, 1.2) * 1.5;
            float high = 0.2 + (brightness - 0.55);
            float normalized = mix(low, high, t);

            float noise = random(vUv * 1024.0) * 2.0 - 1.0;
            normalized = clamp(normalized + noise * noiseAmount, 0.0, 1.0);

            float colorBrightness = dot(flatColor, vec3(0.299, 0.587, 0.114));
            float adaptiveScale = mix(1.0, 0.90, smoothstep(0.8, 1.0, colorBrightness));
            vec3 calibratedColor = flatColor * adaptiveScale;

            float adaptiveShadowIntensity =
              shadowIntensity * mix(1.0, 1.25, smoothstep(0.6, 1.0, colorBrightness));

            vec3 shadowed = calibratedColor * mix(1.0 - adaptiveShadowIntensity, 1.0, normalized);
            float highlightBoost = (1.0 - colorBrightness) * 0.5;
            vec3 highlighted = calibratedColor + baseCol * smoothstep(0.2, 1.0, normalized) * highlightIntensity * (1.0 + highlightBoost);

            vec3 finalCol = mix(shadowed, highlighted, normalized);
            finalCol = clamp(finalCol, 0.0, 1.0);
            finalCol = max(finalCol, calibratedColor * 0.3);

            float alpha = smoothstep(0.1, 0.3, mask.r);

            // Apply gamma correction to linear color
            finalCol = pow(finalCol, vec3(1.0 / 2.2));

            gl_FragColor = vec4(finalCol, alpha);
          }
        `}
      />
    </mesh>
  );
};
