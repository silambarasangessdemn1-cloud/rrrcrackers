"use client";

import { useState } from "react";
import {
  ShoppingBag,
  X,
  Truck,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useScrollLock } from "@/hooks/useScrollLock";
import CartItemCard from "@/components/CartItemCard";
import { generateWhatsAppOrderMessage, openWhatsAppEnquiry } from "@/utils/whatsapp";
import { printOrderEstimateDocument } from "@/utils/pdfGenerator";
import { formatCurrency, MIN_ORDER_AMOUNT } from "@/utils/formatters";

export default function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  useScrollLock(isCartOpen);

  const progressPercent = Math.min(100, (totalAmount / MIN_ORDER_AMOUNT) * 100);
  const remainingAmount = Math.max(0, MIN_ORDER_AMOUNT - totalAmount);
  const belowMinOrder = totalAmount < MIN_ORDER_AMOUNT;

  const isNameMissing = !customerName.trim();
  const isPhoneMissing = !customerPhone.trim();
  const isAddressMissing = !customerAddress.trim();
  const hasMissingDetails = isNameMissing || isPhoneMissing || isAddressMissing;

  const handleSendWhatsApp = () => {
    if (items.length === 0) return;

    if (belowMinOrder || hasMissingDetails) {
      setShowValidation(true);
      return;
    }

    const message = generateWhatsAppOrderMessage({
      items,
      customerName,
      customerPhone,
      customerAddress,
      totalItems,
      totalAmount,
    });
    openWhatsAppEnquiry(message);
    clearCart();
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("rrr_cart_storage");
      } catch (e) {
        console.error("Error removing rrr_cart_storage:", e);
      }
    }
  };

  const handlePrintEstimate = () => {
    if (items.length === 0) return;
    printOrderEstimateDocument({
      items,
      customerName,
      customerPhone,
      customerAddress,
      totalAmount,
    });
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-custom-10">
        <div className="w-screen max-w-md bg-cream shadow-2xl flex flex-col border-l border-border-amber">

          <div className="bg-white p-custom-16 border-b border-border-amber flex items-center justify-between gap-custom-12 shrink-0">
            <div className="flex items-center gap-custom-10">
              <div className="w-custom-40 h-custom-40 rounded-full bg-primary-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <ShoppingBag className="w-custom-20 h-custom-20" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-body-lg font-heading font-bold text-text-primary leading-tight">
                  Your Crackers Cart
                </h2>
                <span className="text-caption text-text-secondary">
                  {totalItems} {totalItems === 1 ? "item" : "items"} selected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-custom-12">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-body-sm text-text-neutral hover:text-primary-600 font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={closeCart}
                className="w-custom-36 h-custom-36 rounded-full bg-parchment hover:bg-gold-tint text-text-primary flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-custom-20 h-custom-20" />
              </button>
            </div>
          </div>

          <div className="bg-gold-tint/80 border-b border-border-amber px-custom-16 py-custom-8 flex flex-col gap-custom-6 shrink-0">
            <div className="flex items-center justify-between text-caption font-bold">
              <div className="flex items-center gap-custom-6 text-text-primary">
                <Truck className="w-custom-12 h-custom-12 text-primary-600" />
                <span>Min. Order: &#8377;3,000</span>
              </div>
              <div>
                {remainingAmount > 0 ? (
                  <span className="text-primary-600">
                    Add &#8377;{remainingAmount.toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="text-semantic-success flex items-center gap-custom-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Minimum Order Reached
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-border-amber/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-custom-16 flex flex-col gap-custom-12">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-custom-32 gap-custom-12">
                <div className="flex flex-col gap-custom-4">
                  <h3 className="text-body-lg font-bold text-text-primary">
                    Your cart is empty
                  </h3>
                  <p className="text-caption text-text-secondary max-w-xs">
                    Explore our 2026 catalogue and add genuine Sivakasi firecrackers to your cart.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-custom-20 py-custom-8 rounded-full bg-primary-600 hover:bg-primary-hover text-white font-bold text-body-sm shadow-xs transition-colors cursor-pointer"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              items.map((item) => (
                <CartItemCard
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="bg-white border-t border-border-amber p-custom-16 flex flex-col gap-custom-12 shrink-0 shadow-lg">
              <div className="flex items-baseline justify-between">
                <span className="text-body-lg font-bold text-text-primary">
                  Total Value
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-h3 font-heading font-extrabold text-primary-600 leading-none">
                    {formatCurrency(totalAmount)}
                  </span>
                  <span className="text-caption font-bold text-semantic-success mt-custom-2">
                    {totalAmount >= MIN_ORDER_AMOUNT
                      ? "Minimum Order Reached"
                      : `Add ₹${remainingAmount.toLocaleString("en-IN")} to place order`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-custom-8 pt-custom-4">
                <input
                  type="text"
                  placeholder="Your Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-custom-12 py-custom-8 rounded-custom-8 border bg-cream text-body-sm text-text-primary placeholder:text-text-neutral focus:outline-none focus:border-primary-600 ${
                    showValidation && isNameMissing ? "border-red-500" : "border-border-amber"
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Mobile Number (WhatsApp) *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full px-custom-12 py-custom-8 rounded-custom-8 border bg-cream text-body-sm text-text-primary placeholder:text-text-neutral focus:outline-none focus:border-primary-600 ${
                    showValidation && isPhoneMissing ? "border-red-500" : "border-border-amber"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Delivery Address & City / District *"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className={`w-full px-custom-12 py-custom-8 rounded-custom-8 border bg-cream text-body-sm text-text-primary placeholder:text-text-neutral focus:outline-none focus:border-primary-600 ${
                    showValidation && isAddressMissing ? "border-red-500" : "border-border-amber"
                  }`}
                />
              </div>

              {showValidation && (hasMissingDetails || belowMinOrder) && (
                <div className="flex items-start gap-custom-6 px-custom-12 py-custom-8 rounded-custom-8 bg-red-50 border border-red-200 text-caption text-red-700 font-semibold">
                  <AlertCircle className="w-custom-14 h-custom-14 shrink-0 mt-0.5" />
                  <span>
                    {hasMissingDetails && belowMinOrder
                      ? `Please fill in your name, mobile number & address, and add ₹${remainingAmount.toLocaleString("en-IN")} more to reach the ₹3,000 minimum order.`
                      : hasMissingDetails
                        ? "Please fill in your name, mobile number & address to place the order."
                        : `Minimum order is ₹3,000. Add ₹${remainingAmount.toLocaleString("en-IN")} more to place your order.`}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-custom-8 pt-custom-4">
                <button
                  onClick={handleSendWhatsApp}
                  aria-disabled={hasMissingDetails || belowMinOrder}
                  className={`flex-1 py-custom-12 px-custom-16 rounded-custom-12 text-white font-bold text-body-sm flex items-center justify-center gap-custom-8 shadow-md transition-colors cursor-pointer ${
                    hasMissingDetails || belowMinOrder
                      ? "bg-neutral-400 hover:bg-neutral-500"
                      : "bg-semantic-success hover:bg-emerald-700"
                  }`}
                >
                  <Send className="w-custom-16 h-custom-16" />
                  <span>Send Order Enquiry on WhatsApp</span>
                </button>

                <button
                  onClick={handlePrintEstimate}
                  className="w-custom-44 h-custom-44 rounded-custom-12 border border-border-amber bg-cream hover:bg-parchment text-secondary flex items-center justify-center shadow-xs transition-colors shrink-0 cursor-pointer"
                  title="Download / Print Bill Estimate"
                  aria-label="Download or print bill estimate"
                >
                  <FileText className="w-custom-18 h-custom-18" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-custom-6 text-caption text-secondary pt-custom-2">
                <CheckCircle2 className="w-custom-12 h-custom-12 text-semantic-success" />
                <span>Direct confirmation by RRR Crackers team</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
