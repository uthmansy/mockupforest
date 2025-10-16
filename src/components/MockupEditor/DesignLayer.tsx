"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber"; // ← added useFrame
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { Area } from "react-easy-crop";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";

interface DesignLayerProps {
  mask: string;
  design: string | null;
  width: number;
  height: number;
  zIndex: number;
  croppedArea?: Area | null;
  shadowIntensity?: number;
  highlightIntensity?: number;
  noiseAmount?: number;
}

export const DesignLayer: React.FC<DesignLayerProps> = ({
  mask,
  design,
  width,
  height,
  zIndex,
  croppedArea,
  shadowIntensity = 0,
  highlightIntensity = 2.7,
  noiseAmount = 0,
}) => {
  const { gl } = useThree();
  const setLoading = useLayersStore((s) => s.setLoading);

  const global = useGlobalSettingsStore();
  const uvTexture = global.uvTexture;
  const baseTexture = global.baseTexture;
  const [designTexture, setDesignTexture] = useState<THREE.Texture | null>(
    null
  );
  const [maskTexture, setMaskTexture] = useState<THREE.Texture | null>(null);
  const [designDimensions, setDesignDimensions] = useState({
    width: 1,
    height: 1,
  });

  const isLoadingRef = useRef(false);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Uniform refs for reactive updates
  const shadowIntensityRef = useRef(shadowIntensity);
  const highlightIntensityRef = useRef(highlightIntensity);
  const noiseAmountRef = useRef(noiseAmount);

  // Update refs when props change
  useEffect(() => {
    shadowIntensityRef.current = shadowIntensity;
    highlightIntensityRef.current = highlightIntensity;
    noiseAmountRef.current = noiseAmount;
  }, [shadowIntensity, highlightIntensity, noiseAmount]);

  // Sync uniforms every frame (like ColorLayer)
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.shadowIntensity.value =
        shadowIntensityRef.current;
      materialRef.current.uniforms.highlightIntensity.value =
        highlightIntensityRef.current;
      materialRef.current.uniforms.noiseAmount.value = noiseAmountRef.current;
    }
  });

  // Load textures
  useEffect(() => {
    if (!design || !uvTexture) {
      // Cleanup
      [uvTexture, designTexture, maskTexture, baseTexture].forEach((tex) =>
        tex?.dispose()
      );
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

    const textureLoader = new THREE.TextureLoader();

    const loadTexture = (url: string, srgb = true) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          url,
          (texture) => {
            if (canceled) return texture.dispose();
            const img = texture.image as HTMLImageElement;
            if (img && url === design) {
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
          reject
        );
      });

    Promise.all([loadTexture(design), loadTexture(mask)])
      .then(([designTex, maskTex]) => {
        if (!canceled) {
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
      if (isLoadingRef.current) {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };
  }, [uvTexture, design, mask, global.base, gl, setLoading]);

  const uniforms = useMemo(() => {
    if (
      !global.uvTexture ||
      !global.baseTexture ||
      !designTexture ||
      !maskTexture
    )
      return null;

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
      baseTexture: { value: baseTexture }, // ← added
      cropOffset: { value: uvMin },
      cropScale: { value: uvMax },
      shadowIntensity: { value: shadowIntensity },
      highlightIntensity: { value: highlightIntensity },
      noiseAmount: { value: noiseAmount },
    };
  }, [
    uvTexture,
    designTexture,
    maskTexture,
    baseTexture,
    croppedArea,
    designDimensions,
    shadowIntensity,
    highlightIntensity,
    noiseAmount,
  ]);

  useEffect(() => {
    return () => {
      [uvTexture, designTexture, maskTexture, baseTexture].forEach((tex) =>
        tex?.dispose()
      );
    };
  }, [uvTexture, designTexture, maskTexture, baseTexture]);

  if (!uniforms) return null;

  return (
    <mesh position={[0, 0, zIndex]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        key={`${designTexture?.uuid}-${croppedArea?.x}-${croppedArea?.y}`}
        transparent
        depthTest
        depthWrite={false}
        uniforms={uniforms}
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
          uniform sampler2D baseTexture; // ← lighting info
          uniform vec2 cropOffset;
          uniform vec2 cropScale;
          uniform float shadowIntensity;
          uniform float highlightIntensity;
          uniform float noiseAmount;

          varying vec2 vUv;

          // Simple hash-based noise
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
            // Remap UV using UV pass
            vec2 mappedUV = texture2D(uvPassTexture, vUv).rg;
            mappedUV = clamp(mappedUV, 0.0, 1.0);
            vec2 designUV = cropOffset + mappedUV * (cropScale - cropOffset);
            vec4 designColor = texture2D(designTexture, designUV);
            if (designColor.a < 0.01) discard;

            // Base lighting (from neutral gray render)
            vec3 baseCol = texture2D(baseTexture, vUv).rgb;
            float brightness = dot(baseCol, vec3(0.3333));

            // Normalize: shadows 0–0.2, highlights 0.2–1
            float normalized = brightness < 0.5
                ? brightness * 0.4
                : 0.2 + (brightness - 0.5) * 1.6;

            // Add noise
            float noise = random(vUv * 1024.0) * 2.0 - 1.0;
            normalized = clamp(normalized + noise * noiseAmount, 0.0, 1.0);

            // Lighting factors
            float shadowFactor = mix(0.7, 1.0, normalized);
            float highlightFactor = smoothstep(0.2, 1.0, normalized) * highlightIntensity;

            // Apply lighting to design color (not flat color)
            vec3 designRGB = designColor.rgb;
            float colorBrightness = dot(designRGB, vec3(0.3333));
            vec3 shadowed = designRGB * shadowFactor;
            float highlightBoost = (1.0 - colorBrightness) * 0.5;
            vec3 highlighted = designRGB + baseCol * highlightFactor * (1.0 + highlightBoost);

            vec3 finalCol = mix(shadowed, highlighted, normalized);
            finalCol = max(finalCol, designRGB * 0.3); // brightness floor

            // Smooth mask alpha
            float maskValue = texture2D(maskTexture, vUv).r;
            float alpha = smoothstep(0.1, 0.3, maskValue) * designColor.a;

            gl_FragColor = vec4(finalCol, alpha);
          }
        `}
      />
    </mesh>
  );
};
