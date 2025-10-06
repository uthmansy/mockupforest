"use client";

import * as THREE from "three";
import { useEffect, useState, useMemo } from "react";

const createWhiteTexture = (): THREE.Texture => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
};

export function useMockupCanvas({
  backgroundTextureUrl,
  canvasWidth,
  canvasHeight,
  designTexture,
  alphaMaskUrl = "/editor/mask.jpg",
}: {
  backgroundTextureUrl?: string;
  canvasWidth: number;
  canvasHeight: number;
  designTexture: THREE.Texture | null;
  alphaMaskUrl?: string;
}) {
  const [backgroundTexture, setBackgroundTexture] =
    useState<THREE.Texture | null>(null);
  const [alphaTexture, setAlphaTexture] = useState<THREE.Texture | null>(null);

  // 🔹 Loading states
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(
    !!backgroundTextureUrl
  );
  const [isAlphaLoading, setIsAlphaLoading] = useState(true);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    if (backgroundTextureUrl) {
      setIsBackgroundLoading(true);
      loader.load(backgroundTextureUrl, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        setBackgroundTexture(tex);
        setIsBackgroundLoading(false);
      });
    } else {
      setIsBackgroundLoading(false);
    }

    setIsAlphaLoading(true);
    loader.load(alphaMaskUrl, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      setAlphaTexture(tex);
      setIsAlphaLoading(false);
    });
  }, [backgroundTextureUrl, alphaMaskUrl]);

  const isLoading = isBackgroundLoading || isAlphaLoading || !designTexture;

  const material = useMemo(() => {
    if (!designTexture) return null;

    const safeAlpha = alphaTexture ?? createWhiteTexture();

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        designMap: { value: designTexture },
        alphaMap: { value: safeAlpha },
        canvasSize: { value: new THREE.Vector2(canvasWidth, canvasHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          vWorldPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D designMap;
        uniform sampler2D alphaMap;
        uniform vec2 canvasSize;
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
          vec4 designColor = texture2D(designMap, vUv);
          vec2 canvasUv = (vWorldPosition.xy + canvasSize * 0.5) / canvasSize;
          canvasUv.y = 1.0 - canvasUv.y;

          float maskAlpha = texture2D(alphaMap, canvasUv).r;
          float finalAlpha = designColor.a * maskAlpha;

          if (finalAlpha <= 0.0) discard;
          gl_FragColor = vec4(designColor.rgb, finalAlpha);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
      //   premultipliedAlpha: true,
    });

    return mat;
  }, [designTexture, alphaTexture, canvasWidth, canvasHeight]);

  return {
    backgroundTexture,
    material,
    isLoading, // 🔹 New loading flag
    isBackgroundLoading,
    isAlphaLoading,
    alphaTexture,
  };
}
