"use client";
import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

const useConfiguredTexture = (url: string) => {
  const texture = useLoader(TextureLoader, url);

  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.generateMipmaps = true;
      texture.anisotropy = 4; // Improve texture quality
    }
  }, [texture]);

  return texture;
};

export default useConfiguredTexture;
