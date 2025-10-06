import { ChangeEvent } from "react";
import * as THREE from "three";

export interface NormalizedBox {
  topLeft: [number, number];
  topRight: [number, number];
  bottomRight: [number, number];
  bottomLeft: [number, number];
}

export interface MockupSceneProps {}

// types.ts
export interface SidebarProps {
  designImage: File | null;
  designPreview: string | null;
  onDesignUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface CanvasAreaProps {
  designImage: File | null;
  baseImage: File | null;
  uvMap: File | null;
  normalMap: File | null;
  maskMap: File | null;
  isLoading: boolean;
}

// Type for a normalized 2D point (x, y in 0..1)
export type NormalizedPoint = [number, number];

// Type for a normalized quadrilateral
export interface NormalizedQuad {
  topLeft: NormalizedPoint;
  topRight: NormalizedPoint;
  bottomRight: NormalizedPoint;
  bottomLeft: NormalizedPoint;
}
