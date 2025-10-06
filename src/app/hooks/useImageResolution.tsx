"use client";

import { useEffect, useState } from "react";

type ImageResolutionState = {
  width: number | null;
  height: number | null;
  loading: boolean;
  error: string | null;
};

export function useImageResolution(src: string | null) {
  const [state, setState] = useState<ImageResolutionState>({
    width: null,
    height: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!src) {
      setState({
        width: null,
        height: null,
        loading: false,
        error: "No source provided",
      });
      return;
    }

    setState({ width: null, height: null, loading: true, error: null });

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setState({
        width: img.naturalWidth,
        height: img.naturalHeight,
        loading: false,
        error: null,
      });
    };

    img.onerror = () => {
      setState({
        width: null,
        height: null,
        loading: false,
        error: "Failed to load image",
      });
    };
  }, [src]);

  return state;
}
