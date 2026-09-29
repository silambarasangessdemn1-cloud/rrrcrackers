"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  Check,
  Save,
  ExternalLink,
  X,
  Camera,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { getProductImage } from "@/config/products";
import { calculateDiscount } from "@/utils/formatters";
import ProductImageModal from "@/components/admin/ProductImageModal";
import SiteStatusManager from "@/components/admin/SiteStatusManager";
import { useEffect } from "react";

export default function AdminPage() {
  const products = useProductStore((state) => state.products);
  const categoryMap = useProductStore((state) => state.categoryMap);
  const categoryKeys = useProductStore((state) => state.categoryKeys);
  const updateProductPrice = useProductStore((state) => state.updateProductPrice);
  const updateProductImage = useProductStore((state) => state.updateProductImage);
  const resetToDefaults = useProductStore((state) => state.resetToDefaults);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [editedPrices, setEditedPrices] = useState({});
  const [savedId, setSavedId] = useState(null);
  const [imageSavedId, setImageSavedId] = useState(null);

  // Modal State for updating product image
  const [editingImageProduct, setEditingImageProduct] = useState(null);

  const handlePriceChange = (id, field, value) => {
    setEditedPrices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (product) => {
    const edit = editedPrices[product.id] || {};
    const newPrice = edit.price !== undefined ? Number(edit.price) : Number(product.price);
    const newFull = edit.full !== undefined ? Number(edit.full) : Number(product.full || product.price * 2);

    if (isNaN(newPrice) || newPrice <= 0) {
      alert("Selling price must be greater than 0");
      return;
    }

    if (isNaN(newFull) || newFull <= 0) {
      alert("MRP price must be greater than 0");
      return;
    }

    if (newPrice >= newFull) {
      alert(`Invalid Price: MRP (₹${newFull}) must be greater than Selling Price (₹${newPrice})`);
      return;
    }

    updateProductPrice(product.id, newPrice, newFull);

    setEditedPrices((prev) => {
      const next = { ...prev };
      delete next[product.id];
      return next;
    });

    setSavedId(product.id);
    setTimeout(() => setSavedId(null), 1500);
  };

  const handleSaveImage = (productId, newImageUrl) => {
    updateProductImage(productId, newImageUrl);
    setImageSavedId(productId);
    setTimeout(() => setImageSavedId(null), 2500);
  };

  const handleCancel = (id) => {
    setEditedPrices((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleReset = () => {
    if (confirm("Reset all product prices to default Sivakasi wholesale rates?")) {
      resetToDefaults();
      setEditedPrices({});
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchCat = selectedCat === "all" || p.cat === selectedCat;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.ta && p.ta.toLowerCase().includes(q)) ||
        String(p.id).includes(q);
      return matchCat && matchSearch;
    });
  }, [products, searchQuery, selectedCat]);

  return (
    <div className="flex flex-col gap-custom-16 pb-custom-32">
      {/* Site Service / Maintenance Mode Controller */}
      <SiteStatusManager />

      {/* Toast Notification when image is updated */}
      {imageSavedId && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <Check className="w-5 h-5 stroke-[3] text-emerald-300" />
          <span className="text-sm font-bold">
            Product #{imageSavedId} image updated & persisted!
          </span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="bg-white border border-border-amber rounded-custom-16 p-custom-16 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-custom-12 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-custom-10 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-neutral" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product by name, தமிழ், or ID..."
              className="w-full pl-custom-36 pr-custom-28 py-custom-8 rounded-full border border-border-amber bg-cream text-body-sm text-text-primary placeholder:text-text-neutral focus:outline-none focus:border-primary-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-neutral hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-custom-12 py-custom-8 rounded-full border border-border-amber bg-cream text-body-sm text-text-primary font-medium focus:outline-none focus:border-primary-600 cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            {categoryKeys.map((k) => (
              <option key={k} value={k}>
                {categoryMap[k]?.name || k}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-custom-8 self-end md:self-auto">
          <button
            onClick={handleReset}
            className="px-custom-12 py-custom-8 rounded-full bg-parchment hover:bg-red-50 text-text-secondary hover:text-red-700 border border-border-amber text-caption font-bold flex items-center gap-custom-4 transition-colors cursor-pointer"
            title="Reset to factory prices"
          >
            <RotateCcw className="w-custom-12 h-custom-12" />
            <span>Reset Rates</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-custom-12 py-custom-8 rounded-full bg-primary-600 hover:bg-primary-hover text-white text-caption font-bold flex items-center gap-custom-4 transition-colors"
          >
            <span>Storefront</span>
            <ExternalLink className="w-custom-12 h-custom-12" />
          </Link>
        </div>
      </div>

      {/* Product Price & Image Table */}
      <div className="bg-white border border-border-amber rounded-custom-16 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead className="bg-parchment text-text-primary text-caption font-bold tracking-wider uppercase border-b border-border-amber">
              <tr>
                <th className="py-custom-10 px-custom-12 w-14 text-center">#</th>
                <th className="py-custom-10 px-custom-12">Product & Photo</th>
                <th className="py-custom-10 px-custom-12">Category</th>
                <th className="py-custom-10 px-custom-12 text-center w-36">Selling Price (&#8377;)</th>
                <th className="py-custom-10 px-custom-12 text-center w-36">MRP Price (&#8377;)</th>
                <th className="py-custom-10 px-custom-12 text-center w-24">Discount</th>
                <th className="py-custom-10 px-custom-12 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-body-sm">
              {filteredProducts.map((p) => {
                const img = getProductImage(p);
                const hasCustomImg = Boolean(p.customImage);
                const edit = editedPrices[p.id] || {};
                const currentPrice = edit.price !== undefined ? edit.price : p.price;
                const currentFull = edit.full !== undefined ? edit.full : p.full || p.price * 2;
                const numPrice = Number(currentPrice) || 0;
                const numFull = Number(currentFull) || 0;
                const isInvalidPrice = numPrice >= numFull || numPrice <= 0 || numFull <= 0;
                const isModified = edit.price !== undefined || edit.full !== undefined;
                const isSaved = savedId === p.id;
                const discount = calculateDiscount(numFull, numPrice);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSaved
                        ? "bg-emerald-50"
                        : isModified && isInvalidPrice
                        ? "bg-red-50/50"
                        : isModified
                        ? "bg-amber-50/50"
                        : "hover:bg-gold-tint/30"
                    }`}
                  >
                    <td className="py-custom-10 px-custom-12 text-center font-bold text-text-neutral text-caption">
                      #{p.id}
                    </td>

                    <td className="py-custom-10 px-custom-12">
                      <div className="flex items-center gap-custom-10">
                        {/* Interactive Image Thumbnail with Change button */}
                        <div
                          onClick={() => setEditingImageProduct(p)}
                          className="group relative w-11 h-11 rounded-custom-8 bg-cream border border-border-amber hover:border-primary-600 shrink-0 flex items-center justify-center overflow-hidden cursor-pointer shadow-2xs transition-all hover:scale-105"
                          title="Click to change or upload product image"
                        >
                          <Image
                            src={img}
                            alt={p.name}
                            width={44}
                            height={44}
                            unoptimized={typeof img === "string" && (img.startsWith("http") || img.startsWith("/uploads/"))}
                            className="w-full h-full object-contain p-1 group-hover:opacity-40 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-primary-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Camera className="w-4 h-4" />
                          </div>
                          {hasCustomImg && (
                            <span
                              className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"
                              title="Custom image active"
                            />
                          )}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text-primary text-body-sm leading-tight truncate">
                              {p.name}
                            </span>
                            {hasCustomImg && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold tracking-tight">
                                Custom
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-caption text-secondary truncate">{p.ta}</span>
                            <button
                              type="button"
                              onClick={() => setEditingImageProduct(p)}
                              className="text-[11px] font-semibold text-primary-700 hover:text-primary-900 hover:underline cursor-pointer inline-flex items-center gap-1"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>Change Photo</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-custom-10 px-custom-12 text-caption text-text-secondary">
                      {categoryMap[p.cat]?.name || p.cat}
                    </td>

                    {/* Selling Price input */}
                    <td className="py-custom-10 px-custom-12 text-center">
                      <div className="relative inline-flex items-center w-full max-w-[110px]">
                        <span className="absolute left-2.5 text-text-neutral font-bold text-caption">
                          &#8377;
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={currentPrice}
                          onChange={(e) => handlePriceChange(p.id, "price", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave(p);
                            if (e.key === "Escape") handleCancel(p.id);
                          }}
                          className={`w-full pl-6 pr-2 py-1 rounded-custom-6 border bg-white text-body-sm font-extrabold text-right focus:outline-none ${
                            isModified && isInvalidPrice
                              ? "border-red-400 text-red-600 focus:border-red-600"
                              : "border-border-amber text-primary-600 focus:border-primary-600"
                          }`}
                        />
                      </div>
                    </td>

                    {/* MRP Price input */}
                    <td className="py-custom-10 px-custom-12 text-center">
                      <div className="relative inline-flex items-center w-full max-w-[110px]">
                        <span className="absolute left-2.5 text-text-neutral font-bold text-caption">
                          &#8377;
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={currentFull}
                          onChange={(e) => handlePriceChange(p.id, "full", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave(p);
                            if (e.key === "Escape") handleCancel(p.id);
                          }}
                          className={`w-full pl-6 pr-2 py-1 rounded-custom-6 border bg-white text-body-sm font-bold text-right focus:outline-none ${
                            isModified && isInvalidPrice
                              ? "border-red-400 text-red-600 focus:border-red-600"
                              : "border-border-light text-text-neutral focus:border-primary-600"
                          }`}
                        />
                      </div>
                    </td>

                    <td className="py-custom-10 px-custom-12 text-center">
                      {isInvalidPrice ? (
                        <span
                          className="px-custom-6 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]"
                          title="MRP must be greater than Selling Price"
                        >
                          MRP &le; Sell
                        </span>
                      ) : (
                        <span className="px-custom-8 py-0.5 rounded-full bg-primary-100 text-primary-700 font-extrabold text-custom-16">
                          {discount}%
                        </span>
                      )}
                    </td>

                    <td className="py-custom-10 px-custom-12 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isModified ? (
                          <>
                            <button
                              onClick={() => handleSave(p)}
                              disabled={isInvalidPrice}
                              className={`p-1.5 rounded-full text-white transition-all cursor-pointer inline-flex items-center justify-center shadow-2xs ${
                                isInvalidPrice
                                  ? "bg-gray-300 opacity-50 cursor-not-allowed"
                                  : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                              }`}
                              title={
                                isInvalidPrice
                                  ? `MRP (₹${numFull}) must be greater than Selling Price (₹${numPrice})`
                                  : "Save price to LocalStorage"
                              }
                              aria-label="Save price"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCancel(p.id)}
                              className="p-1.5 rounded-full bg-parchment hover:bg-red-100 text-text-secondary hover:text-red-700 border border-border-amber transition-all cursor-pointer inline-flex items-center justify-center"
                              title="Cancel change"
                              aria-label="Cancel change"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : isSaved ? (
                          <span className="text-emerald-600 inline-flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingImageProduct(p)}
                            className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Update image for this product"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                            <span className="hidden sm:inline">Image</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="py-custom-32 text-center text-text-neutral text-body-sm">
              No products found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      </div>

      {/* Product Image Manager Modal */}
      <ProductImageModal
        isOpen={Boolean(editingImageProduct)}
        product={editingImageProduct}
        onClose={() => setEditingImageProduct(null)}
        onSaveImage={handleSaveImage}
      />
    </div>
  );
}
