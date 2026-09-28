import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import defaultSettings from "@/config/siteSettings.json";

export const dynamic = "force-dynamic";

const SETTINGS_FILENAME = "site-settings.json";

async function getSettingsData() {
  try {
    // Check if the settings file exists in Vercel Blob
    const { blobs } = await list({ prefix: SETTINGS_FILENAME });
    
    if (blobs.length > 0) {
      // Fetch the latest settings from the Blob URL
      const response = await fetch(blobs[0].url, { cache: "no-store" });
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (err) {
    console.warn("Could not read from Vercel Blob, falling back to default:", err);
  }
  return defaultSettings;
}

export async function GET() {
  try {
    const settings = await getSettingsData();
    return NextResponse.json(
      { success: true, settings },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error reading site settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch settings",
        settings: defaultSettings,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const current = await getSettingsData();

    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Store the updated JSON in Vercel Blob (overwrite the existing file without a random suffix)
    await put(SETTINGS_FILENAME, JSON.stringify(updated, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Settings updated successfully",
        settings: updated,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error saving site settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update settings: " + error.message,
      },
      { status: 500 }
    );
  }
}
