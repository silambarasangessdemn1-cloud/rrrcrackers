import { create } from "zustand";

export const useUIStore = create((set) => ({
  isPricelistOpen: false,
  openPricelist: () => set({ isPricelistOpen: true }),
  closePricelist: () => set({ isPricelistOpen: false }),

  searchQuery: "",
  selectedCategory: "all",
  sortBy: "default",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSortBy: (sort) => set({ sortBy: sort }),
  resetFilters: () =>
    set({
      searchQuery: "",
      selectedCategory: "all",
      sortBy: "default",
    }),
}));
