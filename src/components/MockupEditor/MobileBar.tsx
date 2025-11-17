"use client";

import React, { useMemo } from "react";
import FileUpload from "./FileUpload";
import Picker from "./Picker";
import { SidebarLayer, useSidebarStore } from "@/app/stores/useSidebarStore";
import { IoColorFilter } from "react-icons/io5";
import { MdImage } from "react-icons/md";

function MobileBar() {
  const layers = useSidebarStore((state) => state.sidebarLayers);
  const [currentLayerId, setCurrentLayerId] = React.useState<number>(1);

  // Use useMemo to efficiently find the current layer
  const currentLayer = useMemo(
    () => layers.find((layer) => layer.id === currentLayerId) || null,
    [currentLayerId, layers]
  );

  // Handler for tab navigation
  const handleTabClick = (layerId: number) => {
    setCurrentLayerId(layerId);
  };

  // Icon configuration to avoid conditional rendering in JSX
  const layerIcons = {
    color: IoColorFilter,
    background: IoColorFilter,
    design: MdImage,
  };

  return (
    <div className="mobile-bar relative">
      {/* Content Area */}
      <div className="mobile-bar__content">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`mobile-bar__panel ${
              layer.id === currentLayerId
                ? "mobile-bar__panel--active"
                : "mobile-bar__panel--inactive"
            }`}
            role="tabpanel"
            aria-hidden={layer.id !== currentLayerId}
          >
            {layer.type === "design" ? (
              <FileUpload layerId={layer.id} label="Your Design" />
            ) : (
              <Picker layerId={layer.id} />
            )}
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <nav className="mobile-bar__navigation overflow-y-auto" role="tablist">
        {layers.map((layer) => {
          const IconComponent = layerIcons[layer.type];
          const isActive = layer.id === currentLayerId;

          return (
            <button
              key={layer.id}
              className={`mobile-bar__tab ${
                isActive
                  ? "mobile-bar__tab--active"
                  : "mobile-bar__tab--inactive"
              }`}
              onClick={() => handleTabClick(layer.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${layer.id}`}
            >
              <span className="mobile-bar__tab-content">
                <IconComponent
                  className="mobile-bar__tab-icon"
                  aria-hidden="true"
                />
                <span className="mobile-bar__tab-label">{layer.name}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default MobileBar;
