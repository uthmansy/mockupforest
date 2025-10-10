"use client";

import React, { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLayersStore } from "@/app/stores/useLayersStore";

interface ColorLayerProps {
  mask: string; // Mask texture URL
  base: string; // Base lighting texture URL (neutral gray render)
  color?: string; // Flat color to apply
  width: number;
  height: number;
  zIndex: number;
  shadowIntensity?: number; // Control shadow darkness (0 = no shadow, 1 = full shadow)
  highlightIntensity?: number; // Control highlight brightness
  noiseAmount?: number;
}

export const ColorLayer: React.FC<ColorLayerProps> = ({
  mask,
  base,
  color = "#ffffff",
  width,
  height,
  zIndex,
  shadowIntensity = 0, // Much gentler shadows by default
  highlightIntensity = 3, // Brighter highlights by default
  noiseAmount = 0.03,
}) => {
  const { gl } = useThree();
  const setLoading = useLayersStore((s) => s.setLoading);

  const maskTex = useRef<THREE.Texture | null>(null);
  const baseTex = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorRef = useRef(new THREE.Color(color));
  const [ready, setReady] = useState(false);

  // 🔹 Load mask and base textures
  useEffect(() => {
    let canceled = false;
    const loader = new THREE.TextureLoader();
    setLoading(true);

    const loadTexture = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (texture) => {
            texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = Math.min(
              16,
              gl.capabilities.getMaxAnisotropy()
            );
            resolve(texture);
          },
          undefined,
          reject
        );
      });

    Promise.all([loadTexture(mask), loadTexture(base)])
      .then(([maskTex_, baseTex_]) => {
        if (canceled) return;
        maskTex.current = maskTex_;
        baseTex.current = baseTex_;
        setReady(true);
        setLoading(false);
      })
      .catch((err) => {
        if (!canceled) {
          console.error("Error loading textures:", err);
          setLoading(false);
        }
      });

    return () => {
      canceled = true;
      maskTex.current?.dispose();
      baseTex.current?.dispose();
      maskTex.current = null;
      baseTex.current = null;
    };
  }, [mask, base, gl, setLoading]);

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

  if (!ready || !maskTex.current || !baseTex.current) return null;

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
          baseTexture: { value: baseTex.current },
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
          uniform float noiseAmount; // NEW
          varying vec2 vUv;

          // Simple hash-based noise (cheap and repeatable)
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
            vec4 mask = texture2D(maskTexture, vUv);
            vec3 baseCol = texture2D(baseTexture, vUv).rgb;

            // 1️⃣ Base brightness (0–1)
            float brightness = dot(baseCol, vec3(0.3333));

            // 2️⃣ Normalize so that shadows = 0–0.2, highlights = 0.2–1
            float normalized = brightness < 0.5
                ? brightness * 0.4
                : 0.2 + (brightness - 0.5) * 1.6;

            // 3️⃣ Add subtle procedural noise
            float noise = random(vUv * 1024.0) * 2.0 - 1.0; // range -1 to +1
            normalized = clamp(normalized + noise * noiseAmount, 0.0, 1.0);

            // 4️⃣ Lighting response
            float shadowFactor = mix(0.7, 1.0, normalized);
            float highlightFactor = smoothstep(0.2, 1.0, normalized) * highlightIntensity;

            // 5️⃣ Color response
            float colorBrightness = dot(flatColor, vec3(0.3333));
            vec3 shadowed = flatColor * shadowFactor;
            float highlightBoost = (1.0 - colorBrightness) * 0.5;
            vec3 highlighted = flatColor + baseCol * highlightFactor * (1.0 + highlightBoost);

            // 6️⃣ Blend shadows → highlights smoothly
            vec3 finalCol = mix(shadowed, highlighted, normalized);

            // 7️⃣ Keep minimum brightness floor
            finalCol = max(finalCol, flatColor * 0.3);

            // 8️⃣ Mask transparency with smooth edges
            float alpha = smoothstep(0.1, 0.3, mask.r);
            gl_FragColor = vec4(finalCol, alpha);
          }

        `}
      />
    </mesh>
  );
};
