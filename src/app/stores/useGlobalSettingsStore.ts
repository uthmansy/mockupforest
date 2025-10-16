// app/stores/useGlobalSettingsStore.ts
import { create } from "zustand";
import * as THREE from "three";

export interface GlobalSettings {
  base: string;
  uv: string;
  brightness: number;
  contrast: number;
  highlightsIntensity: number;
  // cached textures
  uvTexture: THREE.Texture | null;
  baseTexture: THREE.Texture | null;
  name: string;
  canvasWidth: number;
  canvasHeight: number;
}

interface GlobalSettingsState extends GlobalSettings {
  // Actions
  updateGlobal: (updates: Partial<GlobalSettings>) => void;
  setUvTexture: (texture: THREE.Texture | null) => void;
  setBaseTexture: (texture: THREE.Texture | null) => void;
}

export const useGlobalSettingsStore = create<GlobalSettingsState>((set) => ({
  // Initial values
  base: "",
  uv: "",
  name: "coffee cup mockup",
  canvasWidth: 1,
  canvasHeight: 1,
  brightness: 1.0,
  contrast: 1.0,
  highlightsIntensity: 2.7,
  uvTexture: null,
  baseTexture: null,

  // Actions
  updateGlobal: (updates) => set((state) => ({ ...state, ...updates })),

  setUvTexture: (texture) => set({ uvTexture: texture }),

  setBaseTexture: (texture) => set({ baseTexture: texture }),
}));
