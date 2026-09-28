"use client";

import { useState, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";

export function useProductFilter(initialCategory = "all") {
  const products = useProductStore((state) => state.products);
  const categoryKeys = useProductStore((state) => state.categoryKeys);
  const categoryMap = useProductStore((state) => state.categoryMap);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.cat === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.ta && item.ta.toLowerCase().includes(query)) ||
        item.cat.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return a.id - b.id;
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach((p) => {
      counts[p.cat] = (counts[p.cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredProducts,
    categoryCounts,
    categoryKeys,
    categoryMap,
    totalProductsCount: products.length,
  };
}
