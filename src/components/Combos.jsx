"use client";

import { useState } from "react";
import Image from "next/image";
import { openWhatsAppEnquiry } from "@/utils/whatsapp";
import { useSiteSettingsStore } from "@/store/useSiteSettingsStore";
import { X, ZoomIn } from "lucide-react";

export default function Combos() {
  const settings = useSiteSettingsStore((state) => state.settings);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOrderCombo = (comboName) => {
    const message = `*NEW COMBO ENQUIRY - RRR CRACKERS*\n----------------------------------------\nI would like to order the *${comboName}*.\nPlease provide the details and payment information.`;
    
    // Get raw whatsapp number from settings, fallback to default
    const rawWhatsApp = (settings?.whatsapp || "919865902681").replace(/[^0-9]/g, "");
    
    openWhatsAppEnquiry(message, rawWhatsApp);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
        Special Budget Combos
      </h2>
      
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
        {/* 3k Combo */}
        <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md border border-border-amber hover:shadow-lg transition-shadow w-full max-w-[400px]">
          <div 
            className="relative w-full rounded-xl overflow-hidden mb-4 cursor-pointer group flex items-center justify-center bg-cream/30"
            onClick={() => setSelectedImage("/images/3kbudget.jpeg")}
          >
            <Image 
              src="/images/3kbudget.jpeg" 
              alt="3k Budget Combo"
              width={800}
              height={1600}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white w-10 h-10" />
            </div>
          </div>
          <button 
            onClick={() => handleOrderCombo("3K Budget Combo")}
            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-hover text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Order for 3k Combo
          </button>
        </div>

        {/* 5k Combo */}
        <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md border border-border-amber hover:shadow-lg transition-shadow w-full max-w-[400px]">
          <div 
            className="relative w-full rounded-xl overflow-hidden mb-4 cursor-pointer group flex items-center justify-center bg-cream/30"
            onClick={() => setSelectedImage("/images/5kbudget.jpeg")}
          >
            <Image 
              src="/images/5kbudget.jpeg" 
              alt="5k Budget Combo"
              width={1066}
              height={1599}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white w-10 h-10" />
            </div>
          </div>
          <button 
            onClick={() => handleOrderCombo("5K Budget Combo")}
            className="w-full px-6 py-3 bg-semantic-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Order for 5k Combo
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
            aria-label="Close modal"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={selectedImage}
                alt="Full size combo"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
