import "../globals.css";

export const metadata = {
  title: "RRR Crackers – Sivakasi Direct | Diwali 2026",
  description:
    "Shop premium Sivakasi firecrackers direct at wholesale prices. Free Tamil Nadu shipping on orders above ₹2,500. Diwali 2026 catalogue available.",
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
