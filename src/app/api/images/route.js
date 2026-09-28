import { NextResponse } from "next/server";
import path from "path";
import { readdir, stat, unlink } from "fs/promises";
import { images as stockImages } from "@/config/image";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    let uploadedFiles = [];

    try {
      const files = await readdir(uploadDir);
      const fileStats = await Promise.all(
        files
          .filter((file) => file.match(/\.(jpg|jpeg|png|webp|svg|gif|avif)$/i))
          .map(async (file) => {
            const filePath = path.join(uploadDir, file);
            const stats = await stat(filePath);
            return {
              id: `upload_${file}`,
              filename: file,
              name: file.replace(/_\d+\.[^.]+$/, "").replace(/_/g, " "),
              url: `/uploads/${file}`,
              type: "uploaded",
              size: stats.size,
              createdAt: stats.mtime.toISOString(),
            };
          })
      );

      // Sort uploaded files by most recent first
      uploadedFiles = fileStats.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch {
      // directory might be empty or not yet read
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

    // Security check: prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", safeFilename);

    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: `Image ${safeFilename} deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Failed to delete image: " + error.message },
      { status: 500 }
    );
  }
}
