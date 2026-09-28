"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Search,
  Trash2,
  AlertCircle,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { getProductImage, CATEGORY_MAP } from "@/config/products";

export default function ProductImageModal({
  isOpen,
  onClose,
  product,
  onSaveImage,
}) {
  const [activeTab, setActiveTab] = useState("library"); // "library" | "upload"
  const [selectedImage, setSelectedImage] = useState("");
  const [libraryImages, setLibraryImages] = useState({ uploaded: [], stock: [] });
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all" | "uploaded" | "stock"
  
  // Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Initialize selected image when product opens
  useEffect(() => {
    if (product) {
      const current = product.customImage || getProductImage(product);
      setSelectedImage(current);
      setUploadFile(null);
      setUploadPreview("");
      setUploadError("");
      setActiveTab("library");
      fetchImages();
    }
  }, [product, isOpen]);

  const fetchImages = async () => {
    setLoadingLibrary(true);
    try {
      const res = await fetch("/api/images");
      if (res.ok) {
        const data = await res.json();
        setLibraryImages({
          uploaded: data.uploaded || [],
          stock: data.stock || [],
        });
      }
    } catch (err) {
      console.error("Error fetching images library:", err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setUploadError("");

    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|svg|gif|avif)$/i)) {
      setUploadError("Please choose a valid image file (JPG, PNG, WEBP, SVG, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size is larger than 10MB limit.");
      return;
    }

    setUploadFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadPreview(objectUrl);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      // Success - select newly uploaded image
      setSelectedImage(data.url);
      setUploadFile(null);
      setUploadPreview("");
      
      // Refresh library and switch to library tab to show newly uploaded item
      await fetchImages();
      setActiveTab("library");
      setCategoryFilter("uploaded");
    } catch (err) {
      setUploadError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUploadedImage = async (filename, e) => {
    e.stopPropagation();
    if (!confirm(`Delete image "${filename}" from server?`)) return;

    try {
      const res = await fetch(`/api/images?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // If the deleted image was currently selected, fall back to default
        if (selectedImage.includes(filename)) {
          setSelectedImage(CATEGORY_MAP[product?.cat]?.image || "/images/sparklers_photo_1790234189780.svg");
        }
        fetchImages();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete image.");
      }
    } catch (err) {
      alert("Error deleting image: " + err.message);
    }
  };

  const handleResetToDefault = () => {
    const defaultImg = CATEGORY_MAP[product?.cat]?.image || "/images/sparklers_photo_1790234189780.svg";
    setSelectedImage(defaultImg);
  };

  const handleApply = () => {
    if (!product) return;
    const defaultImg = CATEGORY_MAP[product?.cat]?.image || "/images/sparklers_photo_1790234189780.svg";
    
    // If selected is default, store empty string
    const finalImage = selectedImage === defaultImg ? "" : selectedImage;
    onSaveImage(product.id, finalImage);
    onClose();
  };

  // Filtered list of all library images
  const filteredLibrary = useMemo(() => {
    let combined = [];

    if (categoryFilter === "all" || categoryFilter === "uploaded") {
      combined = [...combined, ...libraryImages.uploaded];
    }
    if (categoryFilter === "all" || categoryFilter === "stock") {
      combined = [...combined, ...libraryImages.stock];
    }

    if (!searchFilter.trim()) return combined;

    const q = searchFilter.toLowerCase().trim();
    return combined.filter(
      (img) =>
        img.name.toLowerCase().includes(q) ||
        (img.filename && img.filename.toLowerCase().includes(q)) ||
        (img.key && img.key.toLowerCase().includes(q))
    );
  }, [libraryImages, categoryFilter, searchFilter]);

  if (!isOpen || !product) return null;

  const currentDefaultImage = CATEGORY_MAP[product.cat]?.image || "/images/sparklers_photo_1790234189780.svg";
  const isDefaultSelected = selectedImage === currentDefaultImage || !selectedImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-amber-300/80 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-amber-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                  Update Image: {product.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30">
                  #{product.id}
                </span>
              </div>
              <div className="text-xs text-amber-200/80 truncate">
                {product.ta && <span>{product.ta} &bull; </span>}
                <span>Category: {CATEGORY_MAP[product.cat]?.name || product.cat}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Tab Switcher Bar ── */}
        <div className="px-5 sm:px-6 pt-3 pb-2 bg-amber-50/50 border-b border-amber-200 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-amber-200/50 rounded-xl border border-amber-300">
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "library"
                  ? "bg-white text-primary-900 shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span>Media Library ({libraryImages.uploaded.length + libraryImages.stock.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "upload"
                  ? "bg-white text-primary-900 shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Upload New Image</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Click any image to select and reuse it for this product
          </div>
        </div>

        {/* ── Tab Content Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[300px]">
          {/* TAB 1: MEDIA LIBRARY (REUSE IMAGES) */}
          {activeTab === "library" && (
            <div className="flex flex-col gap-4">
              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-cream p-3 rounded-xl border border-amber-200">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by image name..."
                    className="w-full pl-9 pr-7 py-1.5 text-xs sm:text-sm rounded-lg border border-amber-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary-600"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("all")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      categoryFilter === "all"
                        ? "bg-primary-600 text-white"
                        : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    All ({libraryImages.uploaded.length + libraryImages.stock.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("uploaded")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      categoryFilter === "uploaded"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    Uploaded ({libraryImages.uploaded.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("stock")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      categoryFilter === "stock"
                        ? "bg-amber-700 text-white"
                        : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    Stock Icons ({libraryImages.stock.length})
                  </button>
                  <button
                    type="button"
                    onClick={fetchImages}
                    title="Refresh Library"
                    className="p-1.5 rounded-full bg-white border border-amber-200 hover:bg-amber-100 text-slate-600 transition-colors cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingLibrary ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Grid of Images */}
              {loadingLibrary ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
                  <span className="text-sm font-medium">Loading media library...</span>
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-amber-200 rounded-2xl bg-amber-50/40">
                  <ImageIcon className="w-12 h-12 text-amber-300 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No images found</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    {searchFilter
                      ? `No images match "${searchFilter}". Try clearing your search.`
                      : "No images in this category yet. Upload a new image to reuse it anytime!"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="mt-4 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors cursor-pointer"
                  >
                    Upload an Image Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {filteredLibrary.map((item) => {
                    const isSelected = selectedImage === item.url;
                    return (
                      <div
                        key={item.id || item.url}
                        onClick={() => setSelectedImage(item.url)}
                        className={`group relative rounded-xl border-2 p-2.5 flex flex-col items-center justify-between transition-all cursor-pointer bg-white ${
                          isSelected
                            ? "border-primary-600 ring-2 ring-primary-500/30 bg-primary-50/20 shadow-md scale-[1.02]"
                            : "border-amber-200/80 hover:border-amber-400 hover:shadow-sm"
                        }`}
                      >
                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        {/* Type Badge */}
                        <div className="absolute top-2 left-2 z-10">
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                              item.type === "uploaded"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {item.type === "uploaded" ? "Uploaded" : "Stock"}
                          </span>
                        </div>

                        {/* Thumbnail */}
                        <div className="w-full h-24 sm:h-28 rounded-lg bg-amber-50/40 p-2 flex items-center justify-center overflow-hidden my-2">
                          <Image
                            src={item.url}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                            unoptimized={item.url.startsWith("/uploads/")}
                          />
                        </div>

                        {/* Label & Details */}
                        <div className="w-full text-center mt-1">
                          <p className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                            {item.name}
                          </p>
                          {item.size && (
                            <p className="text-[10px] text-slate-400">
                              {(item.size / 1024).toFixed(1)} KB
                            </p>
                          )}
                        </div>

                        {/* Delete action for custom uploaded images */}
                        {item.type === "uploaded" && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteUploadedImage(item.filename, e)}
                            title="Delete file from server"
                            className="opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD NEW IMAGE */}
          {activeTab === "upload" && (
            <div className="flex flex-col gap-6 max-w-xl mx-auto py-4">
              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary-600 bg-primary-50/50 scale-[1.01]"
                    : "border-amber-300 hover:border-primary-500 bg-cream/60 hover:bg-amber-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-primary-700 flex items-center justify-center mb-3 shadow-xs">
                  <Upload className="w-8 h-8" />
                </div>

                <h3 className="text-base font-bold text-slate-800">
                  {uploadFile ? "Change Selected File" : "Click to browse or drop image here"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Supports PNG, JPG, WEBP, SVG, GIF up to 10MB. Uploaded images will be saved and can be reused anytime for any product.
                </p>
              </div>

              {/* Upload Error Message */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Selected File Preview & Action */}
              {uploadFile && (
                <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-white border border-amber-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {uploadPreview && (
                        <img
                          src={uploadPreview}
                          alt="Upload preview"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {uploadFile.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(uploadFile.size / 1024).toFixed(1)} KB &bull; {uploadFile.type || "Image"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleUploadSubmit}
                    disabled={isUploading}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Upload & Select</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer Comparison & Action Bar ── */}
        <div className="bg-amber-50 border-t border-amber-200 px-5 sm:px-6 py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Left: Preview Comparison */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Selected:</span>
              <div className="relative w-12 h-12 rounded-xl bg-white border-2 border-primary-600 p-1 flex items-center justify-center overflow-hidden shadow-xs">
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    unoptimized={selectedImage.startsWith("/uploads/")}
                  />
                )}
              </div>
            </div>

            {/* Reset to Category Default */}
            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={isDefaultSelected}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDefaultSelected
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-amber-800 border-amber-300 hover:bg-amber-100"
              }`}
              title="Reset to category default stock image"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save & Apply Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
