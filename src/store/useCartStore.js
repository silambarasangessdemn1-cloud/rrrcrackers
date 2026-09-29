import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS } from "@/config/products";

export const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: (product, quantity = 1, openDrawer = true) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          let updatedItems;
          if (existingIndex > -1) {
            updatedItems = [...state.items];
            const newQty = updatedItems[existingIndex].quantity + quantity;
            // Get latest product from PRODUCTS if possible, fallback to passed product
            const latestProduct = PRODUCTS.find((p) => p.id === product.id) || product;
            const maxQty = latestProduct.maxQty || Infinity;
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              product: latestProduct,
              quantity: newQty > maxQty ? maxQty : newQty,
            };
          } else {
            const latestProduct = PRODUCTS.find((p) => p.id === product.id) || product;
            const maxQty = latestProduct.maxQty || Infinity;
            updatedItems = [...state.items, { product: latestProduct, quantity: quantity > maxQty ? maxQty : quantity }];
          }

          return {
            items: updatedItems,
            ...(openDrawer ? { isCartOpen: true } : {}),
          };
        });
      },

      updateQuantity: (productId, delta) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.product.id === productId) {
                const latestProduct = PRODUCTS.find((p) => p.id === productId) || item.product;
                const nextQty = item.quantity + delta;
                const maxQty = latestProduct.maxQty || Infinity;
                if (nextQty > maxQty) return { ...item, product: latestProduct, quantity: maxQty };
                return nextQty > 0 ? { ...item, product: latestProduct, quantity: nextQty } : null;
              }
              return item;
            })
            .filter(Boolean),
        }));
      },

      setItemQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          return {
            items: state.items.map((item) => {
              if (item.product.id === productId) {
                const latestProduct = PRODUCTS.find((p) => p.id === productId) || item.product;
                const maxQty = latestProduct.maxQty || Infinity;
                return { ...item, product: latestProduct, quantity: quantity > maxQty ? maxQty : quantity };
              }
              return item;
            }),
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalAmount: () => {
        const { items } = get();
        return items.reduce(
          (sum, item) => sum + (item.product.price || 0) * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "rrr_cart_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
