"use client";

import { useLayersStore } from "@/app/stores/useLayersStore";
import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface Props {
  layerId: number;
}

function Picker({ layerId }: Props) {
  const layer = useLayersStore((s) => s.layers.find((l) => l.id === layerId));
  const { updateLayer } = useLayersStore();

  // Local input state to avoid flickering while typing
  const [inputValue, setInputValue] = useState(layer?.color || "#ffffff");

  // Keep input in sync if layer color changes externally
  useEffect(() => {
    if (layer?.color && layer.color !== inputValue) {
      setInputValue(layer.color);
    }
  }, [layer?.color]);

  const handleInputChange = (val: string) => {
    setInputValue(val);

    // Only update layer if valid hex
    if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(val)) {
      updateLayer(layerId, { color: val });
    }
  };

  if (!layer) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Visual color picker */}
      <HexColorPicker
        style={{ width: "100%", borderRadius: 0 }}
        color={layer.color}
        onChange={(color) => handleInputChange(color)}
      />

      {/* Manual hex input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 transition-all duration-75 cursor-pointer rounded-md text-sm text-white/50"
        placeholder="#RRGGBB"
      />
    </div>
  );
}

export default Picker;
