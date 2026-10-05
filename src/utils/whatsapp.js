import { HELPLINE_PHONE, MIN_ORDER_AMOUNT, formatCurrency } from "./formatters";
import { useSiteSettingsStore } from "@/store/useSiteSettingsStore";

export function generateWhatsAppOrderMessage({
  items = [],
  customerName = "",
  customerPhone = "",
  customerAddress = "",
  totalItems = 0,
  totalAmount = 0,
}) {
  const settings = useSiteSettingsStore.getState().settings;
  const brandName = settings?.brandName || "RRR Crackers";

  let message = `*NEW CRACKERS ENQUIRY - ${brandName.toUpperCase()} (Diwali 2026)*\n`;
  message += `----------------------------------------\n`;
  if (customerName) message += `*Name:* ${customerName}\n`;
  if (customerPhone) message += `*Phone:* ${customerPhone}\n`;
  if (customerAddress) message += `*Address:* ${customerAddress}\n`;
  message += `----------------------------------------\n`;
  message += `*ORDER ITEMS:*\n`;

  items.forEach((item, index) => {
    const lineTotal = (item.product.price || 0) * item.quantity;
    message += `${index + 1}. ${item.product.name} (${item.product.ta || ""})\n`;
    message += `   Qty: ${item.quantity} × ₹${item.product.price} = ₹${lineTotal}\n`;
  });

  message += `----------------------------------------\n`;
  message += `*TOTAL ITEMS:* ${totalItems}\n`;
  message += `*TOTAL VALUE:* ${formatCurrency(totalAmount)}\n`;
  message += `*MINIMUM ORDER:* ${totalAmount >= MIN_ORDER_AMOUNT ? "Reached" : "Not Reached"}\n`;
  message += `----------------------------------------\n`;
  message += `Please confirm availability and dispatch details.`;

  return message;
}

export function openWhatsAppEnquiry(message, phone = HELPLINE_PHONE) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}
