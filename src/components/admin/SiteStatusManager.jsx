"use client";

import { useState, useEffect } from "react";
import {
  Power,
  Wrench,
  Check,
  Eye,
  Sliders,
  AlertTriangle,
  X,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useSiteSettingsStore } from "@/store/useSiteSettingsStore";
import MaintenancePage from "@/components/MaintenancePage";

export default function SiteStatusManager() {
  const isInService = useSiteSettingsStore((state) => state.isInService);
  const settings = useSiteSettingsStore((state) => state.settings);
  const isSaving = useSiteSettingsStore((state) => state.isSaving);
  const toggleServiceStatus = useSiteSettingsStore((state) => state.toggleServiceStatus);
  const updateSiteSettings = useSiteSettingsStore((state) => state.updateSiteSettings);
  const fetchSettings = useSiteSettingsStore((state) => state.fetchSettings);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Local form state for settings modal
  const [formData, setFormData] = useState({
    brandName: "",
    title: "",
    subtitle: "",
    maintenanceMessage: "",
    estimatedTime: "",
    phone: "",
    whatsapp: "",
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        brandName: settings.brandName || "RRR Crackers",
        title: settings.title || "Currently Under Maintenance",
        subtitle: settings.subtitle || "எங்கள் தளம் தற்காலிகமாக பராமரிப்பில் உள்ளது",
        maintenanceMessage:
          settings.maintenanceMessage ||
          "We are currently updating our Sivakasi fireworks inventory, festival discounts, and 2026 Diwali catalogue rates. We will be back online shortly!",
        estimatedTime: settings.estimatedTime || "Diwali 2026 Season Specials Coming Soon",
        phone: settings.phone || "+91 98659 02681",
        whatsapp: settings.whatsapp || "919865902681",
      });
    }
  }, [settings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = async () => {
    const nextState = !isInService;
    const res = await toggleServiceStatus(nextState);
    if (res && res.success) {
      showToast(
        nextState
          ? "🟢 Site is now LIVE and In Service! Frontpage is visible to all visitors."
          : "🔴 Site is now NOT IN SERVICE (Maintenance Mode active). Frontpage is hidden."
      );
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const res = await updateSiteSettings(formData);
    if (res && res.success) {
      setIsConfigModalOpen(false);
      showToast("✅ Maintenance settings saved and updated successfully!");
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary-950 text-white border border-accent-gold/40 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm font-semibold text-cream">{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Control Card */}
      <div
        className={`rounded-2xl border transition-all shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isInService
            ? "bg-gradient-to-r from-emerald-950/10 via-emerald-900/5 to-white border-emerald-300/80"
            : "bg-gradient-to-r from-amber-950/15 via-red-950/10 to-white border-amber-400"
        }`}
      >
        {/* Left Side: Status Icon and Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isInService
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-amber-600 text-white shadow-amber-600/30"
            }`}
          >
            {isInService ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <Wrench className="w-6 h-6 animate-pulse" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-extrabold text-base sm:text-lg text-text-primary">
                Site Service Status:
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isInService
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isInService ? "bg-emerald-600 animate-pulse" : "bg-red-600"
                  }`}
                />
                {isInService ? "In Service (Live)" : "Not in Service (Maintenance)"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary">
              {isInService
                ? "🟢 Storefront is live. Visitors can browse crackers catalogue, view prices, and place cart orders."
                : "🔴 Storefront is hidden. Visitors see the festive Maintenance Screen with offline WhatsApp/Call contact."}
            </p>
          </div>
        </div>

        {/* Right Side: Toggle & Control Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Preview Maintenance Button */}
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-mist text-text-secondary border border-border-amber text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Preview how visitors see the maintenance page"
          >
            <Eye className="w-3.5 h-3.5 text-accent-gold" />
            <span>Preview Maintenance</span>
          </button>

          {/* Edit Maintenance Info */}
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-mist text-text-secondary border border-border-amber text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Edit maintenance announcement and contact numbers"
          >
            <Sliders className="w-3.5 h-3.5 text-primary-600" />
            <span>Settings</span>
          </button>

          {/* Primary Toggle Switch Button */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 ${
              isInService
                ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            <span>
              {isInService ? "Switch to Maintenance" : "Make Site Live (In Service)"}
            </span>
          </button>
        </div>
      </div>

      {/* Settings / Maintenance Config Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border-amber max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-primary-950 text-cream px-6 py-4 flex items-center justify-between border-b border-primary-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-gold/20 flex items-center justify-center text-accent-gold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Maintenance Mode Settings
                  </h3>
                  <p className="text-[11px] text-cream/70">
                    Customize the message shown to customers when the site is not in service
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveSettings} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="e.g. RRR Crackers"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-amber bg-cream text-sm text-text-primary focus:outline-none focus:border-primary-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5">
                  English Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Currently Under Maintenance"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-amber bg-cream text-sm text-text-primary focus:outline-none focus:border-primary-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5">
                  Tamil Subtitle (தமிழ் வாசகம்)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. எங்கள் தளம் தற்காலிகமாக பராமரிப்பில் உள்ளது"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-amber bg-cream text-sm text-text-primary focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5">
                  Detailed Maintenance Notice / Explanation
                </label>
                <textarea
                  rows={3}
                  value={formData.maintenanceMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, maintenanceMessage: e.target.value })
                  }
                  placeholder="Explain why the site is updating (e.g. updating 2026 catalogue rates)..."
                  className="w-full px-3.5 py-2 rounded-xl border border-border-amber bg-cream text-sm text-text-primary focus:outline-none focus:border-primary-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5">
                  Estimated Timeline / Status Notice
                </label>
                <input
                  type="text"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  placeholder="e.g. Diwali 2026 Season Specials Coming Soon"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-amber bg-cream text-sm text-text-primary focus:outline-none focus:border-primary-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary-600" />
                    <span>Contact Phone</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98659 02681"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-amber bg-cream text-sm text-text-primary focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-semantic-success" />
                    <span>WhatsApp Number</span>
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="919865902681"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-amber bg-cream text-sm text-text-primary focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-border-light">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-mist hover:bg-neutral-200 text-text-secondary text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-5xl h-[92vh] bg-[#140202] rounded-3xl border border-accent-gold/40 shadow-2xl flex flex-col overflow-hidden relative">
            {/* Preview Top Bar */}
            <div className="bg-primary-950 px-4 py-2.5 flex items-center justify-between border-b border-primary-900 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-bold text-accent-gold uppercase tracking-wider">
                  Visitor View Preview &bull; Maintenance Screen
                </span>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close Preview</span>
              </button>
            </div>

            {/* Render Maintenance Component Inside Preview Container */}
            <div className="flex-1 overflow-y-auto">
              <MaintenancePage customSettings={formData || settings} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
