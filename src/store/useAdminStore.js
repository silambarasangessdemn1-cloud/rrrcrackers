import { create } from "zustand";
import { useProductStore } from "./useProductStore";

export const useAdminStore = create((set) => ({
  activeAdminTab: "products",
  setActiveAdminTab: (tab) => set({ activeAdminTab: tab }),

  isProductModalOpen: false,
  editingProductId: null,
  openAddProduct: () => set({ isProductModalOpen: true, editingProductId: null }),
  openEditProduct: (id) => set({ isProductModalOpen: true, editingProductId: id }),
  closeProductModal: () => set({ isProductModalOpen: false, editingProductId: null }),

  isCategoryModalOpen: false,
  editingCategoryKey: null,
  openAddCategory: () => set({ isCategoryModalOpen: true, editingCategoryKey: null }),
  openEditCategory: (key) => set({ isCategoryModalOpen: true, editingCategoryKey: key }),
  closeCategoryModal: () => set({ isCategoryModalOpen: false, editingCategoryKey: null }),
}));

export { useProductStore };
