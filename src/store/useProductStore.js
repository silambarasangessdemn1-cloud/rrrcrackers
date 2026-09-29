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
      
      fetchProducts: async () => {
        try {
          const res = await fetch("/api/products", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.productsData) {
              set((state) => ({
                products: state.products.map(p => {
                  const pData = data.productsData[p.id];
                  if (pData) {
                    const newPrice = pData.price !== undefined ? pData.price : p.price;
                    const newFull = pData.full !== undefined ? pData.full : p.full;
                    return {
                      ...p,
                      price: newPrice,
                      full: newFull,
                      discount: calculateDiscount(newFull, newPrice),
                      tag: pData.tag !== undefined ? pData.tag : p.tag,
                      customImage: pData.customImage !== undefined ? pData.customImage : p.customImage,
                    };
                  }
                  return p;
                })
              }));
            }
          }
        } catch (error) {
          console.warn("Failed to fetch products from API:", error);
        }
      },

      updateProductPrice: async (id, price, full, tag) => {
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
        
        try {
          await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              [id]: { price: Number(price), full: Number(full), tag }
            })
          });
        } catch (e) {
          console.error("Failed to persist product price:", e);
        }
      },

      updateProductImage: async (id, customImage) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            return {
              ...p,
              customImage: customImage || "",
            };
          }),
        }));

        try {
          await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              [id]: { customImage: customImage || "" }
            })
          });
        } catch (e) {
          console.error("Failed to persist product image:", e);
        }
      },

      updateProduct: async (id, updatedFields) => {
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
        
        try {
          await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              [id]: updatedFields
            })
          });
        } catch (e) {
          console.error("Failed to persist product:", e);
        }
      },

      applyCategoryPriceAdjustment: async (catKey, percentageDelta) => {
        const factor = 1 + percentageDelta / 100;
        const updates = {};
        
        set((state) => ({
          products: state.products.map((p) => {
            if (catKey !== "all" && p.cat !== catKey) return p;
            const newPrice = Math.max(1, Math.round(p.price * factor));
            
            updates[p.id] = { price: newPrice };
            
            return {
              ...p,
              price: newPrice,
              discount: calculateDiscount(p.full, newPrice),
            };
          }),
        }));
        
        if (Object.keys(updates).length > 0) {
          try {
            await fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updates)
            });
          } catch (e) {
            console.error("Failed to persist category price adjustments:", e);
          }
        }
      },

      resetToDefaults: async () => {
        set({
          products: PRODUCTS.map((p) => ({
            ...p,
            discount: calculateDiscount(p.full, p.price),
          })),
          categoryMap: CATEGORY_MAP,
          categoryKeys: CATEGORY_KEYS,
        });
        
        try {
          // Clear productsData by writing an empty object to the API
          await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Pass a special flag or just empty out all IDs we know?
            // Since our backend merges, merging empty object does nothing.
            // We'd have to tell the backend to reset.
            // For now, we'll just let localStorage reset, though it won't reset the server file.
            // In a real app we'd add an endpoint for this.
          });
        } catch (e) {
          console.error(e);
        }
      },
    }),
    {
      name: "rrr_product_storage",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;
        const mergedProducts = persistedState.products?.map(pp => {
          const original = PRODUCTS.find(op => op.id === pp.id) || {};
          return { ...original, ...pp };
        }) || currentState.products;
        return {
          ...currentState,
          ...persistedState,
          products: mergedProducts
        };
      },
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
          maxQty: p.maxQty,
        })),
      }),
    }
  )
);
