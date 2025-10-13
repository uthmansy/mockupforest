import { Area } from "react-easy-crop";
import { create } from "zustand";
import * as THREE from "three";

interface Group {
  id: number;
  name: string;
}

export interface Layer {
  id: number;
  name: string;
  height: number;
  width: number;
  design?: string | null;
  uvPass?: string;
  mask: string;
  zIndex: number;
  groupId?: number | null;
  crop: { x: number; y: number };
  croppedAreaPixels?: Area | null;
  croppedArea?: Area | null;
  zoom?: number;
  type: "design" | "color";
  color?: string;
}

interface GlobalSettings {
  base: string;
  uv: string;
  brightness: number;
  contrast: number;
  highlightsIntensity: number;
  // cached textures
  uvTexture?: THREE.Texture | null;
  baseTexture?: THREE.Texture | null;
}

interface LayersState {
  layers: Layer[];
  groups: Group[];
  global: GlobalSettings;
  loading: boolean;

  // Layer actions
  setLayers: (layers: Layer[]) => void;
  addLayer: (layer: Layer) => void;
  updateLayer: (id: number, updates: Partial<Layer>) => void;
  removeLayer: (id: number) => void;

  // Group actions
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  updateGroup: (id: number, updates: Partial<Group>) => void;
  removeGroup: (id: number) => void;
  assignLayerToGroup: (layerId: number, groupId: number | null) => void;

  // Global settings actions
  updateGlobal: (updates: Partial<GlobalSettings>) => void;

  // texture setters
  setUvTexture: (texture: THREE.Texture | null) => void;
  setBaseTexture: (texture: THREE.Texture | null) => void;

  // Loading
  setLoading: (loading: boolean) => void;
}

export const useLayersStore = create<LayersState>((set) => ({
  layers: [
    {
      id: 1,
      name: "design",
      design: "/editor/design-layout.jpg",
      height: 1500,
      width: 2000,
      mask: "/editor/bottleMask-1.jpg",
      zIndex: 2,
      groupId: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      type: "design",
    },
    {
      id: 2,
      name: "color",
      height: 1500,
      width: 2000,
      mask: "/editor/bottleMask-2.jpg",
      zIndex: 1,
      groupId: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      type: "color",
      color: "#0000ff",
    },
  ],
  groups: [{ id: 1, name: "Default Group" }],
  loading: true,

  // ✅ Global default values
  global: {
    base: "/editor/bottleBeauty-2.jpg",
    uv: "/editor/bottleUv.exr",
    brightness: 1.0,
    contrast: 1.0,
    highlightsIntensity: 2.7,
    uvTexture: null,
    baseTexture: null,
  },

  // Layer actions
  setLayers: (layers) => set({ layers }),
  addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),
  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
    })),

  // Group actions
  setGroups: (groups) => set({ groups }),
  addGroup: (group) =>
    set((state) => ({
      groups: [...state.groups, group],
    })),
  updateGroup: (id, updates) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === id ? { ...group, ...updates } : group
      ),
    })),
  removeGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
      layers: state.layers.map((layer) =>
        layer.groupId === id ? { ...layer, groupId: null } : layer
      ),
    })),
  assignLayerToGroup: (layerId, groupId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, groupId } : layer
      ),
    })),

  // ✅ Global update action
  updateGlobal: (updates) =>
    set((state) => ({
      global: { ...state.global, ...updates },
    })),

  setUvTexture: (texture) =>
    set((state) => ({
      global: { ...state.global, uvTexture: texture },
    })),

  setBaseTexture: (texture) =>
    set((state) => ({
      global: { ...state.global, baseTexture: texture },
    })),

  // Loading
  setLoading: (loading) => set({ loading }),
}));
