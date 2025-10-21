"use client";

import React, { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import Picker from "./Picker";
import { SidebarLayer, useSidebarStore } from "@/app/stores/useSidebarStore";
import { IoColorFilter } from "react-icons/io5";
import { MdImage } from "react-icons/md";

function MobileBar() {
  const layers = useSidebarStore((state) => state.sidebarLayers);
  const [currentLayerId, setCurrentLayerId] = useState<number>(1);
  const [currentLayer, setCurrentLayer] = useState<SidebarLayer | null>(null);

  useEffect(() => {
    setCurrentLayer(layers.filter((l) => l.id === currentLayerId)[0]);
  }, [currentLayerId, layers]);

  return (
    <>
      <div className="min-h-max text-white fixed bottom-24 right-0 left-0 z-10 bg-inherit">
        {layers.map((layer) => {
          return layer.type === "design" ? (
            <div
              key={layer.id}
              className={`${
                layer.id === currentLayerId
                  ? "visible relative"
                  : "invisible absolute"
              }`}
            >
              <FileUpload layerId={layer.id} label="Your Design" />
            </div>
          ) : (
            <div
              key={layer.id}
              className={`${
                layer.id === currentLayerId
                  ? "visible relative"
                  : "invisible absolute"
              }`}
            >
              <Picker layerId={layer.id} />
            </div>
          );
        })}
      </div>
      <div className="h-24 border-white/40 border-t flex items-center justify-center space-x-8 text-white">
        {layers.map((layer) => {
          return (
            <div key={layer.id} onClick={() => setCurrentLayerId(layer.id)}>
              <h5
                className={`uppercase  flex flex-col items-center space-y-2 ${
                  layer.id === currentLayerId ? "text-white" : "text-white/50"
                }`}
              >
                {layer.type === "color" ? (
                  <IoColorFilter className="text-2xl" />
                ) : (
                  <MdImage className="text-2xl" />
                )}
                <span className="flex-1 truncate text-xs">{layer.name}</span>
              </h5>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default MobileBar;
