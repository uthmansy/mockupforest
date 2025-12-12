"use client";
import React, { RefObject, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayersStore } from "@/app/stores/useLayersStore";
import { supabase } from "@/lib/supabaseClient";
import * as THREE from "three";
import { useGlobalSettingsStore } from "@/app/stores/useGlobalSettingsStore";
import { getMockupById } from "@/app/lib/utils";
import { Mockup } from "@/types/db";

interface Props {
  mockupId: string;
  glRef: RefObject<THREE.WebGLRenderer | null>;
}

// Predefined categories list
const PREDEFINED_CATEGORIES = [
  "devices",
  "posters",
  "packaging",
  "branding",
  "cosmetics",
  "stationery",
];

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
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState({
    layers: true,
    global: false,
  });
  const [isLoadingMockup, setIsLoadingMockup] = useState<boolean>(false);
  const [mockupError, setMockupError] = useState<string | null>(null);
  const [mockup, setMockup] = useState<Mockup | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const layers = useLayersStore((state) => state.layers);
  const updateLayer = useLayersStore((state) => state.updateLayer);
  const global = useGlobalSettingsStore();

  useEffect(() => {
    const getMockup = async () => {
      setIsLoadingMockup(true);
      try {
        const mockup = await getMockupById(mockupId);
        setMockup(mockup);

        // Initialize selected categories from mockup data
        if (mockup?.categories) {
          setSelectedCategories(new Set(mockup.categories));
        }

        setIsLoadingMockup(false);
        setMockupError(null);
      } catch (error) {
        setMockupError(error as string);
        setIsLoadingMockup(false);
      }
    };
    getMockup();
  }, [mockupId]);

  const toggleSection = (section: "layers" | "global") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleLayer = (layerId: number) => {
    setExpandedLayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const addCustomCategory = (category: string) => {
    const trimmedCategory = category.trim();
    if (trimmedCategory && !selectedCategories.has(trimmedCategory)) {
      setSelectedCategories((prev) => new Set(prev).add(trimmedCategory));
    }
    setSearchTerm("");
  };

  const removeCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.delete(category);
      return newSet;
    });
  };

  const expandAllLayers = () => {
    setExpandedLayers(new Set(layers.map((layer) => layer.id)));
  };

  const collapseAllLayers = () => {
    setExpandedLayers(new Set());
  };

  // const handlePublish = async () => {
  //   if (!glRef.current) return;

  //   setIsPublishing(true);
  //   setPublishStatus("idle");

  //   try {
  //     // 1️⃣ Capture the image from WebGL canvas
  //     const canvas = glRef.current.domElement;
  //     const originalWidth = canvas.width;
  //     const originalHeight = canvas.height;

  //     // 2️⃣ Create an offscreen canvas for resizing/compression
  //     const maxSize = 2000;
  //     let targetWidth = originalWidth;
  //     let targetHeight = originalHeight;

  //     if (originalWidth > originalHeight && originalWidth > maxSize) {
  //       targetWidth = maxSize;
  //       targetHeight = Math.round((originalHeight * maxSize) / originalWidth);
  //     } else if (originalHeight > maxSize) {
  //       targetHeight = maxSize;
  //       targetWidth = Math.round((originalWidth * maxSize) / originalHeight);
  //     }

  //     const offscreen = document.createElement("canvas");
  //     offscreen.width = targetWidth;
  //     offscreen.height = targetHeight;

  //     const ctx = offscreen.getContext("2d");
  //     ctx?.drawImage(canvas, 0, 0, targetWidth, targetHeight);

  //     // 3️⃣ Convert to JPEG with compression (quality 0.75 = good balance)
  //     const dataUrl = offscreen.toDataURL("image/jpeg", 0.9);

  //     // 4️⃣ Convert Data URL to Blob
  //     const response = await fetch(dataUrl);
  //     const blob = await response.blob();

  //     // 5️⃣ Generate a unique filename
  //     const baseFileName = `${global.name}.jpg`;
  //     let fileName = baseFileName;
  //     let counter = 1;

  //     const { data: existingFiles } = await supabase.storage
  //       .from("files")
  //       .list("thumbnails", {
  //         search: baseFileName.replace(".jpg", ""),
  //       });

  //     if (existingFiles && existingFiles.length > 0) {
  //       const existingNames = existingFiles.map((file) => file.name);
  //       while (existingNames.includes(fileName)) {
  //         fileName = `${global.name}_${counter}.jpg`;
  //         counter++;
  //       }
  //     }

  //     // 6️⃣ Upload compressed JPG
  //     const { data: uploadData, error: uploadError } = await supabase.storage
  //       .from("files")
  //       .upload(`thumbnails/${fileName}`, blob, {
  //         contentType: "image/jpeg",
  //         upsert: true,
  //       });

  //     if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  //     // 7️⃣ Get the public URL
  //     const { data: publicUrlData } = supabase.storage
  //       .from("files")
  //       .getPublicUrl(`thumbnails/${fileName}`);

  //     const previewUrl = publicUrlData.publicUrl;

  //     // 8️⃣ Update mockup record
  //     const { error: updateError } = await supabase
  //       .from("mockups")
  //       .update({ preview_url: previewUrl })
  //       .eq("id", mockupId);

  //     if (updateError) throw new Error(`Update failed: ${updateError.message}`);

  //     setPublishStatus("success");
  //     setTimeout(() => setPublishStatus("idle"), 2000);
  //   } catch (error) {
  //     console.error("Error publishing image:", error);
  //     setPublishStatus("error");
  //   } finally {
  //     setIsPublishing(false);
  //   }
  // };

  const handlePublish = async () => {
    if (!glRef.current) return;

    setIsPublishing(true);
    setPublishStatus("idle");

    try {
      // 1️⃣ Capture image from WebGL canvas
      const canvas = glRef.current.domElement;
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;

      // 2️⃣ Create an offscreen canvas for resizing/compression
      const maxSize = 2000;
      let targetWidth = originalWidth;
      let targetHeight = originalHeight;

      if (originalWidth > originalHeight && originalWidth > maxSize) {
        targetWidth = maxSize;
        targetHeight = Math.round((originalHeight * maxSize) / originalWidth);
      } else if (originalHeight > maxSize) {
        targetHeight = maxSize;
        targetWidth = Math.round((originalWidth * maxSize) / originalHeight);
      }

      const offscreen = document.createElement("canvas");
      offscreen.width = targetWidth;
      offscreen.height = targetHeight;

      const ctx = offscreen.getContext("2d");
      ctx?.drawImage(canvas, 0, 0, targetWidth, targetHeight);

      // 3️⃣ Convert to JPEG with compression (quality 0.9)
      const dataUrl = offscreen.toDataURL("image/jpeg", 0.98);

      // 4️⃣ Convert Data URL → Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // 5️⃣ Generate a unique filename
      const timeStamp = Date.now();
      const safeName =
        global.name?.replace(/\s+/g, "_").toLowerCase() || "mockup";
      const fileName = `${safeName}_${timeStamp}.jpg`;

      // 6️⃣ Upload compressed JPG to Cloudflare R2 via Worker
      const uploadUrl = `https://upload-thumbnail.serve-image.workers.dev?file=${encodeURIComponent(
        fileName
      )}`;

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: blob,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      if (!uploadResponse.ok) {
        const text = await uploadResponse.text();
        throw new Error(`Upload failed: ${text}`);
      }

      const { url: previewUrl } = await uploadResponse.json();

      // 7️⃣ Update mockup record in Supabase
      const { error: updateError } = await supabase
        .from("mockups")
        .update({ preview_url: previewUrl })
        .eq("id", mockupId);

      if (updateError) throw new Error(`Update failed: ${updateError.message}`);

      // ✅ Success UI feedback
      setPublishStatus("success");
      setTimeout(() => setPublishStatus("idle"), 2000);
    } catch (error) {
      console.error("Error publishing image:", error);
      setPublishStatus("error");
    } finally {
      setIsPublishing(false);
    }
  };

  const getIntensity = (value: number | undefined): number => {
    return typeof value === "number" ? Math.min(Math.max(value, 0), 5) : 0;
  };

  const handleSave = async () => {
    if (!supabase) return;

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      if (!mockupId) throw new Error("Mockup ID not found");

      // Save layer settings
      const updates = layers.map((layer) => ({
        layer_id: layer.id,
        noise_threshold: layer.noiseThreshold ?? 0,
        highlights_intensity: layer.highlightsIntensity ?? 0,
        shadow_intensity: layer.shadowIntensity ?? 0,
      }));

      const { error: layersError } = await supabase.rpc(
        "update_mockup_layers",
        {
          p_mockup_id: mockupId,
          p_updates: updates,
        }
      );

      if (layersError) throw layersError;

      // Save categories as array
      const categoriesArray = Array.from(selectedCategories);

      const { error: globalError } = await supabase
        .from("mockups")
        .update({
          categories: categoriesArray,
        })
        .eq("id", mockupId);

      if (globalError) throw globalError;

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter categories based on search
  const filteredCategories = PREDEFINED_CATEGORIES.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allExpanded = expandedLayers.size === layers.length;
  const someExpanded =
    expandedLayers.size > 0 && expandedLayers.size < layers.length;
  const selectedCategoriesArray = Array.from(selectedCategories);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="bg-primary rounded-md px-5 py-2 uppercase text-sm overflow-hidden cursor-pointer text-white hover:bg-primary/70 transition-colors"
        aria-expanded={showPanel}
        aria-haspopup="dialog"
      >
        Settings
      </button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-16 right-0 bg-white min-h-20 w-96 max-w-[90vw] p-6 rounded-md shadow-lg border border-neutral-200 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Settings panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Settings Panel
              </h2>
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1 transition-colors"
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
            </div>

            {/* Global Settings Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <button
                onClick={() => toggleSection("global")}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
                aria-expanded={expandedSections.global}
              >
                <div className="flex items-center gap-3">
                  <motion.svg
                    animate={{ rotate: expandedSections.global ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                  <span className="font-medium text-gray-800">
                    Global Settings
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {expandedSections.global ? "Expanded" : "Collapsed"}
                </span>
              </button>

              <AnimatePresence>
                {expandedSections.global && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white"
                  >
                    <div className="p-4 space-y-4 border-t border-gray-200">
                      {/* Categories Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Categories
                          <span className="text-xs text-gray-500 ml-1">
                            ({selectedCategories.size} selected)
                          </span>
                        </label>

                        {/* Search Input */}
                        <div className="mb-3">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            aria-label="Search categories"
                          />
                        </div>

                        {/* Selected Categories */}
                        {selectedCategories.size > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {selectedCategoriesArray.map((category) => (
                                <span
                                  key={category}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                >
                                  {category}
                                  <button
                                    onClick={() => removeCategory(category)}
                                    className="hover:text-primary/70 transition-colors"
                                    aria-label={`Remove ${category}`}
                                  >
                                    <svg
                                      className="h-3 w-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => setSelectedCategories(new Set())}
                              className="text-xs text-red-600 hover:text-red-700 transition-colors"
                            >
                              Clear all
                            </button>
                          </div>
                        )}

                        {/* Categories Grid */}
                        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                          <div className="grid grid-cols-2 gap-2">
                            {filteredCategories.map((category) => (
                              <label
                                key={category}
                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.has(category)}
                                  onChange={() => toggleCategory(category)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                  aria-label={`Select ${category} category`}
                                />
                                <span className="text-sm text-gray-700 capitalize">
                                  {category}
                                </span>
                              </label>
                            ))}

                            {filteredCategories.length === 0 && searchTerm && (
                              <div className="col-span-2 text-center py-4">
                                <p className="text-sm text-gray-500 mb-2">
                                  No categories found
                                </p>
                                <button
                                  onClick={() => addCustomCategory(searchTerm)}
                                  className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors"
                                >
                                  Add "{searchTerm}" as custom category
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Custom Category Input */}
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Or add custom category..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            aria-label="Add custom category"
                          />
                          <button
                            onClick={() => addCustomCategory(searchTerm)}
                            disabled={!searchTerm.trim()}
                            className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Layers Settings Section - Rest of the code remains the same */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("layers")}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
                aria-expanded={expandedSections.layers}
              >
                <div className="flex items-center gap-3">
                  <motion.svg
                    animate={{ rotate: expandedSections.layers ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                  <span className="font-medium text-gray-800">
                    Layer Settings
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {expandedSections.layers ? "Expanded" : "Collapsed"}
                </span>
              </button>

              <AnimatePresence>
                {expandedSections.layers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white"
                  >
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">
                          {layers.length} layer{layers.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={expandAllLayers}
                            disabled={allExpanded}
                            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Expand All
                          </button>
                          <button
                            onClick={collapseAllLayers}
                            disabled={!someExpanded && !allExpanded}
                            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Collapse All
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {layers.map((layer) => {
                          const isExpanded = expandedLayers.has(layer.id);
                          const shadow = getIntensity(layer.shadowIntensity);
                          const highlight = getIntensity(
                            layer.highlightsIntensity
                          );
                          const noise = getIntensity(layer.noiseThreshold);

                          return (
                            <div
                              key={layer.id}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => toggleLayer(layer.id)}
                                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
                                aria-expanded={isExpanded}
                              >
                                <div className="flex items-center gap-3">
                                  <motion.svg
                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </motion.svg>
                                  <span className="font-medium text-gray-800">
                                    Layer {layer.id}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                  {isExpanded ? "Expanded" : "Collapsed"}
                                </span>
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white"
                                  >
                                    <div className="p-4 space-y-4 border-t border-gray-200">
                                      {/* Layer settings inputs remain the same */}
                                      <div>
                                        <div className="flex justify-between text-sm mb-2">
                                          <span className="text-gray-600 font-medium">
                                            Shadow Intensity
                                          </span>
                                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
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
                                              shadowIntensity: parseFloat(
                                                e.target.value
                                              ),
                                            })
                                          }
                                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                      </div>

                                      <div>
                                        <div className="flex justify-between text-sm mb-2">
                                          <span className="text-gray-600 font-medium">
                                            Highlight Intensity
                                          </span>
                                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
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
                                              highlightsIntensity: parseFloat(
                                                e.target.value
                                              ),
                                            })
                                          }
                                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                      </div>

                                      <div>
                                        <div className="flex justify-between text-sm mb-2">
                                          <span className="text-gray-600 font-medium">
                                            Noise Threshold
                                          </span>
                                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
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
                                              noiseThreshold: parseFloat(
                                                e.target.value
                                              ),
                                            })
                                          }
                                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isPublishing}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 cursor-pointer uppercase text-white rounded-md text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
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
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 cursor-pointer uppercase text-white rounded-md text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
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
            </div>

            {/* Status Feedback */}
            <div className="mt-3 min-h-[20px]">
              {saveStatus === "success" && (
                <div className="text-green-600 text-sm text-center flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Settings saved successfully!
                </div>
              )}
              {saveStatus === "error" && (
                <div className="text-red-600 text-sm text-center flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Failed to save settings
                </div>
              )}
              {publishStatus === "success" && (
                <div className="text-green-600 text-sm text-center flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Preview published successfully!
                </div>
              )}
              {publishStatus === "error" && (
                <div className="text-red-600 text-sm text-center flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Failed to publish preview
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SettingsPanel;
