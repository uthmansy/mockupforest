"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLayersStore } from "@/app/stores/useLayersStore";
import Cropper, { Area } from "react-easy-crop";
import { SlLayers } from "react-icons/sl";

interface FileUploadProps {
  label: string;
  accept?: string;
  layerId: number;
}

export default function FileUpload({
  layerId,
  accept,
}: // label,
FileUploadProps) {
  const { updateLayer } = useLayersStore();

  // Single selector to read the whole layer object (stable)
  const layer = useLayersStore((state) =>
    state.layers.find((l) => l.id === layerId)
  );

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaPixelsRef = useRef<Area | null | undefined>(null);

  //@ts-ignore
  const handleCropChange = (croppedArea, croppedAreaPixels) => {
    if (
      crop &&
      typeof crop.x === "number" &&
      typeof crop.y === "number" &&
      !isNaN(crop.x) &&
      !isNaN(crop.y) &&
      isFinite(crop.x) &&
      isFinite(crop.y)
    ) {
      if (
        JSON.stringify(croppedAreaPixelsRef.current) ===
        JSON.stringify(croppedAreaPixels)
      )
        return;
      updateLayer(layerId, { croppedAreaPixels, croppedArea });
      croppedAreaPixelsRef.current = croppedAreaPixels;
    } else {
      setCrop({ x: 0, y: 0 });
      return;
    }
  };

  // File input handler
  const createFileHandler =
    (
      onResult: (result: {
        file: File | null;
        src: string | null;
        preview: string | null;
      }) => void
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      if (!file) {
        onResult({ file: null, src: null, preview: null });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        onResult({ file, src, preview: src });
      };
      reader.onerror = () => {
        console.error("Error reading file");
        onResult({ file: null, src: null, preview: null });
      };
      reader.readAsDataURL(file);
    };

  return (
    <div className="md:mb-4 p-6 md:p-0">
      <div className="my-5">
        <h5 className="uppercase text-sm flex items-center space-x-2">
          <SlLayers className="text-lg" />
          <span className="flex-1 truncate">{layer?.name}</span>
        </h5>

        {layer?.design && layer?.aspectRatio && (
          <Cropper
            classes={{ containerClassName: "bg-white" }}
            style={{
              containerStyle: {
                borderRadius: "5px",
                height: 120,
                width: "100%",
                position: "relative",
              },
            }}
            image={layer?.design || undefined}
            crop={crop}
            zoom={zoom}
            aspect={layer?.aspectRatio}
            onCropChange={setCrop}
            onCropAreaChange={handleCropChange}
            onZoomChange={setZoom}
          />
        )}
      </div>

      <input
        type="file"
        accept={accept}
        onChange={createFileHandler((result) => {
          if (!result.src) return;
          updateLayer(layerId, { design: result.src });
        })}
        className="w-full p-4 bg-neutral-600 hover:bg-neutral-700 transition-all duration-75 cursor-pointer rounded-md text-sm text-white/50 relative"
      />
    </div>
  );
}
