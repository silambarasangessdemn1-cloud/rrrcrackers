"use client";

import { MapPin, Phone, MessageSquare } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-primary-950 text-cream py-custom-28 px-custom-16 border-t border-primary-900">
      <div className="max-w-7xl mx-auto flex flex-col gap-custom-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-custom-24 items-start md:items-center justify-between">

          <div className="flex flex-col gap-custom-8">
            <h2 className="text-h4 font-heading font-bold text-accent-gold">
              Contact RRR Crackers
            </h2>
            <p className="text-caption text-cream/80">
              Sivakasi Direct Agency Crackers &bull; Tamil Nadu
            </p>
            <div className="flex items-start gap-custom-6 text-caption text-cream/90 mt-custom-4">
              <MapPin className="w-custom-16 h-custom-16 text-accent-gold shrink-0 mt-0.5" />
              <span>SFNO545/1B SURYA NAGAR BUSSTOP,<br/>POONDI RING ROAD,<br/>RAKKIYAPALAYAM VILLAGE AVINASHI,<br/>TIRUPPUR</span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-custom-10 mt-custom-8 flex-wrap">
              <a
                href="https://www.instagram.com/rrr_crackers?stkn=ODJnb3ExYmRwM2t3"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-custom-6 px-custom-12 py-custom-6 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-cream hover:text-white border border-white/15 text-caption font-bold transition-all duration-200 shadow-xs hover:scale-105"
                aria-label="Follow RRR Crackers on Instagram"
              >
                <InstagramIcon className="w-custom-16 h-custom-16 text-pink-400 group-hover:text-white shrink-0 transition-colors" />
                <span>Instagram</span>
              </a>

              <a
                href="https://youtube.com/@rrrcrackers?si=yFvTmhrqBX7j39Fc"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-custom-6 px-custom-12 py-custom-6 rounded-full bg-white/10 hover:bg-red-600 text-cream hover:text-white border border-white/15 text-caption font-bold transition-all duration-200 shadow-xs hover:scale-105"
                aria-label="Subscribe to RRR Crackers on YouTube"
              >
                <YoutubeIcon className="w-custom-16 h-custom-16 text-red-500 group-hover:text-white shrink-0 transition-colors" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-custom-6">
            <span className="text-overline font-bold tracking-wider text-accent-gold uppercase">
              Direct WhatsApp & Helpline
            </span>
            <a
              href="tel:+919865902681"
              className="flex items-center gap-custom-8 text-h4 font-bold text-white hover:text-accent-gold transition-colors"
            >
              <Phone className="w-custom-20 h-custom-20 text-semantic-success shrink-0" />
              <span>+91 98659 02681</span>
            </a>
            <span className="text-caption text-cream/70">
              Available 365 Days &bull; Quick WhatsApp replies
            </span>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-custom-10 w-full md:max-w-xs md:ml-auto">
            <a
              href="https://wa.me/919865902681?text=Hello%20RRR%20Crackers,%20please%20send%20the%20latest%202026%20catalogue."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-custom-10 px-custom-20 rounded-full bg-semantic-success hover:bg-emerald-600 text-white font-bold text-body-sm flex items-center justify-center gap-custom-8 shadow-md transition-colors"
            >
              <MessageSquare className="w-custom-16 h-custom-16 shrink-0" />
              <span>Request Latest Catalogue</span>
            </a>

            <a
              href="tel:+919865902681"
              className="w-full py-custom-10 px-custom-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-body-sm flex items-center justify-center gap-custom-8 transition-colors"
            >
              <Phone className="w-custom-16 h-custom-16 shrink-0" />
              <span>Call Us Directly</span>
            </a>
          </div>

        </div>

        <div className="border-t border-primary-900/80 pt-custom-16 flex flex-col sm:flex-row items-center justify-between gap-custom-8 text-center sm:text-left">
          <p className="text-caption text-cream/60">
            &copy; 2026 RRR Crackers. All rights reserved. Final availability, prices, and delivery terms can be confirmed directly with RRR Crackers.
          </p>
          <a
            href="/admin"
            className="text-custom-16 text-cream/40 hover:text-accent-gold transition-colors font-medium tracking-wider uppercase shrink-0"
          >
            Admin Portal &rarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
