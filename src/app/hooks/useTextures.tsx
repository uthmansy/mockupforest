"use client";

import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/Addons.js";
import { useLayersStore } from "@/app/stores/useLayersStore";

/**
 * A unified hook for loading and caching textures (UV, base, mask, design, etc.)
 * Handles both EXR and standard image formats.
 */

export interface UseTexturesProps {
  uv?: string | null;
  base?: string | null;
  design?: string | null;
  mask?: string | null;
}

export const useTextures = ({ uv, base, design, mask }: UseTexturesProps) => {
  const setLoading = useLayersStore((s) => s.setLoading);
  const setBaseAndUvLoading = useLayersStore((s) => s.setBaseAndUvLoading);
  const clearAllDesignLoadings = useLayersStore(
    (s) => s.clearAllDesignLoadings
  );
  const [textures, setTextures] = useState<{
    uvTexture: THREE.Texture | null;
    baseTexture: THREE.Texture | null;
    designTexture: THREE.Texture | null;
    maskTexture: THREE.Texture | null;
  }>({
    uvTexture: null,
    baseTexture: null,
    designTexture: null,
    maskTexture: null,
  });

  const exrLoaderRef = useRef<EXRLoader | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);

  useEffect(() => {
    exrLoaderRef.current = new EXRLoader();
    textureLoaderRef.current = new THREE.TextureLoader();
    return () => {
      exrLoaderRef.current = null;
      textureLoaderRef.current = null;
    };
  }, []);

  useEffect(() => {
    const hasAny = uv || base || design || mask;
    if (!hasAny) return;

    let cancelled = false;
    setLoading(true);
    setBaseAndUvLoading(true);

    const loadTexture = (
      url: string,
      options?: {
        exr?: boolean;
        srgb?: boolean;
      }
    ): Promise<THREE.Texture> => {
      return new Promise((resolve, reject) => {
        const loader = options?.exr
          ? exrLoaderRef.current
          : textureLoaderRef.current;

        if (!loader) return reject("No loader available");

        loader.load(
          url,
          (tex: THREE.Texture) => {
            if (cancelled) return tex.dispose();

            tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = true;
            tex.colorSpace = options?.srgb
              ? THREE.SRGBColorSpace
              : THREE.NoColorSpace;

            resolve(tex);
          },
          undefined,
          reject
        );
      });
    };

    const loadAll = async () => {
      try {
        const results = await Promise.allSettled([
          uv ? loadTexture(uv, { exr: true }) : Promise.resolve(null),
          base ? loadTexture(base, { srgb: true }) : Promise.resolve(null),
          design ? loadTexture(design, { srgb: true }) : Promise.resolve(null),
          mask ? loadTexture(mask, { srgb: true }) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const [uvTex, baseTex, designTex, maskTex] = results.map((r) =>
          r.status === "fulfilled" ? r.value : null
        );

        setTextures({
          uvTexture: uvTex,
          baseTexture: baseTex,
          designTexture: designTex,
          maskTexture: maskTex,
        });
        console.log("base and uv loaded");
        setLoading(false);
        setBaseAndUvLoading(false);
      } catch (err) {
        console.error("Texture loading failed:", err);
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();

    return () => {
      cancelled = true;
      setLoading(false);
      setBaseAndUvLoading(false);
      clearAllDesignLoadings();
    };
  }, [uv, base, design, mask, setLoading]);

  return textures;
};
