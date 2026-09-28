export const MIN_ORDER_AMOUNT = 2500;
export const HELPLINE_PHONE = "919865902681";
export const HELPLINE_DISPLAY = "+91 98659 02681";

export function formatCurrency(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function calculateDiscount(fullPrice, sellingPrice) {
  if (!fullPrice || !sellingPrice || fullPrice <= sellingPrice) return 0;
  return Math.round(((fullPrice - sellingPrice) / fullPrice) * 100);
}

export function calculateSavings(fullPrice, sellingPrice) {
  if (!fullPrice || !sellingPrice || fullPrice <= sellingPrice) return 0;
  return fullPrice - sellingPrice;
}
