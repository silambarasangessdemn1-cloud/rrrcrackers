import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS, CATEGORY_MAP, CATEGORY_KEYS } from "@/config/products";
import { calculateDiscount } from "@/utils/formatters";

export const useProductStore = create()(
  persist(
    (set, get) => ({
      products: PRODUCTS.map((p) => ({
        ...p,
        discount: calculateDiscount(p.full, p.price),
      })),
      categoryMap: CATEGORY_MAP,
      categoryKeys: CATEGORY_KEYS,

      updateProductPrice: (id, price, full, tag) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const newPrice = Number(price) >= 0 ? Number(price) : p.price;
            const newFull = full !== undefined && full !== "" ? Number(full) : p.full;
            return {
              ...p,
              price: newPrice,
              full: newFull,
              discount: calculateDiscount(newFull, newPrice),
              tag: tag !== undefined ? tag : p.tag,
            };
          }),
        }));
      },

      updateProductImage: (id, customImage) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            return {
              ...p,
              customImage: customImage || "",
            };
          }),
        }));
      },

      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const newPrice =
              updatedFields.price !== undefined
                ? Number(updatedFields.price)
                : p.price;
            const newFull =
              updatedFields.full !== undefined
                ? Number(updatedFields.full)
                : p.full;
            return {
              ...p,
              ...updatedFields,
              price: newPrice,
              full: newFull,
              discount: calculateDiscount(newFull, newPrice),
            };
          }),
        }));
      },

      applyCategoryPriceAdjustment: (catKey, percentageDelta) => {
        // e.g. +10 for 10% increase, -10 for 10% discount
        const factor = 1 + percentageDelta / 100;
        set((state) => ({
          products: state.products.map((p) => {
            if (catKey !== "all" && p.cat !== catKey) return p;
            const newPrice = Math.max(1, Math.round(p.price * factor));
            return {
              ...p,
              price: newPrice,
              discount: calculateDiscount(p.full, newPrice),
            };
          }),
        }));
      },

      resetToDefaults: () => {
        set({
          products: PRODUCTS.map((p) => ({
            ...p,
            discount: calculateDiscount(p.full, p.price),
          })),
          categoryMap: CATEGORY_MAP,
          categoryKeys: CATEGORY_KEYS,
        });
      },
    }),
    {
      name: "rrr_product_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: (state.products || []).map((p) => ({
          id: p.id,
          name: p.name,
          ta: p.ta || "",
          price: Number(p.price) || 0,
          full: Number(p.full) || 0,
          discount:
            p.discount !== undefined
              ? Number(p.discount)
              : calculateDiscount(p.full, p.price),
          cat: p.cat || "sparklers",
          tag: p.tag || "",
          customImage: p.customImage || "",
        })),
      }),
    }
  )
);

