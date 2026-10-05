import "../../globals.css";
import Link from "next/link";
import { ArrowLeft, Flame, LogOut } from "lucide-react";

import siteSettings from "@/config/siteSettings.json";

const brandName = siteSettings.brandName || "RRR Crackers";

export const metadata = {
  title: `Admin Dashboard – ${brandName} Price Manager`,
  description: `Update wholesale and MRP prices for ${brandName}. Synced live with storefront and LocalStorage.`,
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-full flex flex-col bg-mist text-text-primary antialiased">
        <header className="sticky top-0 z-40 bg-primary-950 border-b border-primary-900 text-cream px-custom-16 md:px-custom-24 py-custom-12 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-custom-12">
            <div className="w-custom-36 h-custom-36 rounded-custom-8 bg-accent-gold/20 border border-accent-gold/40 flex items-center justify-center text-accent-gold">
              <Flame className="w-custom-20 h-custom-20" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-custom-6">
                <span className="font-heading font-bold text-body-lg text-white uppercase">
                  {brandName}
                </span>
                <span className="px-custom-6 py-0.5 rounded-full bg-accent-gold text-primary-950 font-extrabold text-[10px] tracking-wider uppercase">
                  Admin Panel
                </span>
              </div>
              <span className="text-custom-16 text-cream/70">
                Sivakasi Direct Agency Inventory &bull; 2026 Catalogue Manager
              </span>
            </div>
          </div>

          <div className="flex items-center gap-custom-12">
            <Link
              href="/"
              className="inline-flex items-center gap-custom-6 px-custom-12 py-custom-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-caption md:text-body-sm font-bold border border-white/20 transition-colors"
            >
              <ArrowLeft className="w-custom-12 h-custom-12" />
              <span>Back to Storefront</span>
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-custom-6 px-custom-12 py-custom-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-caption md:text-body-sm font-bold border border-white/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-custom-12 h-custom-12" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto p-custom-16 md:p-custom-24">
          {children}
        </main>
    </div>
  );
}
