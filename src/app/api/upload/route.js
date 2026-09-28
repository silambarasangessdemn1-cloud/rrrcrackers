import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

// Configure Cloudinary with the provided credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "rb9c6mve",
  api_key: process.env.CLOUDINARY_API_KEY || "834273282924553",
  api_secret: process.env.CLOUDINARY_API_SECRET || "hA5v58LZ6cNUmRbi5ujDasy1CZ8",
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|svg|gif|avif)$/i)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image (JPG, PNG, WEBP, SVG, GIF, AVIF)." },
        { status: 400 }
      );
    }

    // Maximum 10MB file size limit
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Convert file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload using Cloudinary upload_stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rrrcrackers",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      // Write buffer to stream
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      filename: result.public_id,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image: " + error.message },
      { status: 500 }
    );
  }
}
