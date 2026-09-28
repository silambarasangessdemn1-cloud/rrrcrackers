import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { images as stockImages } from "@/config/image";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "rb9c6mve",
  api_key: process.env.CLOUDINARY_API_KEY || "834273282924553",
  api_secret: process.env.CLOUDINARY_API_SECRET || "hA5v58LZ6cNUmRbi5ujDasy1CZ8",
});

export async function GET() {
  try {
    let uploadedFiles = [];

    try {
      // Fetch resources from Cloudinary folder
      const result = await cloudinary.search
        .expression('folder:rrrcrackers')
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute();

      uploadedFiles = result.resources.map((file) => ({
        id: file.asset_id,
        filename: file.public_id,
        name: file.filename || file.public_id.split('/').pop(),
        url: file.secure_url,
        type: "uploaded",
        size: file.bytes,
        createdAt: file.created_at,
      }));
    } catch (err) {
      console.error("Cloudinary fetch error:", err);
      uploadedFiles = [];
    }

    // Default stock cracker category images
    const stockList = Object.entries(stockImages)
      .filter(([key, val]) => typeof val === "string" && val.startsWith("/images/"))
      .map(([key, url]) => ({
        id: `stock_${key}`,
        key,
        name: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        url: url,
        type: "stock",
      }));

    return NextResponse.json({
      uploaded: uploadedFiles,
      stock: stockList,
    });
  } catch (error) {
    console.error("Fetch images error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images list" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary using public_id
    await cloudinary.uploader.destroy(filename);

    return NextResponse.json({
      success: true,
      message: `Image deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Failed to delete image: " + error.message },
      { status: 500 }
    );
  }
}
