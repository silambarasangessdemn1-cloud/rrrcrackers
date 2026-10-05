import { formatCurrency, HELPLINE_DISPLAY } from "./formatters";
import { useSiteSettingsStore } from "@/store/useSiteSettingsStore";

export function printPriceListDocument(products, categoryMap) {
  const settings = useSiteSettingsStore.getState().settings;
  const brandName = settings?.brandName || "RRR Crackers";

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const rowsHtml = products
    .map((p) => {
      const cat = categoryMap[p.cat] || { name: p.cat, ta: "" };
      return `
        <tr>
          <td class="col-id">${p.id}</td>
          <td><strong>${p.name}</strong></td>
          <td>${p.ta || ""}</td>
          <td>${cat.name}</td>
          <td class="col-price">₹${p.price}</td>
        </tr>
      `;
    })
    .join("");

  const documentHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${brandName} - 2026 Price List</title>
      <style>
        @page { size: A4; margin: 10mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1c1917; margin: 0; padding: 0; font-size: 11px; }
        .header { text-align: center; border-bottom: 2px solid #800000; padding-bottom: 8px; margin-bottom: 12px; }
        .title { color: #800000; font-size: 20px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .subtitle { color: #44403c; font-size: 11px; margin-top: 3px; }
        .meta { color: #d97706; font-size: 10px; font-weight: bold; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        th { background: #800000; color: #fff; text-align: left; padding: 5px 8px; font-size: 10px; text-transform: uppercase; }
        td { padding: 4px 8px; border-bottom: 1px solid #f3e8df; }
        tr:nth-child(even) td { background: #fef7ed; }
        .col-id { width: 30px; text-align: center; color: #78716c; }
        .col-price { text-align: right; font-weight: bold; color: #800000; }
        .footer { margin-top: 14px; text-align: center; font-size: 9px; color: #78716c; border-top: 1px solid #e5e7eb; padding-top: 6px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${brandName} &bull; SIVAKASI DIRECT</div>
        <div class="subtitle">Diwali 2026 Wholesale Price List &bull; Phone / WhatsApp: ${HELPLINE_DISPLAY}</div>
        <div class="meta">Minimum Order: ₹3,000 &bull; Valid 10/09/2026 to 02/11/2026</div>
      </div>
      <table>
        <thead>
          <tr>
            <th class="col-id">#</th>
            <th>Product Name</th>
            <th>தமிழ் பெயர்</th>
            <th>Category</th>
            <th style="text-align:right">Offer Price</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <div class="footer">
        &copy; 2026 ${brandName}. All rights reserved. Direct Sivakasi wholesale supply.
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
}

export function printOrderEstimateDocument({
  items = [],
  customerName = "",
  customerPhone = "",
  customerAddress = "",
  totalAmount = 0,
}) {
  const settings = useSiteSettingsStore.getState().settings;
  const brandName = settings?.brandName || "RRR Crackers";

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const rowsHtml = items
    .map((item, idx) => {
      const lineTotal = (item.product.price || 0) * item.quantity;
      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><strong>${item.product.name}</strong><br><small style="color:#78716c;">${item.product.ta || ""}</small></td>
          <td style="text-align:center;">${item.quantity}</td>
          <td style="text-align:right;">₹${item.product.price}</td>
          <td style="text-align:right; font-weight:bold; color:#800000;">₹${lineTotal}</td>
        </tr>
      `;
    })
    .join("");

  const documentHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${brandName} - Order Estimate</title>
      <style>
        @page { size: A4; margin: 12mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1c1917; margin: 0; padding: 0; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #800000; padding-bottom: 10px; margin-bottom: 15px; }
        .title { color: #800000; font-size: 22px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .subtitle { color: #44403c; font-size: 12px; margin-top: 4px; }
        .customer { background: #fef7ed; padding: 10px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #fde68a; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #800000; color: #fff; text-align: left; padding: 6px 10px; font-size: 11px; text-transform: uppercase; }
        td { padding: 6px 10px; border-bottom: 1px solid #f3e8df; }
        .total-box { margin-top: 15px; text-align: right; font-size: 16px; font-weight: bold; color: #800000; }
        .footer { margin-top: 25px; text-align: center; font-size: 10px; color: #78716c; border-top: 1px solid #e5e7eb; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${brandName} &bull; SIVAKASI DIRECT</div>
        <div class="subtitle">Diwali 2026 Order Estimate &bull; Helpline: ${HELPLINE_DISPLAY}</div>
      </div>
      ${
        customerName || customerPhone || customerAddress
          ? `
        <div class="customer">
          ${customerName ? `<div><strong>Customer Name:</strong> ${customerName}</div>` : ""}
          ${customerPhone ? `<div><strong>WhatsApp Phone:</strong> ${customerPhone}</div>` : ""}
          ${customerAddress ? `<div><strong>Delivery Address:</strong> ${customerAddress}</div>` : ""}
        </div>
      `
          : ""
      }
      <table>
        <thead>
          <tr>
            <th style="width:30px; text-align:center;">#</th>
            <th>Product Details</th>
            <th style="width:60px; text-align:center;">Qty</th>
            <th style="width:80px; text-align:right;">Rate</th>
            <th style="width:90px; text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <div class="total-box">
        Total Order Value: ${formatCurrency(totalAmount)}
      </div>
      <div class="footer">
        &copy; 2026 ${brandName}. This is an estimated order quote. Final order confirmation will be shared via WhatsApp.
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
}
