"use client";

import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  width: number;
  height: number;
  src: string;
}

const BaseLayer = ({ height, width, src }: Props) => {
  const texture = useLoader(THREE.TextureLoader, src);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.SRGBColorSpace;

  // const global = useGlobalSettingsStore();
  // const baseTexture = global.baseTexture;
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};
export default BaseLayer;
