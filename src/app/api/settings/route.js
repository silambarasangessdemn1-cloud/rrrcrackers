import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import defaultSettings from "@/config/siteSettings.json";

export const dynamic = "force-dynamic";

const SETTINGS_FILENAME = "site-settings.json";
const LOCAL_SETTINGS_PATH = path.join(process.cwd(), "src", "config", "siteSettings.json");

async function getSettingsData() {
  // If Blob token exists, try Vercel Blob first (for production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: SETTINGS_FILENAME });
      if (blobs.length > 0) {
        // Vercel Blob caches the URL at the edge. We must cache-bust it.
        const blobUrl = new URL(blobs[0].url);
        blobUrl.searchParams.set("t", Date.now().toString());
        
        const response = await fetch(blobUrl.toString(), { cache: "no-store" });
        if (response.ok) {
          return await response.json();
        }
      }
    } catch (err) {
      console.warn("Could not read from Vercel Blob:", err);
    }
  } else {
    // Fallback to local filesystem (for local development)
    try {
      const data = await readFile(LOCAL_SETTINGS_PATH, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.warn("Could not read local settings:", err);
    }
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

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Store in Vercel Blob if configured
      await put(SETTINGS_FILENAME, JSON.stringify(updated, null, 2), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });
    } else {
      // Store in local file system for local development
      await writeFile(LOCAL_SETTINGS_PATH, JSON.stringify(updated, null, 2), "utf8");
    }

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
