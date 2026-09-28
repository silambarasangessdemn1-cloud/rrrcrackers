"use client";

import { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useProductFilter } from "@/hooks/useProductFilter";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

export default function Catalogue() {
  const {
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
    totalProductsCount,
  } = useProductFilter("all");

  const [collapsedCategories, setCollapsedCategories] = useState({});

  const toggleCategoryCollapse = (catKey) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  // Group products by category
  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach((product) => {
      const catKey = product.cat || "other";
      if (!groups[catKey]) {
        groups[catKey] = [];
      }
      groups[catKey].push(product);
    });
    return groups;
  }, [filteredProducts]);

  const activeCategoryKeys = useMemo(() => {
    if (selectedCategory !== "all") {
      return groupedProducts[selectedCategory] ? [selectedCategory] : [];
    }
    return categoryKeys.filter((key) => groupedProducts[key] && groupedProducts[key].length > 0);
  }, [selectedCategory, groupedProducts, categoryKeys]);

  return (
    <section id="catalogue" className="w-full bg-cream px-custom-20 pb-custom-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8">

        <div className="sticky top-25 z-30 bg-cream/95 backdrop-blur-md pt-custom-48 pb-custom-24 border-b border-amber-200/80 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crackers (e.g. Sparklers, மத்தாப்பு, Bomb, Shots)..."
                className="w-full pl-11 pr-10 py-2.5 rounded-full border border-amber-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000] shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Counter */}
            <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
              <div className="relative flex-1 sm:flex-initial">
                <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-2.5 rounded-full border border-amber-300 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:border-[#990000] shadow-xs cursor-pointer"
                >
                  <option value="default">Default Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>

              <span className="inline-flex px-3.5 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shrink-0">
                {filteredProducts.length} Items
              </span>
            </div>
          </div>

          {/* Category Pill Filters */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
            totalCount={totalProductsCount}
          />
        </div>

        {/* Product Sections Grouped by Category */}
        {activeCategoryKeys.length > 0 ? (
          <div className="flex flex-col gap-8 md:gap-10 pb-12">
            {activeCategoryKeys.map((catKey) => {
              const catInfo = categoryMap[catKey] || { name: catKey, ta: "" };
              const categoryProducts = groupedProducts[catKey] || [];
              const isCollapsed = !!collapsedCategories[catKey];

              return (
                <div key={catKey} className="flex flex-col gap-3 sm:gap-4 scroll-mt-36" id={`category-${catKey}`}>
                  {/* Category Header Bar (Image 1 reference) */}
                  <div
                    onClick={() => toggleCategoryCollapse(catKey)}
                    className="w-full bg-gradient-to-r from-[#7a0c0c] via-[#8f1212] to-[#600606] text-white rounded-2xl md:rounded-3xl px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between shadow-md cursor-pointer hover:brightness-105 transition-all select-none"
                  >
                    {/* Left: Sparkle Icon + Category English & Tamil Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col min-w-0">
                        <h2 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-wider text-white truncate">
                          {catInfo.name}
                        </h2>
                        {catInfo.ta && (
                          <span className="text-xs sm:text-sm font-medium text-amber-300 truncate">
                            {catInfo.ta}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Items Count Badge + Collapse Chevron */}
                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs sm:text-sm font-black shadow-xs">
                        {categoryProducts.length} Items
                      </span>
                      <button
                        type="button"
                        aria-label={isCollapsed ? "Expand category" : "Collapse category"}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#520505] hover:bg-[#3d0303] text-white flex items-center justify-center transition-colors shadow-inner cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : "rotate-0"
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Product Cards Stack */}
                  {!isCollapsed && (
                    <div className="flex flex-col gap-3 sm:gap-4 transition-all duration-200">
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <span className="text-xl md:text-2xl font-black text-slate-800">
              No crackers found
            </span>
            <p className="text-sm text-slate-500 max-w-md">
              No products match your search query &quot;{searchQuery}&quot;. Try searching for &apos;Sparklers&apos;, &apos;Chakkar&apos;, &apos;Bomb&apos;, &apos;மத்தாப்பு&apos;, or select &apos;All Crackers&apos;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#990000] hover:bg-[#800000] text-white text-sm font-bold transition-colors cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}