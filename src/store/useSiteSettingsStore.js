import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import defaultSettings from "@/config/siteSettings.json";

export const useSiteSettingsStore = create()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isInService: defaultSettings.isInService ?? true,
      isLoading: false,
      isSaving: false,
      lastSynced: null,

      fetchSettings: async () => {
        try {
          set({ isLoading: true });
          const res = await fetch("/api/settings", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.settings) {
              set({
                settings: data.settings,
                isInService: Boolean(data.settings.isInService),
                lastSynced: new Date().toISOString(),
                isLoading: false,
              });
              return data.settings;
            }
          }
        } catch (error) {
          console.warn("Failed to fetch site settings from API:", error);
        } finally {
          set({ isLoading: false });
        }
        return get().settings;
      },

      toggleServiceStatus: async (overrideValue) => {
        const currentVal = get().isInService;
        const newVal = typeof overrideValue === "boolean" ? overrideValue : !currentVal;
        const currentSettings = get().settings;
        const updatedSettings = {
          ...currentSettings,
          isInService: newVal,
        };

        // Optimistic UI update
        set({
          isInService: newVal,
          settings: updatedSettings,
          isSaving: true,
        });

        try {
          const res = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSettings),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.settings) {
              set({
                settings: data.settings,
                isInService: Boolean(data.settings.isInService),
                lastSynced: new Date().toISOString(),
              });
              return { success: true, isInService: data.settings.isInService };
            }
          }
        } catch (err) {
          console.error("Failed to persist toggle to API:", err);
        } finally {
          set({ isSaving: false });
        }

        return { success: true, isInService: newVal };
      },

      updateSiteSettings: async (newSettingsObj) => {
        const currentSettings = get().settings;
        const merged = {
          ...currentSettings,
          ...newSettingsObj,
        };

        set({
          settings: merged,
          isInService: Boolean(merged.isInService),
          isSaving: true,
        });

        try {
          const res = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(merged),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.settings) {
              set({
                settings: data.settings,
                isInService: Boolean(data.settings.isInService),
                lastSynced: new Date().toISOString(),
              });
              return { success: true, settings: data.settings };
            }
          }
        } catch (err) {
          console.error("Failed to persist settings update to API:", err);
          return { success: false, error: err.message };
        } finally {
          set({ isSaving: false });
        }

        return { success: true, settings: merged };
      },
    }),
    {
      name: "rrr_site_settings_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        isInService: state.isInService,
      }),
    }
  )
);
