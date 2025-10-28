"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FileUpload from "./FileUpload";
import Picker from "./Picker";
import { useSidebarStore } from "@/app/stores/useSidebarStore";

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
    <aside className="w-full text-white bg-neutral-800 rounded-lg overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-neutral-900 pt-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-medium uppercase">Layers</span>
          <span className="text-sm text-gray-400 bg-neutral-700 px-2 py-1 rounded">
            {layers.length} layer{layers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Collapse Control */}
        <div className="flex gap-2">
          <button
            onClick={collapseAllLayers}
            disabled={expandedLayer === null}
            className="text-xs px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-md text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Collapse All
          </button>
        </div>
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
                className="w-full px-4 py-3 bg-neutral-750 hover:bg-neutral-700 flex items-center justify-between text-left transition-colors group"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <motion.svg
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400 group-hover:text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                  <div className="flex items-center gap-2">
                    <span className="text-sm uppercase text-white truncate">
                      Layer{" "}
                      <span className="text-xs text-gray-400 bg-neutral-600 px-2 py-0.5 rounded mx-3">
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
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-purple-500/20 text-purple-300"
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
                <div className="p-4 border-t border-white/10">
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
        <div className="p-8 text-center text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-600"
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
