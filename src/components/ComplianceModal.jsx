"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ShieldCheck, X } from "lucide-react";

import { useSiteSettingsStore } from "@/store/useSiteSettingsStore";

export default function ComplianceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useSiteSettingsStore((state) => state.settings);
  const brandName = settings?.brandName || "RRR Crackers";

  useEffect(() => {
    // Check if the user has already seen the modal in this session/ever
    const hasSeenModal = sessionStorage.getItem("hasSeenComplianceModal");
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenComplianceModal", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-primary-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-white w-7 h-7" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Welcome to {brandName}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-semantic-warning font-semibold text-lg">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-gray-900">Statutory Compliance & Legal Guidelines</h3>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
            <p>
              As per the <strong>2018 Supreme Court directive</strong>, direct online sales of firecrackers are restricted. We respect and uphold full legal compliance.
            </p>
            <p>
              Please add your desired items to the cart and <strong>submit an enquiry</strong>. Our team will verify stocks and confirm your order through WhatsApp or phone.
            </p>
            <p className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs md:text-sm text-gray-600 italic">
              All products are dispatched strictly through registered, licensed transport providers as governed by the Indian Explosives Act.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-hover text-white rounded-xl font-medium transition-colors shadow-sm hover:shadow-md flex justify-center items-center gap-2"
          >
            I Understand &bull; Browse Fireworks
          </button>
        </div>
      </div>
    </div>
  );
}
