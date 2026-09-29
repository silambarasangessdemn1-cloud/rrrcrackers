"use client";

import Image from "next/image";
import {
  FileText,
  ArrowDown,
  Truck,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { images } from "@/config/image";

const HERO_FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Genuine",
    description: "Sivakasi products",
  },
  {
    icon: Truck,
    title: "Tamil Nadu Delivery",
    description: "Reliable doorstep delivery",
  },
  {
    icon: Gift,
    title: "Wholesale Pricing",
    description: "Starting from ₹3,000",
  },
];

function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-custom-8">
      <div className="shrink-0 w-custom-32 h-custom-32 rounded-custom-8 bg-gold-tint flex items-center justify-center">
        <Icon className="w-custom-16 h-auto text-primary-600" />
      </div>

      <div className="flex flex-col gap-custom-2">
        <span className="text-body-sm font-bold text-text-primary">
          {title}
        </span>
        <span className="text-caption text-text-secondary">
          {description}
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="w-full bg-cream py-custom-32 section min-h-4xl flex items-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-custom-32 items-center">
        <div className="flex flex-col gap-custom-20 justify-start text-center md:text-left h-full">
          <div className="text-caption text-secondary">
            <span>Sivakasi Direct Agency • Wholesale Catalogue 2026</span>
          </div>

          <div className="flex flex-col gap-custom-12">
            <h1 className="max-w-5xl text-h2 text-text-primary">
              Premium Sivakasi Fireworks,
              <span className="block text-primary-600">
                Direct to Your Door.
              </span>
            </h1>

            <p className="text-body-lg text-text-secondary">
              Explore our 2026 wholesale collection of genuine Sivakasi fireworks,
              with transparent pricing, dependable quality, and delivery across
              Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-custom-12">
            {HERO_FEATURES.map((feature) => (
              <FeatureItem
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-custom-10">
            <a
              href="#catalogue"
              className="inline-flex items-center justify-center gap-custom-8 px-custom-24 py-custom-12 rounded-custom-8 bg-primary-600 hover:bg-primary-hover text-white text-button font-bold shadow-xs transition-colors duration-150 w-full sm:w-auto"
            >
              <span>Explore Catalogue</span>
              <ArrowDown className="w-custom-16 h-auto" />
            </a>

            <a
              href="#pricelist"
              className="inline-flex items-center justify-center gap-custom-8 px-custom-24 py-custom-12 rounded-custom-8 bg-white hover:bg-parchment border border-border-amber text-text-primary text-button font-bold shadow-2xs transition-colors duration-150 w-full sm:w-auto"
            >
              <FileText className="w-custom-16 h-auto text-primary-600" />
              <span>View Pricelist</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-custom-12 gap-y-custom-6 pt-custom-4 text-caption text-text-secondary">
            <span>
              Minimum order{" "}
              <strong className="font-bold text-text-primary">&#8377;3,000</strong>
            </span>

            <span className="hidden sm:inline text-border-amber">&bull;</span>

            <span>
              <strong className="font-bold text-semantic-success">
                Reliable delivery
              </strong>{" "}
              across Tamil Nadu
            </span>

            <span className="hidden sm:inline text-border-amber">&bull;</span>

            <span>
              Booking available{" "}
              <strong className="font-bold text-text-primary">365 days</strong>
            </span>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="relative w-full rounded-custom-20 md:rounded-custom-24 overflow-hidden shadow-card border border-border-amber bg-white">
            <Image
              src={images.catalogueBanner}
              alt="Light Up Your Celebration - RRR Crackers 2026 Catalogue"
              width={1200}
              height={900}
              priority
              className="w-full max-h-3xl h-auto object-center rounded-custom-20 md:rounded-custom-24 hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </div>

      </div>
    </section>
  );
}