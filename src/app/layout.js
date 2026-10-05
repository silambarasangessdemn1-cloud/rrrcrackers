import "../globals.css";
import siteSettings from "@/config/siteSettings.json";

const brandName = siteSettings.brandName || "RRR Crackers";

export const metadata = {
  title: `${brandName} – Sivakasi Direct Agency | Diwali 2026`,
  description:
    "Shop premium Sivakasi firecrackers direct at wholesale prices. Minimum order ₹3,000. Diwali 2026 catalogue available.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className="min-h-full flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}
