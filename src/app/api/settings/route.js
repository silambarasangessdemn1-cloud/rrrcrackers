import { NextResponse } from "next/server";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import defaultSettings from "@/config/siteSettings.json";

export const dynamic = "force-dynamic";

const SETTINGS_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "config",
  "siteSettings.json"
);

async function getSettingsData() {
  try {
    const data = await readFile(SETTINGS_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.warn("Could not read siteSettings.json, falling back to default:", err);
    return defaultSettings;
  }
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

    // NOTE: this write only persists if the deployment's filesystem is
    // writable and durable across requests/instances (true for a single
    // persistent server, NOT true for most serverless hosts, which run
    // on a read-only or ephemeral filesystem). If that's your host, this
    // toggle will keep reverting on the next read - swap this for a real
    // datastore (DB/KV) instead of papering over the failure.
    await writeFile(
      SETTINGS_FILE_PATH,
      JSON.stringify(updated, null, 2),
      "utf8"
    );

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
