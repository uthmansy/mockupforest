"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FileUpload from "./FileUpload";
import Picker from "./Picker";
import { useSidebarStore } from "@/app/stores/useSidebarStore";
import { SlArrowRight } from "react-icons/sl";

export default function Sidebar() {
  const layers = useSidebarStore((state) => state.sidebarLayers);
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);

  useEffect(() => {
    if (layers.length > 0 && expandedLayer === null) {
      setExpandedLayer(layers[0].id);
    }
  }, [layers]);

  const toggleLayer = (layerId: number) => {
    setExpandedLayer((prev) => (prev === layerId ? null : layerId));
  };

  const collapseAllLayers = () => {
    setExpandedLayer(null);
  };

  return (
    <aside className="w-full rounded-lg overflow-hidden h-full shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 pt-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-medium uppercase">Layers</span>
          <span className="text-sm px-2 py-1 rounded">
            {layers.length} layer{layers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Collapse Control */}
        {/* <div className="flex gap-2">
          <button
            onClick={collapseAllLayers}
            disabled={expandedLayer === null}
            className="text-xs px-3 py-1.5 rounded-md bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Collapse All
          </button>
        </div> */}
      </div>

      {/* Layers List */}
      <div className="h-full overflow-y-auto">
        {layers.map((layer) => {
          const isExpanded = expandedLayer === layer.id;
          const isDesignLayer = layer.type === "design";

          return (
            <div
              key={layer.id}
              className="border-b border-white/10 last:border-0"
            >
              {/* Layer Header */}
              <button
                onClick={() => toggleLayer(layer.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left transition-colors group"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    className="h-4 w-4"
                    transition={{ duration: 0.2 }}
                  >
                    <SlArrowRight className="text-sm" />
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm uppercase truncate flex items-center">
                      Layer{" "}
                      <span className="text-xs text-neutral-600 px-2 py-0.5 bg-neutral-200 mx-3 rounded">
                        {layer.id}
                      </span>{" "}
                      [{layer.name}]
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      isDesignLayer
                        ? "bg-blue-500/20 border border-blue-500 text-blue-500"
                        : "bg-purple-500/20 border border-purple-500 text-purple-500"
                    }`}
                  >
                    {isDesignLayer ? "Design" : "Color"}
                  </span>
                </div>
              </button>

              {/* Layer Content - Always mounted but conditionally styled */}
              <div
                className={`transition-all duration-200 ${
                  isExpanded
                    ? "opacity-100 max-h-96 overflow-visible"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <div className="p-4 pl-12 border-t border-neutral-300 bg-neutral-200">
                  {isDesignLayer ? (
                    <FileUpload layerId={layer.id} label="Your Design" />
                  ) : (
                    <Picker layerId={layer.id} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {layers.length === 0 && (
        <div className="p-8 text-center text-neutral-400">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">No layers available</p>
        </div>
      )}
    </aside>
  );
}
