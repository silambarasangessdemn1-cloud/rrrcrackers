"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Download,
  X,
  MessageSquare,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { useProductFilter } from "@/hooks/useProductFilter";
import { useScrollLock } from "@/hooks/useScrollLock";
import { printPriceListDocument } from "@/utils/pdfGenerator";
import { useSiteSettingsStore } from "@/store/useSiteSettingsStore";

export default function PricelistModal() {
  const [isOpen, setIsOpen] = useState(false);
  const products = useProductStore((state) => state.products);
  const categoryMap = useProductStore((state) => state.categoryMap);
  const categoryKeys = useProductStore((state) => state.categoryKeys);
  const settings = useSiteSettingsStore((state) => state.settings);
  const brandName = settings?.brandName || "RRR Crackers";

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    categoryCounts,
  } = useProductFilter("all");

  useScrollLock(isOpen);

  useEffect(() => {
    const handleHashChange = () => {
      setIsOpen(window.location.hash === "#pricelist");
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("open-pricelist", handleCustomOpen);

    const handleClickAnchor = (e) => {
      const anchor = e.target.closest('a[href="#pricelist"]');
      if (anchor) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("click", handleClickAnchor);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("open-pricelist", handleCustomOpen);
      document.removeEventListener("click", handleClickAnchor);
    };
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    if (window.location.hash === "#pricelist") {
      history.pushState(null, "", window.location.pathname + window.location.search);
    }
  };

  const handleDownloadPDF = () => {
    printPriceListDocument(products, categoryMap);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-custom-8 sm:p-custom-16 md:p-custom-24 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-cream rounded-custom-20 md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-border-amber"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary-950 text-cream px-custom-16 md:px-custom-20 py-custom-12 flex items-center justify-between gap-custom-12 border-b border-primary-900 shrink-0">
          <div className="flex items-center gap-custom-10">
            <Sparkles className="w-custom-20 h-custom-20 text-accent-gold shrink-0" />
            <div className="flex flex-col">
              <h2 className="text-body-lg md:text-h4 font-heading font-bold text-white leading-tight">
                {brandName} - 2026 Catalogue Price List
              </h2>
              <span className="text-custom-16 md:text-caption text-accent-gold font-medium">
                Sivakasi Direct Agency &bull; 10/09/2026 to 02/11/2026 &bull; Minimum Order &#8377;3,000
              </span>
            </div>
          </div>

          <div className="flex items-center gap-custom-8">
            <button
              onClick={handleDownloadPDF}
              className="px-custom-12 md:px-custom-16 py-custom-6 rounded-full bg-accent-gold hover:bg-amber-400 text-primary-950 font-bold text-caption md:text-body-sm flex items-center gap-custom-6 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-custom-12 h-custom-12 shrink-0" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={closeModal}
              className="w-custom-32 h-custom-32 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-custom-18 h-custom-18" />
            </button>
          </div>
        </div>

        <div className="bg-gold-tint/70 border-b border-border-amber px-custom-16 md:px-custom-20 py-custom-8 flex flex-wrap items-center justify-between gap-custom-12 shrink-0">
          <div className="flex items-center gap-custom-6 text-caption md:text-body-sm font-bold text-text-primary">
            <span>Itemized Price Table ({products.length} Items)</span>
          </div>

          <a
            href={`https://wa.me/919865902681?text=Hello%20${encodeURIComponent(brandName)},%20please%20send%20the%20official%20price%20list.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption md:text-body-sm text-semantic-success hover:underline font-bold flex items-center gap-custom-4"
          >
            <MessageSquare className="w-custom-12 h-custom-12" />
            <span>Request on WhatsApp</span>
          </a>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-custom-12 md:p-custom-16 border-b border-border-amber bg-white flex flex-col gap-custom-10 shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-custom-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-neutral" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search crackers in table..."
                  className="w-full pl-custom-36 pr-custom-12 py-custom-8 rounded-full border border-border-amber bg-cream text-body-sm text-text-primary focus:outline-none focus:border-primary-600 shadow-2xs"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-custom-16 py-custom-8 rounded-full border border-border-amber bg-cream text-body-sm text-text-primary font-medium focus:outline-none focus:border-primary-600 shadow-2xs cursor-pointer"
              >
                <option value="all">All Categories ({products.length})</option>
                {categoryKeys.map((catKey) => {
                  const cat = categoryMap[catKey] || { name: catKey };
                  const count = categoryCounts[catKey] || 0;
                  return (
                    <option key={catKey} value={catKey}>
                      {cat.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center justify-between text-caption text-text-secondary px-custom-4">
              <span>Showing {filteredProducts.length} crackers in catalogue</span>
              <span className="flex items-center gap-custom-4 text-semantic-success font-bold">
                <CheckCircle2 className="w-custom-12 h-custom-12" />
                Minimum Order &#8377;3,000
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto bg-cream">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="sticky top-0 bg-parchment border-b border-border-amber text-text-primary text-caption font-bold tracking-wider uppercase z-10">
                <tr>
                  <th className="py-custom-10 px-custom-12 w-12 text-center">#</th>
                  <th className="py-custom-10 px-custom-12">Product Name</th>
                  <th className="py-custom-10 px-custom-12">தமிழ் பெயர்</th>
                  <th className="py-custom-10 px-custom-12">Category</th>
                  <th className="py-custom-10 px-custom-12 text-right">Offer Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-body-sm">
                {filteredProducts.map((product) => {
                  const catInfo = categoryMap[product.cat] || { name: product.cat, ta: "" };
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gold-tint/50 transition-colors"
                    >
                      <td className="py-custom-10 px-custom-12 text-center text-caption text-text-neutral font-medium">
                        {product.id}
                      </td>
                      <td className="py-custom-10 px-custom-12 font-bold text-text-primary">
                        {product.name}
                      </td>
                      <td className="py-custom-10 px-custom-12 text-secondary font-medium">
                        {product.ta}
                      </td>
                      <td className="py-custom-10 px-custom-12 text-caption text-text-secondary">
                        {catInfo.name}
                      </td>
                      <td className="py-custom-10 px-custom-12 text-right font-extrabold text-primary-600 text-body">
                        &#8377;{product.price}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="py-custom-32 text-center text-text-neutral text-body-sm">
                No crackers found matching your filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
