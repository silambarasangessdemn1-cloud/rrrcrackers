"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Catalogue from "@/components/Catalogue";
import About from "@/components/About";
import SafetyGuidelines from "@/components/SafetyGuidelines";
import Footer from "@/components/Footer";
import PricelistModal from "@/components/PricelistModal";
import CartDrawer from "@/components/CartDrawer";
import Navbar from "@/components/Navbar";
import MaintenancePage from "@/components/MaintenancePage";
import { useSiteSettingsStore } from "@/store/useSiteSettingsStore";
import { Phone, MessageCircle } from "lucide-react";
import ComplianceModal from "@/components/ComplianceModal";

export default function Home() {
  const isInService = useSiteSettingsStore((state) => state.isInService);
  const settings = useSiteSettingsStore((state) => state.settings);
  const fetchSettings = useSiteSettingsStore((state) => state.fetchSettings);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchSettings();
  }, [fetchSettings]);

  if (hasMounted && !isInService) {
    return <MaintenancePage />;
  }

  const rawPhone = (settings?.phone || "+91 98659 02681").replace(/[^0-9+]/g, "");
  const rawWhatsApp = (settings?.whatsapp || "919865902681").replace(/[^0-9]/g, "");

  return (
    <main className="w-full flex flex-col bg-cream">
      <Navbar />
      <div className="flex flex-col flex-1 pt-32">
        <Hero />
        <Catalogue />
        <About />
        <SafetyGuidelines />
        <Footer />
        <PricelistModal />
      </div>
      <CartDrawer />
      <ComplianceModal />

      <aside
        className="fixed bottom-custom-24 left-custom-24 z-40 flex items-center gap-custom-10"
        aria-label="Quick contact"
      >
        <a
          href={`https://wa.me/${rawWhatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-semantic-success text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-150"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
        </a>
        <a
          href={`tel:${rawPhone}`}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary-600 hover:bg-primary-hover text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-150"
          aria-label="Direct Phone Call"
        >
          <Phone className="w-4 h-4 fill-white" />
        </a>
      </aside>
    </main>
  );
}
