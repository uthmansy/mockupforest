"use client";

import { useLayersStore } from "@/app/stores/useLayersStore";
import { useState } from "react";
import Cropper from "react-easy-crop";
import { SlLayers } from "react-icons/sl";

interface FileUploadProps {
  label: string;
  accept?: string;
  layerId: number;
}

export default function FileUpload({
  label,
  accept = "image/*",
  layerId,
}: FileUploadProps) {
  const { updateLayer } = useLayersStore();
  const layer = useLayersStore(
    (s) => s.layers.filter((l) => l.id === layerId)[0]
  );
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

  //@ts-ignore
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
  };

  return (
    <div className="md:mb-4 p-6 md:p-0">
      {/* <label className="block text-sm font-medium mb-2">{label}</label> */}
      <div className="my-5">
        <h5 className="uppercase text-sm flex items-center space-x-2">
          <SlLayers className="text-lg" />
          <span className="flex-1 truncate">{layer.name}</span>
        </h5>
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
          image={layer.design || undefined}
          crop={layer.crop}
          zoom={layer.zoom}
          aspect={4 / 3}
          onCropChange={(crop) => {
            updateLayer(layerId, { crop });
          }}
          onCropAreaChange={(croppedAreaPixels, croppedArea) => {
            updateLayer(layerId, { croppedAreaPixels, croppedArea });
          }}
          onZoomChange={(zoom) => {
            updateLayer(layerId, { zoom });
          }}
        />
      </div>
      <input
        type="file"
        accept={accept}
        onChange={createFileHandler((result) => {
          updateLayer(layerId, { design: result.src });
        })}
        className="w-full p-4 bg-neutral-600 hover:bg-neutral-700 transition-all duration-75 cursor-pointer rounded-md text-sm text-white/50 relative"
      />
    </div>
  );
}
