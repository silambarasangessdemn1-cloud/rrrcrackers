"use client";

import { memo } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { getProductImage } from "@/config/products";

function CartItemCardComponent({ item, onUpdateQuantity, onRemove }) {
  const lineTotal = (item.product.price || 0) * item.quantity;
  const productImage = getProductImage(item.product);

  return (
    <div className="bg-white border border-border-amber rounded-custom-16 p-custom-12 flex items-center gap-custom-12 shadow-2xs">
      <div className="relative w-custom-60 h-custom-60 rounded-custom-8 bg-parchment overflow-hidden border border-border-light shrink-0 flex items-center justify-center">
        <Image
          src={productImage}
          alt={item.product.name}
          width={60}
          height={60}
          unoptimized={typeof productImage === "string" && (productImage.startsWith("http") || productImage.startsWith("/uploads/"))}
          className="w-full h-full object-contain p-custom-4"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <h4 className="text-body-sm font-bold text-text-primary truncate">
          {item.product.name}
        </h4>
        <span className="text-caption text-secondary truncate">
          {item.product.ta}
        </span>
        <div className="text-caption text-text-secondary mt-custom-2">
          <span>&#8377;{item.product.price} &times; {item.quantity} = </span>
          <strong className="text-primary-600 font-extrabold text-body-sm">
            &#8377;{lineTotal.toLocaleString("en-IN")}
          </strong>
        </div>
      </div>

      <div className="flex flex-col items-end gap-custom-8 shrink-0">
        <div className="flex items-center border border-border-amber bg-parchment rounded-custom-8 overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.product.id, -1)}
            className="px-custom-6 py-custom-4 hover:bg-gold-tint text-text-secondary cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-custom-20 text-center text-caption font-bold text-text-primary select-none">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.product.id, 1)}
            className="px-custom-6 py-custom-4 hover:bg-gold-tint text-text-secondary cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.product.id)}
          className="text-text-neutral hover:text-primary-600 transition-colors p-custom-2 cursor-pointer"
          aria-label="Remove item"
        >
          <Trash2 className="w-custom-12 h-custom-12" />
        </button>
      </div>
    </div>
  );
}

export const CartItemCard = memo(CartItemCardComponent);
export default CartItemCard;
