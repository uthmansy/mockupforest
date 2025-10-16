import { create } from "zustand";
import type { Layer } from "@/app/stores/useLayersStore";

export interface SidebarLayer {
  id: number;
  type: "design" | "color";
  name: string;
}

interface SidebarState {
  sidebarLayers: SidebarLayer[];

  // Core actions
  setSidebarLayers: (layers: SidebarLayer[]) => void;
  addSidebarLayer: (layer: SidebarLayer) => void;
  removeSidebarLayer: (id: number) => void;
  updateSidebarLayer: (id: number, updates: Partial<SidebarLayer>) => void;

  // 🔄 Sync with Layers store
  syncWithLayers: (layers: Layer[]) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  sidebarLayers: [],

  setSidebarLayers: (layers) => set({ sidebarLayers: layers }),

  addSidebarLayer: (layer) =>
    set((state) => ({
      sidebarLayers: [...state.sidebarLayers, layer],
    })),

  removeSidebarLayer: (id) =>
    set((state) => ({
      sidebarLayers: state.sidebarLayers.filter((l) => l.id !== id),
    })),

  updateSidebarLayer: (id, updates) =>
    set((state) => ({
      sidebarLayers: state.sidebarLayers.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),

  // 🔄 Automatically sync from main layers
  syncWithLayers: (layers) =>
    set(() => ({
      sidebarLayers: layers.map((l) => ({
        id: l.id,
        type: l.type,
        name: l.name,
      })),
    })),
}));
