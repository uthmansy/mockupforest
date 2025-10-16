"use client";

import { useLayersStore } from "@/app/stores/useLayersStore";
import React, { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { SlLayers } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  layerId: number;
}

function Picker({ layerId }: Props) {
  const layer = useLayersStore((s) => s.layers.find((l) => l.id === layerId));
  const { updateLayer } = useLayersStore();

  const [inputValue, setInputValue] = useState(layer?.color || "#ffffff");
  const [showPicker, setShowPicker] = useState(false);

  const pickerBoxRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layer?.color && layer.color !== inputValue) {
      setInputValue(layer.color);
    }
  }, [layer?.color]);

  // ✅ Hide picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(target) &&
        pickerBoxRef.current &&
        !pickerBoxRef.current.contains(target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(val)) {
      updateLayer(layerId, { color: val });
    }
  };

  if (!layer) return null;

  return (
    <div className="flex flex-col gap-2 w-full p-6 my-5 md:p-0">
      <h5 className="uppercase text-sm flex items-center space-x-2">
        <SlLayers className="text-lg" />
        <span className="flex-1 truncate">{layer.name}</span>
      </h5>

      <div className="relative">
        <div className="flex space-x-4" ref={pickerBoxRef}>
          <div
            style={{ background: inputValue }}
            className="w-14 h-14 cursor-pointer rounded-md"
            onClick={() => setShowPicker((prev) => !prev)}
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-4 bg-neutral-600 hover:bg-neutral-700 transition-all duration-75 cursor-pointer rounded-md text-sm text-white/50 flex-1"
            placeholder="#RRGGBB"
          />
        </div>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              ref={colorPickerRef}
              key="colorPicker"
              className="
                absolute 
                z-50 
                md:top-full md:mt-2 
                -top-[220px] md:-top-auto w-max
              "
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <HexColorPicker
                color={layer.color}
                onChange={(color) => handleInputChange(color)}
                className="rounded-lg shadow-lg w-full h-[120px]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Picker;
