import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import defaultSettings from "@/config/siteSettings.json";

export const dynamic = "force-dynamic";

// Configure Cloudinary with the same credentials used for image uploads
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "rb9c6mve";
cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.CLOUDINARY_API_KEY || "834273282924553",
  api_secret: process.env.CLOUDINARY_API_SECRET || "hA5v58LZ6cNUmRbi5ujDasy1CZ8",
});

const SETTINGS_FILENAME = "site-settings.json";
const LOCAL_SETTINGS_PATH = path.join(process.cwd(), "src", "config", "siteSettings.json");

async function getSettingsData() {
  // If we're on Vercel (read-only file system), read from Cloudinary
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      // Fetch the raw JSON file from Cloudinary (with cache-busting timestamp)
      const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/rrrcrackers/${SETTINGS_FILENAME}?t=${Date.now()}`;
      const response = await fetch(cloudinaryUrl, { cache: "no-store" });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn("Could not read from Cloudinary:", err);
    }
  } else {
    // Fallback to local filesystem for local development
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

    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      // Store in Cloudinary as a raw JSON file
      const buffer = Buffer.from(JSON.stringify(updated, null, 2));
      
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "rrrcrackers",
            public_id: SETTINGS_FILENAME, // Use exact filename so it overwrites
            overwrite: true,
            invalidate: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
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
