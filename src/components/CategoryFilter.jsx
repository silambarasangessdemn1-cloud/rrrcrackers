"use client";

import { memo } from "react";
import { useProductStore } from "@/store/useProductStore";

function CategoryFilterComponent({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
}) {
  const categoryKeys = useProductStore((state) => state.categoryKeys);
  const categoryMap = useProductStore((state) => state.categoryMap);

  return (
    <div className="flex items-center gap-custom-6 overflow-x-auto pb-custom-4 hide-scrollbar">
      <button
        onClick={() => onSelectCategory("all")}
        className={`inline-flex items-center gap-custom-6 px-custom-12 py-custom-6 rounded-full text-caption font-bold tracking-tight whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 shadow-2xs ${selectedCategory === "all"
            ? "bg-primary-600 text-white shadow-xs"
            : "bg-parchment text-text-primary border border-border-amber hover:bg-gold-tint hover:border-primary-500/40"
          }`}
      >
        <span>All Crackers</span>
        <span
          className={`px-custom-6 py-0.5 rounded-full text-custom-12 ${selectedCategory === "all"
              ? "bg-white/20 text-white"
              : "bg-white text-secondary font-extrabold"
            }`}
        >
          {totalCount}
        </span>
      </button>

      {categoryKeys.map((catKey) => {
        const cat = categoryMap[catKey] || { name: catKey };
        const isSelected = selectedCategory === catKey;
        const count = categoryCounts[catKey] || 0;

        return (
          <button
            key={catKey}
            onClick={() => onSelectCategory(catKey)}
            className={`inline-flex items-center gap-custom-6 px-custom-12 py-custom-6 rounded-full text-caption font-bold tracking-tight whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 shadow-2xs ${isSelected
                ? "bg-primary-600 text-white shadow-xs"
                : "bg-parchment text-text-primary border border-border-amber hover:bg-gold-tint hover:border-primary-500/40"
              }`}
          >
            <span>{cat.name}</span>
            <span
              className={`px-custom-6 py-0.5 rounded-full text-custom-12 ${isSelected
                  ? "bg-white/20 text-white"
                  : "bg-white text-secondary font-extrabold"
                }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export const CategoryFilter = memo(CategoryFilterComponent);
export default CategoryFilter;
