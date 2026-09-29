"use client";

import { Check } from "lucide-react";

const WHY_CHOOSE_ITEMS = [
  {
    title: "Direct Sivakasi Manufacturing",
    description: "Zero middleman commissions.",
  },
  {
    title: "Tamil Nadu Delivery",
    description: "Reliable delivery all across Tamil Nadu for ₹3,000+ orders.",
  },
  {
    title: "365 Days Availability",
    description: "We cater to weddings, temple festivals & Diwali.",
  },
  {
    title: "Bilingual Catalogue",
    description: "Tamil and English product names for easy clarity.",
  },
  {
    title: "Corrected & Real Images",
    description: "Dedicated visuals for every firecracker category.",
  },
];

export default function About() {
  return (
    <section id="about" className="w-full bg-cream section py-custom-28">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-custom-24 lg:gap-custom-36 p-custom-16 sm:p-custom-28 md:p-custom-48 items-center border border-accent-gold rounded-2xl">

        <div className="flex flex-col gap-custom-16">
          <div className="flex items-center gap-custom-12">
            <div className="flex flex-col">
              <h2 className="text-h3 font-heading font-bold text-text-primary">
                About RRR Crackers
              </h2>
              <span className="text-caption text-secondary">
                Sivakasi Direct Agency Quality Since 2026
              </span>
            </div>
          </div>

          <p className="text-body text-text-secondary leading-relaxed">
            RRR Crackers brings the rich tradition of Sivakasi firecrackers right to your doorstep. We provide factory-direct genuine crackers, festive combo packs, child-safe sparkles, vibrant fountains, and spectacular multi-color sky shots at unmatchable wholesale rates.
          </p>

          <p className="text-body text-text-secondary leading-relaxed">
            Our easy WhatsApp enquiry system allows you to select items, calculate live totals, and communicate directly with our sales team without middlemen markups.
          </p>
        </div>

        <div className="bg-gold-tint/80 border border-border-amber rounded-custom-16 p-custom-20 md:p-custom-24 flex flex-col gap-custom-16 shadow-xs">
          <div className="flex items-center gap-custom-8">
            <h3 className="text-body-lg font-bold text-text-primary">
              Why Choose RRR Crackers?
            </h3>
          </div>

          <div className="flex flex-col gap-custom-10">
            {WHY_CHOOSE_ITEMS.map((item, index) => (
              <div key={index} className="flex items-start gap-custom-8 text-body text-text-secondary">
                <Check className="w-custom-16 h-custom-16 text-semantic-success shrink-0 mt-2" />
                <p>
                  <span className="text-body font-medium text-text-primary">{item.title}:</span>{" "}
                  <span className="text-body-sm">{item.description}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
