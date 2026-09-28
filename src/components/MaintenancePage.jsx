"use client";

import { useState } from "react";
import {
  Flame,
  Wrench,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useSiteSettingsStore } from "@/store/useSiteSettingsStore";
import { images } from "@/config/image";
import Image from "next/image";

export default function MaintenancePage({ customSettings }) {
  const storeSettings = useSiteSettingsStore((state) => state.settings);
  const settings = customSettings || storeSettings;
  const fetchSettings = useSiteSettingsStore((state) => state.fetchSettings);
  const [isChecking, setIsChecking] = useState(false);
  const [checkStatusText, setCheckStatusText] = useState("");

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setCheckStatusText("Checking site status...");
    try {
      const data = await fetchSettings();
      if (data && data.isInService) {
        setCheckStatusText("Site is back online! Reloading...");
        window.location.reload();
      } else {
        setTimeout(() => {
          setCheckStatusText(
            "Site is still undergoing scheduled maintenance. Thank you for your patience!"
          );
          setIsChecking(false);
        }, 800);
      }
    } catch {
      setTimeout(() => {
        setCheckStatusText(
          "Could not verify status. Please try again or contact via WhatsApp."
        );
        setIsChecking(false);
      }, 800);
    }
  };

  const phoneNum = settings?.phone || "+91 98659 02681";
  const whatsappNum = settings?.whatsapp || "919865902681";
  const rawWhatsApp = whatsappNum.replace(/[^0-9]/g, "");
  const rawPhone = phoneNum.replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(
    "Hello RRR Crackers team! I would like to inquire about Diwali 2026 crackers & wholesale prices."
  )}`;

  return (
    <div className="min-h-screen bg-[#140202] text-cream flex flex-col justify-between relative overflow-hidden selection:bg-accent-gold selection:text-primary-950">
      {/* Background Decorative Fireworks Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-accent-gold/20 rounded-full blur-3xl" />
        <div className="absolute top-64 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/15 rounded-full blur-3xl" />
      </div>

      {/* Decorative Floating Sparkle Icons */}
      <div className="absolute top-12 left-10 text-accent-gold/20 animate-pulse pointer-events-none">
        <Sparkles className="w-custom-36 h-custom-36" />
      </div>
      <div className="absolute top-40 right-16 text-accent-gold/25 animate-bounce pointer-events-none duration-1000">
        <Flame className="w-custom-32 h-custom-32" />
      </div>
      <div className="absolute bottom-32 left-16 text-primary-400/20 animate-pulse pointer-events-none">
        <Sparkles className="w-custom-28 h-custom-28" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-custom-16 pt-custom-24 pb-custom-12 flex items-center justify-between gap-custom-12">
        <div className="flex items-center gap-custom-10">
          <Image
            src={images.logo}
            alt="logo"
            width={44}
            height={44}
            className="w-custom-40 h-custom-40 max-h-custom-52 object-cover rounded-full aspect-square shadow-md shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-heading font-black text-h4 tracking-wider text-white">
              RRR CRACKERS
            </span>
            <p className="text-caption font-bold text-accent-gold tracking-widest uppercase">
              Sivakasi Direct &bull; Festival Fireworks
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-custom-6 px-custom-12 py-custom-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-caption font-semibold shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>Maintenance Mode</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-custom-16 py-custom-28 flex flex-col items-center text-center my-auto">
        {/* Wrench & Spark Icon Box */}
        <div className="relative mb-custom-20">
          <div className="w-custom-88 h-custom-88 rounded-custom-28 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 p-[2px] shadow-2xl shadow-primary-950/80">
            <div className="w-full h-full bg-[#1e0707] rounded-custom-24 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-accent-gold/10 via-transparent to-transparent opacity-70" />
              <div className="relative flex items-center justify-center">
                <Wrench className="w-custom-44 h-custom-44 text-accent-gold animate-pulse stroke-[2.2]" />
              </div>
            </div>
          </div>
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-primary-500 text-primary-950 text-caption font-black uppercase px-custom-12 py-0.5 rounded-full shadow-md tracking-wider whitespace-nowrap">
            Upgrading 2026 Catalogue
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-custom-8 mb-custom-20">
          <h1 className="text-h1 font-heading font-black text-white tracking-tight leading-tight">
            {settings?.title || "Currently Under Maintenance"}
          </h1>
          <p className="text-h4 font-heading font-bold text-accent-gold">
            {settings?.subtitle || "எங்கள் தளம் தற்காலிகமாக பராமரிப்பில் உள்ளது"}
          </p>
        </div>

        {/* Maintenance Message Card */}
        <div className="w-full bg-[#200808]/90 border border-primary-800/60 backdrop-blur-md rounded-custom-20 p-custom-20 shadow-xl mb-custom-24 text-left relative">
          <div className="flex items-start gap-custom-12">
            <div className="p-custom-8 rounded-custom-8 bg-accent-gold/10 border border-accent-gold/20 text-accent-gold shrink-0 mt-custom-2">
              <Clock className="w-custom-20 h-custom-20" />
            </div>
            <div className="space-y-custom-8 text-cream/90 text-body leading-relaxed flex-1">
              <p>
                {settings?.maintenanceMessage ||
                  "We are currently updating our Sivakasi fireworks inventory, festival discounts, and 2026 Diwali catalogue rates. We will be back online shortly!"}
              </p>
              {settings?.estimatedTime && (
                <div className="pt-custom-8 flex items-center gap-custom-8 text-caption font-semibold text-accent-gold-light border-t border-primary-900/60">
                  <CheckCircle2 className="w-custom-16 h-custom-16 text-accent-gold shrink-0" />
                  <span>{settings.estimatedTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Urgent Contact & Direct Offline Orders Card */}
        <div className="w-full bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-custom-20 p-custom-20 mb-custom-24 text-center">
          <h2 className="text-caption font-bold uppercase tracking-widest text-cream/70 mb-custom-16 flex items-center justify-center gap-custom-6">
            <ShieldCheck className="w-custom-16 h-custom-16 text-semantic-success" />
            <span>Direct Orders & Enquiries Still Open</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch gap-custom-12">
            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-custom-8 px-custom-20 py-custom-12 rounded-custom-12 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-body-sm shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-custom-20 h-custom-20 fill-white shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${rawPhone}`}
              className="flex-1 flex items-center justify-center gap-custom-8 px-custom-20 py-custom-12 rounded-custom-12 bg-primary-600 hover:bg-primary-hover text-white font-bold text-body-sm border border-primary-500/40 shadow-lg shadow-primary-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-custom-16 h-custom-16 fill-white shrink-0" />
              <span>Call Us: {phoneNum}</span>
            </a>
          </div>
        </div>

        {/* Check Status Refresh Button */}
        <div className="flex flex-col items-center gap-custom-10">
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="inline-flex items-center gap-custom-8 px-custom-20 py-custom-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-cream text-body-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-custom-16 h-custom-16 text-accent-gold ${
                isChecking ? "animate-spin" : ""
              }`}
            />
            <span>{isChecking ? "Checking Status..." : "Check If Site Is Live"}</span>
          </button>

          {checkStatusText && (
            <p className="text-caption text-amber-200/90 font-medium animate-in fade-in duration-200">
              {checkStatusText}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
