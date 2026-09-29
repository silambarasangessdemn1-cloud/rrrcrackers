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
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-md bg-white">
      <div className="bg-linear-to-l from-primary-500 via-gradient-coral to-primary-600 text-cream flex items-center justify-center gap-custom-8 border-b border-primary-900 text-body-sm p-custom-8">
        Diwali 2026 Sivakasi Direct Agency Catalogue &bull; Minimum Order &#8377;3,000 with FREE Tamil Nadu Shipping
      </div>

      <div className="max-w-7xl mx-auto px-custom-8 flex items-center justify-between gap-custom-12 py-custom-16">

        <Link href="#home" className="flex items-center gap-custom-12 group shrink-0">
          <Image
            src={images.logo}
            alt="Logo"
            width={100}
            height={50}
            className="max-w-24 w-auto h-auto object-contain"
          />
          <div className="hidden lg:flex flex-col">
            <span className="text-h5 font-bold text-primary-900">
              RRR CRACKERS
            </span>
            <span className="text-overline text-primary-500">
              Sivakasi Direct Agency &bull; Diwali 2026
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-custom-24">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-custom-6 text-body text-text-primary hover:text-primary-600 transition-colors duration-150 py-custom-4"
            >
              {link.icon === "pricelist" && (
                <FileText className="w-custom-16 h-auto text-support-2" />
              )}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-custom-12 shrink-0">
          <div className="flex items-center gap-custom-8 mr-custom-4 border-r border-primary-200 pr-custom-12">
            <a
              href="https://www.instagram.com/rrr_crackers?stkn=ODJnb3ExYmRwM2t3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary hover:text-pink-600 transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-custom-20 h-auto" />
            </a>
            <a
              href="https://youtube.com/@rrrcrackers?si=yFvTmhrqBX7j39Fc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary hover:text-red-600 transition-colors"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-custom-20 h-auto" />
            </a>
          </div>

          <a
            href="https://wa.me/919865902681"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-custom-8 px-custom-16 py-custom-8 rounded-full border border-semantic-success/40 bg-semantic-success-accent hover:bg-semantic-success-accent/80 text-semantic-success text-body-sm font-bold tracking-tight transition-all duration-200 shadow-sm"
          >
            <MessageCircle className="w-custom-16 h-auto text-semantic-success fill-semantic-success/20" />
            <span>+91 98659 02681</span>
          </a>

          <button
            onClick={openCart}
            className="flex items-center gap-custom-8 px-custom-20 py-custom-8 rounded-full bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-body-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart: &#8377;{totalAmount.toLocaleString("en-IN")}</span>
          </button>
        </div>

        <div className="flex items-center gap-custom-8 sm:hidden">
          <button
            onClick={openCart}
            className="relative p-custom-8 rounded-full bg-primary-600 text-white shadow-sm cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-gold text-primary-950 font-extrabold text-[10px] rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-custom-8 rounded-custom-8 text-text-primary hover:text-primary-600 hover:bg-primary-50 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-primary-100 px-custom-16 pt-custom-12 pb-custom-20 space-y-custom-12 shadow-xl">
          <nav className="flex flex-col space-y-custom-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-custom-10 px-custom-12 py-custom-10 rounded-custom-8 text-body font-semibold text-text-primary hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {link.icon === "pricelist" && (
                  <FileText className="w-4 h-4 text-support-2" />
                )}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-custom-12 border-t border-primary-100 flex flex-col gap-custom-10">
            <div className="flex items-center justify-center gap-custom-16 py-custom-8 mb-custom-4">
              <a
                href="https://www.instagram.com/rrr_crackers?stkn=ODJnb3ExYmRwM2t3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-custom-6 text-body-sm font-medium text-text-primary hover:text-pink-600 transition-colors"
              >
                <InstagramIcon className="w-5 h-5 text-pink-500" />
                <span>Instagram</span>
              </a>
              <div className="w-px h-5 bg-primary-200"></div>
              <a
                href="https://youtube.com/@rrrcrackers?si=yFvTmhrqBX7j39Fc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-custom-6 text-body-sm font-medium text-text-primary hover:text-red-600 transition-colors"
              >
                <YoutubeIcon className="w-5 h-5 text-red-500" />
                <span>YouTube</span>
              </a>
            </div>
            
            <a
              href="https://wa.me/919865902681"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-custom-8 w-full py-custom-10 rounded-custom-8 border border-emerald-500 bg-emerald-50 text-emerald-800 text-body-sm font-bold shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>+91 98659 02681</span>
            </a>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-custom-8 w-full py-custom-10 rounded-custom-8 bg-linear-to-r from-primary-600 to-primary-700 text-white text-body-sm font-bold shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart: &#8377;0</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
