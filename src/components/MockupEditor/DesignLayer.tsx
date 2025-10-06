import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { useLayersStore } from "@/app/stores/useLayersStore";

interface DesignLayerProps {
  uvPass: string;
  mask: string;
  design: string | null;
  width: number;
  height: number;
  zIndex: number;
}

export const DesignLayer: React.FC<DesignLayerProps> = ({
  uvPass,
  mask,
  design,
  width,
  height,
  zIndex,
}) => {
  const { gl } = useThree();
  const setLoading = useLayersStore((s) => s.setLoading);
  const [uvTexture, setUvTexture] = useState<THREE.Texture | null>(null);
  const [designTexture, setDesignTexture] = useState<THREE.Texture | null>(
    null
  );
  const [maskTexture, setMaskTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!design) return;
    setLoading(true);

    const exrLoader = new EXRLoader();
    const textureLoader = new THREE.TextureLoader();

    const loadUvTexture = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        exrLoader.load(
          url,
          (texture) => {
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
          reject
        );
      });

    const loadTexture = (url: string, srgb = true) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          url,
          (texture) => {
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

    Promise.all([loadUvTexture(uvPass), loadTexture(design), loadTexture(mask)])
      .then(([uv, designTex, maskTex]) => {
        setUvTexture(uv);
        setDesignTexture(designTex);
        setMaskTexture(maskTex);
        setLoading(false); // ✅ all textures loaded
      })
      .catch((err) => {
        console.error("Texture load error:", err);
        setLoading(false);
      });
  }, [uvPass, design, mask, gl, setLoading]);

  if (!uvTexture || !designTexture || !maskTexture) return null;
  console.log(designTexture);

  return (
    <mesh position={[0, 0, zIndex]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        key={designTexture?.uuid}
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
          varying vec2 vUv;
          void main() {
            vec2 mappedUV = texture2D(uvPassTexture, vUv).rg;
            mappedUV = clamp(mappedUV, 0.0, 1.0);
            vec4 designColor = texture2D(designTexture, mappedUV);
            vec4 maskColor = texture2D(maskTexture, vUv);
            gl_FragColor = vec4(designColor.rgb, designColor.a * maskColor.r);
          }
        `}
        uniforms={{
          uvPassTexture: { value: uvTexture },
          designTexture: { value: designTexture },
          maskTexture: { value: maskTexture },
        }}
        transparent
        depthTest
        depthWrite={false}
      />
    </mesh>
  );
};
