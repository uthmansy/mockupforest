// app/stores/useLayersStore.ts
import { create } from "zustand";
import type { Area } from "react-easy-crop";

export interface Group {
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
  aspectRatio?: number;
  noiseThreshold: number;
  highlightsIntensity?: number;
  shadowIntensity?: number;
}

export interface LayersState {
  layers: Layer[];
  groups: Group[];
  loading: boolean;
  baseAndUvLoading: boolean;
  designLoadings: Record<number, boolean>;
  colorLoadings: Record<number, boolean>;

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

  // Loading
  setLoading: (loading: boolean) => void;
  setBaseAndUvLoading: (baseAndUvLoading: boolean) => void;
  setDesignLoading: (id: number, isLoading: boolean) => void;
  setColorLoading: (id: number, isLoading: boolean) => void;
  clearAllDesignLoadings: () => void;
  clearAllColorLoadings: () => void;
}

export const useLayersStore = create<LayersState>((set) => ({
  layers: [],
  groups: [],
  loading: true,
  baseAndUvLoading: true,
  designLoadings: {},
  colorLoadings: {},

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
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
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

  // Loading
  setLoading: (loading) => set({ loading }),
  setBaseAndUvLoading: (baseAndUvLoading) => set({ baseAndUvLoading }),
  setDesignLoading: (id, isLoading) =>
    set((state) => ({
      designLoadings: { ...state.designLoadings, [id]: isLoading },
    })),
  setColorLoading: (id, isLoading) =>
    set((state) => ({
      colorLoadings: { ...state.colorLoadings, [id]: isLoading },
    })),

  clearAllDesignLoadings: () => set({ designLoadings: {} }),
  clearAllColorLoadings: () => set({ colorLoadings: {} }),
}));
