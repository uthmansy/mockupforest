"use client";

import { MockupSceneProps } from "@/components/MockupEditor/types";
import { useEffect, useMemo, useState, useRef } from "react";
import * as THREE from "three";

export const useWarpedDesignTexture = ({
  designImage,
  normalizedBox,
  canvasWidth = 4000,
  canvasHeight = 3000,
}: Pick<MockupSceneProps, "designImage" | "normalizedBox"> & {
  canvasWidth?: number;
  canvasHeight?: number;
}) => {
  const [designTexture, setDesignTexture] = useState<THREE.Texture | null>(
    null
  );
  const [imageDimensions, setImageDimensions] = useState({
    width: 1,
    height: 1,
  });
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const urlRef = useRef<string | null>(null);

  // Configure texture settings
  const configureTexture = (texture: THREE.Texture) => {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  };

  // Load image and create texture
  useEffect(() => {
    if (!designImage) {
      setDesignTexture(null);
      return;
    }

    let url: string;

    if (designImage instanceof File) {
      url = URL.createObjectURL(designImage);
      urlRef.current = url;
    } else if (typeof designImage === "string") {
      url = designImage;
      urlRef.current = null; // no need to revoke
    } else {
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });

      textureLoader.load(url, (texture) => {
        configureTexture(texture);
        setDesignTexture(texture);
      });
    };
    img.src = url;

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [designImage, textureLoader]);

  // Compute plane size based on canvas dimensions
  const planeSize = useMemo(() => {
    return [canvasWidth, canvasHeight] as [number, number];
  }, [canvasWidth, canvasHeight]);

  // Generate warped geometry
  const warpedGeometry = useMemo(() => {
    if (!normalizedBox || !designTexture) {
      return new THREE.PlaneGeometry(0.01, 0.01);
    }

    const [width, height] = planeSize;
    const { topLeft, topRight, bottomRight, bottomLeft } = normalizedBox;

    const normTo3D = (nx: number, ny: number): THREE.Vector3 => {
      // Map normalized coordinates (0 to 1) to pixel space, centered at canvas origin
      return new THREE.Vector3(
        nx * width - width / 2, // Map x to pixel space and center
        (1 - ny) * height - height / 2, // Map y, flip vertically, and center
        0.001 // Small Z offset to avoid Z-fighting
      );
    };

    const tl = normTo3D(topLeft[0], topLeft[1]);
    const tr = normTo3D(topRight[0], topRight[1]);
    const br = normTo3D(bottomRight[0], bottomRight[1]);
    const bl = normTo3D(bottomLeft[0], bottomLeft[1]);

    const subdivisions = 16;
    const positions: number[] = [];
    const uvs: number[] = [];

    for (let row = 0; row <= subdivisions; row++) {
      for (let col = 0; col <= subdivisions; col++) {
        const u = col / subdivisions;
        const v = row / subdivisions;

        const top = tl.clone().lerp(tr, u);
        const bottom = bl.clone().lerp(br, u);
        const pos = top.lerp(bottom, v);

        positions.push(pos.x, pos.y, pos.z);
        uvs.push(u, 1 - v);
      }
    }

    const indices: number[] = [];
    for (let row = 0; row < subdivisions; row++) {
      for (let col = 0; col < subdivisions; col++) {
        const a = row * (subdivisions + 1) + col;
        const b = a + 1;
        const c = a + (subdivisions + 1);
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    return geometry;
  }, [normalizedBox, planeSize, designTexture]);

  return {
    designTexture,
    warpedGeometry,
    isLoading: !designTexture && !!designImage,
  };
};
