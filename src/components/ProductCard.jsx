"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { CATEGORY_MAP, getProductImage } from "@/config/products";
import { useCartStore } from "@/store/useCartStore";

function ProductCardComponent({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const fullPrice = product.full || (product.price ? product.price * 4 : 100);
  const sellingPrice = product.price || 0;
  const categoryInfo = CATEGORY_MAP[product.cat] || { name: product.cat, ta: "" };
  const productImage = getProductImage(product);
  const offerTag = product.tag || "RRR OFFER";

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white border border-amber-200/80 rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 shadow-xs hover:shadow-md transition-all duration-200">
      {/* ── Desktop & Tablet Layout (Horizontal Row) ── */}
      <div className="hidden md:flex items-center justify-between gap-5 lg:gap-6">
        {/* Left: Product Image */}
        <div className="relative w-28 h-28 lg:w-32 lg:h-32 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-300 bg-amber-50/40 p-2 flex items-center justify-center">
          <Image
            src={productImage}
            alt={product.name}
            width={160}
            height={160}
            loading="lazy"
            unoptimized={typeof productImage === "string" && (productImage.startsWith("http") || productImage.startsWith("/uploads/"))}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Middle: Details & Pricing */}
        <div className="flex-1 flex flex-col justify-center min-w-0 gap-1 lg:gap-1.5">
          {/* Badges Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-amber-700 text-caption">
              <span>{categoryInfo.name}</span>
            </span>

            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold tracking-wide uppercase">
              {offerTag}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg lg:text-xl font-black text-slate-900 leading-snug line-clamp-1 group-hover:text-[#990000] transition-colors">
            {product.name}
          </h3>

          {/* Tamil Name */}
          {product.ta && (
            <p className="text-xs lg:text-sm text-slate-500 font-medium line-clamp-1">
              {product.ta}
            </p>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-2.5 mt-0.5">
            <span className="text-2xl lg:text-3xl font-black text-[#c00000] leading-none">
              &#8377;{sellingPrice}
            </span>
            {fullPrice > sellingPrice && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                &#8377;{fullPrice}
              </span>
            )}
          </div>
        </div>

        {/* Right: Quantity Stepper & Add Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Stepper */}
          <div className="flex items-center border-2 border-amber-300 bg-white rounded-xl px-2 py-1 gap-2 shadow-xs">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-amber-800 hover:bg-amber-50 active:scale-90 rounded-lg transition-all cursor-pointer font-bold"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="w-7 text-center font-black text-base text-slate-900 select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-amber-800 hover:bg-amber-50 active:scale-90 rounded-lg transition-all cursor-pointer font-bold"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`min-w-[110px] flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl font-bold text-sm lg:text-base text-white transition-all duration-150 cursor-pointer shadow-sm active:scale-95 ${added
              ? "bg-emerald-600 shadow-emerald-200"
              : "bg-[#990000] hover:bg-[#800000]"
              }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Layout (Top Details + Divider + Bottom Stepper & Add) ── */}
      <div className="flex flex-col md:hidden">
        {/* Top: Image & Details */}
        <div className="flex items-start gap-3.5">
          {/* Product Thumbnail */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-300 bg-amber-50/40 p-2 flex items-center justify-center">
            <Image
              src={productImage}
              alt={product.name}
              width={120}
              height={120}
              loading="lazy"
              unoptimized={typeof productImage === "string" && (productImage.startsWith("http") || productImage.startsWith("/uploads/"))}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-center min-w-0 gap-0.5 sm:gap-1">
            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-amber-700 font-extrabold uppercase text-[11px] tracking-wider">
                <span>{categoryInfo.name}</span>
              </span>

              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black tracking-wide uppercase">
                {offerTag}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug line-clamp-2">
              {product.name}
            </h3>

            {/* Tamil Name */}
            {product.ta && (
              <p className="text-xs text-slate-500 font-medium line-clamp-1">
                {product.ta}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-[#c00000] leading-none">
                &#8377;{sellingPrice}
              </span>
              {fullPrice > sellingPrice && (
                <span className="text-xs sm:text-sm font-semibold text-slate-400 line-through">
                  &#8377;{fullPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="border-t border-amber-100/90 my-3" />

        {/* Bottom: Stepper + Add Button */}
        <div className="flex items-center justify-between gap-3">
          {/* Stepper */}
          <div className="flex items-center border-2 border-amber-300 bg-white rounded-xl px-2 py-1 gap-2 shadow-xs">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-amber-800 active:scale-90 rounded-lg transition-all cursor-pointer font-bold"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="w-6 text-center font-black text-sm text-slate-900 select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-amber-800 active:scale-90 rounded-lg transition-all cursor-pointer font-bold"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-5 rounded-2xl font-bold text-sm text-white transition-all duration-150 cursor-pointer shadow-sm active:scale-95 ${added
              ? "bg-emerald-600"
              : "bg-[#990000] hover:bg-[#800000]"
              }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
export default ProductCard;

