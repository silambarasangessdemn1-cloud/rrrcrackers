import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "rb9c6mve";
cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.CLOUDINARY_API_KEY || "834273282924553",
  api_secret: process.env.CLOUDINARY_API_SECRET || "hA5v58LZ6cNUmRbi5ujDasy1CZ8",
});

const PRODUCTS_FILENAME = "products-data.json";
const LOCAL_PRODUCTS_PATH = path.join(process.cwd(), "src", "config", "productsData.json");

async function getProductsData() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/rrrcrackers/${PRODUCTS_FILENAME}?t=${Date.now()}`;
      const response = await fetch(cloudinaryUrl, { cache: "no-store" });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn("Could not read from Cloudinary:", err);
    }
  } else {
    try {
      const data = await readFile(LOCAL_PRODUCTS_PATH, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.warn("Could not read local products:", err);
    }
  }
  
  return {}; // Return empty object if no data
}

export async function GET() {
  try {
    const productsData = await getProductsData();
    return NextResponse.json(
      { success: true, productsData },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error reading products data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products data",
        productsData: {},
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const current = await getProductsData();

    // Body should contain object like: { [productId]: { customImage: "...", price: 100, full: 200 } }
    const updated = { ...current };
    for (const [key, val] of Object.entries(body)) {
      if (key !== "updatedAt" && typeof val === "object") {
        updated[key] = { ...(updated[key] || {}), ...val };
      }
    }
    updated.updatedAt = new Date().toISOString();

    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      const buffer = Buffer.from(JSON.stringify(updated, null, 2));
      
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "rrrcrackers",
            public_id: PRODUCTS_FILENAME,
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
    } else {
      await writeFile(LOCAL_PRODUCTS_PATH, JSON.stringify(updated, null, 2), "utf8");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Products updated successfully",
        productsData: updated,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error saving products data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update products: " + error.message,
      },
      { status: 500 }
    );
  }
}
