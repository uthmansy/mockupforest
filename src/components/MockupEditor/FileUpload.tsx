"use client";

import { useLayersStore } from "@/app/stores/useLayersStore";
import { useState } from "react";
import Cropper from "react-easy-crop";

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

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  //@ts-ignore
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
  };

  return (
    <div className="mb-4">
      {/* <label className="block text-sm font-medium mb-2">{label}</label> */}
      <input
        type="file"
        accept={accept}
        onChange={createFileHandler((result) => {
          updateLayer(layerId, { design: result.src });
        })}
        className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 transition-all duration-75 cursor-pointer rounded-md text-sm text-white/50"
      />
      <div className="relative aspect-4/3 my-5">
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <Cropper
            image={layer.design || undefined}
            crop={layer.crop}
            zoom={layer.zoom}
            aspect={4 / 3}
            onCropChange={(crop) => {
              setCrop(crop);
              updateLayer(layerId, { crop });
            }}
            onCropAreaChange={(croppedAreaPixels, croppedArea) => {
              updateLayer(layerId, { croppedAreaPixels, croppedArea });
            }}
            onZoomChange={(zoom) => {
              setZoom(zoom);
              updateLayer(layerId, { zoom });
            }}
          />
        </div>
      </div>
    </div>
  );
}
