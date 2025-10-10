// stores/useLayersStore.ts
import { Area } from "react-easy-crop";
import { create } from "zustand";

interface Group {
  id: number;
  name: string;
}

interface Layer {
  id: number;
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

interface LayersState {
  layers: Layer[];
  groups: Group[];
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

  // Loading actions
  setLoading: (loading: boolean) => void;
}

export const useLayersStore = create<LayersState>((set) => ({
  layers: [
    {
      id: 1,
      design: "/editor/design-layout.jpg",
      height: 1500,
      width: 2000,
      mask: "/editor/mask.jpg",
      uvPass: "/editor/u.exr",
      zIndex: 1,
      groupId: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      type: "design",
    },
    {
      id: 2,
      height: 1500,
      width: 2000,
      mask: "/editor/mask.jpg",
      zIndex: 2,
      groupId: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      type: "color",
      color: "#0000ff",
    },
  ],
  groups: [{ id: 1, name: "Default Group" }],
  loading: true, // default to true until textures are ready

  // Layer actions
  setLayers: (layers) => set({ layers }),
  addLayer: (layer) =>
    set((state) => ({
      layers: [...state.layers, layer],
    })),
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

  // Loading
  setLoading: (loading) => set({ loading }),
}));
