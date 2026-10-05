"use client";

import { useState, useEffect } from "react";
import { X, Check, FileEdit } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";

export default function ProductDetailsModal({ isOpen, onClose, product, onSave }) {
  const categoryKeys = useProductStore((state) => state.categoryKeys);
  const categoryMap = useProductStore((state) => state.categoryMap);
  const [editedProduct, setEditedProduct] = useState(null);

  useEffect(() => {
    if (product) {
      setEditedProduct({ ...product });
    }
  }, [product, isOpen]);

  if (!isOpen || !editedProduct) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProduct.id, {
      name: editedProduct.name,
      ta: editedProduct.ta,
      cat: editedProduct.cat,
      tag: editedProduct.tag,
      maxQty: editedProduct.maxQty ? Number(editedProduct.maxQty) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-amber-300/80 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-amber-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Edit Product Details
              </h2>
              <div className="text-xs text-amber-200/80">#{product.id}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form id="edit-product-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Name (English)</label>
              <input
                type="text"
                name="name"
                value={editedProduct.name || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:border-primary-600 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Name (Tamil)</label>
              <input
                type="text"
                name="ta"
                value={editedProduct.ta || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:border-primary-600 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select
                name="cat"
                value={editedProduct.cat || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:border-primary-600 focus:outline-none bg-white"
              >
                {categoryKeys.map((k) => (
                  <option key={k} value={k}>
                    {categoryMap[k]?.name || k}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Tag (e.g., NEW, HOT)</label>
              <input
                type="text"
                name="tag"
                value={editedProduct.tag || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:border-primary-600 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Max Quantity</label>
              <input
                type="number"
                name="maxQty"
                value={editedProduct.maxQty || ""}
                onChange={handleChange}
                min="1"
                placeholder="Leave empty for unlimited"
                className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:border-primary-600 focus:outline-none"
              />
            </div>
          </form>
        </div>

        <div className="bg-amber-50 border-t border-amber-200 px-5 sm:px-6 py-4 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-product-form"
            className="px-6 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
