"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShoppingCart,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

const InstagramIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

import Image from "next/image";
import { images } from "@/config/image";

import { useCartStore } from "@/store/useCartStore";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Crackers Catalogue", href: "#catalogue" },
  { label: "2026 Pricelist", href: "#pricelist", icon: "pricelist" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-sm bg-white/95 backdrop-blur-md border-b border-primary-100">
      {/* Top Notification Bar */}
      <div className="bg-linear-to-r from-primary-800 via-primary-600 to-primary-800 text-cream flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium py-2 px-4 text-center tracking-wide">
        <Sparkles className="w-3 h-3 text-accent-gold hidden sm:block" />
        <span>Diwali 2026 Sivakasi Direct Agency Catalogue &bull; Minimum Order &#8377;3,000 with <strong className="text-accent-gold">FREE Tamil Nadu Shipping</strong></span>
        <Sparkles className="w-3 h-3 text-accent-gold hidden sm:block" />
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link href="#home" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
              <Image
                src={images.logo}
                alt="RRR Crackers Logo"
                fill
                className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="hidden md:flex flex-col justify-center">
              <span className="text-lg font-black text-primary-900 leading-tight tracking-tight">
                RRR CRACKERS
              </span>
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                Sivakasi Direct
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors duration-200 py-2"
              >
                {link.icon === "pricelist" && (
                  <FileText className="w-4 h-4 text-accent-gold" />
                )}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Action Area (Desktop/Tablet) */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {/* Social Icons */}
            <div className="hidden lg:flex items-center gap-3 mr-2 border-r border-slate-200 pr-5">
              <a
                href="https://www.instagram.com/rrr_crackers?stkn=ODJnb3ExYmRwM2t3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-pink-50 hover:text-pink-600 transition-colors border border-slate-100"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@rrrcrackers?si=yFvTmhrqBX7j39Fc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-100"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919865902681"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>+91 98659 02681</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-sm hover:shadow transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>&#8377;{totalAmount.toLocaleString("en-IN")}</span>
              {totalItems > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 sm:hidden">
            <button
              onClick={openCart}
              className="relative p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-gold text-primary-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
              >
                {link.icon === "pricelist" ? (
                  <FileText className="w-5 h-5 text-accent-gold" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-100" />
                )}
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
              <a
                href="https://wa.me/919865902681"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Us</span>
              </a>
              <div className="flex items-center justify-center gap-4 py-2">
                <a
                  href="https://www.instagram.com/rrr_crackers?stkn=ODJnb3ExYmRwM2t3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-pink-600"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@rrrcrackers?si=yFvTmhrqBX7j39Fc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-red-600"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
