"use client";
import React, { RefObject, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { supabase } from "@/lib/supabaseClient";
import * as THREE from "three";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";

interface Props {
  mockupId: string;
  glRef: RefObject<THREE.WebGLRenderer | null>;
}

function SettingsPanel({ mockupId, glRef }: Props) {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const layers = useLayersStore((state) => state.layers);
  const updateLayer = useLayersStore((state) => state.updateLayer);
  const global = useGlobalSettingsStore();

  const handlePublish = async () => {
    if (!glRef.current) return;

    setIsPublishing(true);
    setPublishStatus("idle");

    try {
      // Get the canvas data URL
      const dataUrl = glRef.current.domElement.toDataURL("image/png");

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Generate unique filename
      const baseFileName = `${global.name}.png`;
      let fileName = baseFileName;
      let counter = 1;

      // Check if file exists and generate unique name
      const { data: existingFiles } = await supabase.storage
        .from("files")
        .list("thumbnails", {
          search: baseFileName.replace(".png", ""),
        });

      if (existingFiles && existingFiles.length > 0) {
        const existingNames = existingFiles.map((file) => file.name);
        while (existingNames.includes(fileName)) {
          fileName = `${global.name}_${counter}.png`;
          counter++;
        }
      }
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("files")
        .upload(`thumbnails/${fileName}`, blob, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("files")
        .getPublicUrl(`thumbnails/${fileName}`);

      const previewUrl = publicUrlData.publicUrl;

      // Update mockups table
      const { error: updateError } = await supabase
        .from("mockups")
        .update({ preview_url: previewUrl })
        .eq("id", mockupId);

      if (updateError) {
        throw new Error(`Update failed: ${updateError.message}`);
      }

      console.log("Successfully uploaded and updated preview URL:", previewUrl);
      setPublishStatus("success");
      setTimeout(() => setPublishStatus("idle"), 2000);
    } catch (error) {
      console.error("Error publishing image:", error);
      setPublishStatus("error");
      // Handle error (show toast, etc.)
    } finally {
      setIsPublishing(false);
    }
  };

  // Helper to safely get intensity values (fallback to 0 if undefined)
  const getIntensity = (value: number | undefined): number => {
    return typeof value === "number" ? Math.min(Math.max(value, 0), 5) : 0;
  };

  const handleSave = async () => {
    if (!supabase) return;

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Get mockup ID from URL or global state (adjust as needed)
      if (!mockupId) throw new Error("Mockup ID not found");

      // Prepare updates: only include layers that have changed
      const updates = layers.map((layer) => ({
        layer_id: layer.id,
        noise_threshold: layer.noiseThreshold ?? 0,
        highlights_intensity: layer.highlightsIntensity ?? 0,
        shadow_intensity: layer.shadowIntensity ?? 0,
      }));

      const { error } = await supabase.rpc("update_mockup_layers", {
        p_mockup_id: mockupId,
        p_updates: updates,
      });

      if (error) throw error;

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="bg-neutral-700 rounded-md px-5 py-2 uppercase text-sm overflow-hidden cursor-pointer text-white"
        aria-expanded={showPanel}
        aria-haspopup="dialog"
      >
        settings
      </button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-16 right-0 bg-white min-h-20 min-w-96 max-w-full p-6 rounded-md shadow-lg border border-neutral-200 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Settings panel"
          >
            <button
              onClick={() => setShowPanel(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
              aria-label="Close settings panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="pt-2 space-y-6 max-h-96 overflow-y-auto pr-2">
              {layers.map((layer) => {
                const shadow = getIntensity(layer.shadowIntensity);
                const highlight = getIntensity(layer.highlightsIntensity);
                const noise = getIntensity(layer.noiseThreshold);

                return (
                  <div key={layer.id} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Layer {layer.id}
                    </h3>

                    {/* Shadow Intensity */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Shadow</span>
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                          {shadow.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.01"
                        value={shadow}
                        onChange={(e) =>
                          updateLayer(layer.id, {
                            shadowIntensity: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        aria-label={`Shadow intensity for layer ${layer.id}`}
                      />
                    </div>

                    {/* Highlight Intensity */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Highlight</span>
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                          {highlight.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.01"
                        value={highlight}
                        onChange={(e) =>
                          updateLayer(layer.id, {
                            highlightsIntensity: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        aria-label={`Highlight intensity for layer ${layer.id}`}
                      />
                    </div>

                    {/* Noise threshold */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Noise</span>
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                          {noise.toFixed(3)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.1"
                        step="0.001"
                        value={noise}
                        onChange={(e) =>
                          updateLayer(layer.id, {
                            noiseThreshold: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        aria-label={`Noise threshold for layer ${layer.id}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center space-x-2">
              <button
                onClick={handleSave}
                disabled={isSaving || isPublishing}
                className="px-4 py-2 bg-primary hover:bg-primary/70 cursor-pointer uppercase text-white rounded-md text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  "Save to Cloud"
                )}
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || isSaving}
                className="px-4 py-2 bg-primary hover:bg-primary/70 cursor-pointer uppercase text-white rounded-md text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <span className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></span>
                    Publishing...
                  </>
                ) : (
                  "Publish Preview"
                )}
              </button>
            </div>

            {/* Status Feedback */}
            {saveStatus === "success" && (
              <div className="mt-2 text-green-600 text-sm text-center">
                ✅ Settings saved!
              </div>
            )}
            {saveStatus === "error" && (
              <div className="mt-2 text-red-600 text-sm text-center">
                ❌ Failed to save settings. Please try again.
              </div>
            )}
            {publishStatus === "success" && (
              <div className="mt-2 text-green-600 text-sm text-center">
                ✅ Preview saved!
              </div>
            )}
            {publishStatus === "error" && (
              <div className="mt-2 text-red-600 text-sm text-center">
                ❌ Failed to save preview. Please try again.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SettingsPanel;
