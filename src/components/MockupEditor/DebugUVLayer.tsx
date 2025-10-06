"use client";

import React, { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DesignLayerProps {
  uvPass: string;
  canvasWidth: number;
  canvasHeight: number;
}

export const DebugUVLayer: React.FC<DesignLayerProps> = ({
  uvPass,
  canvasWidth,
  canvasHeight,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const [uvTexture, setUvTexture] = useState<THREE.Texture | null>(null);

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Debug shader: show UV pass values directly
  const fragmentShader = `
    uniform sampler2D uvPassTexture;
    varying vec2 vUv;

    void main() {
      vec4 uvData = texture2D(uvPassTexture, vUv);
      // Show UVs directly as colors
      gl_FragColor = vec4(uvData.rg, 0.0, 1.0);
    }
  `;

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    loader.load(
      uvPass,
      (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = gl.capabilities.getMaxAnisotropy();
        setUvTexture(texture);
      },
      undefined,
      (err) => console.error("Failed to load uvPass:", err)
    );
  }, [uvPass, gl]);

  const [shaderMaterial] = useState(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uvPassTexture: { value: null },
      },
      transparent: false,
    });
  });

  useEffect(() => {
    if (materialRef.current && uvTexture) {
      materialRef.current.uniforms.uvPassTexture.value = uvTexture;
      materialRef.current.needsUpdate = true;
    }
  }, [uvTexture]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[canvasWidth, canvasHeight]} />
      <primitive ref={materialRef} object={shaderMaterial} attach="material" />
    </mesh>
  );
};
