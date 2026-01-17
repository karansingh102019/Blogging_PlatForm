// app/api/upload/route.js

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // File validation
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("📤 Uploading to Cloudinary...");

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "blogify",
          resource_type: "auto",
          transformation: [
            { width: 1200, height: 630, crop: "limit" }, // Auto resize
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error(" Cloudinary Error:", error);
            reject(error);
          } else {
            console.log("✅ Upload successful:", result.secure_url);
            resolve(result);
          }
        }
      );
      
      uploadStream.end(buffer);
    });

    return NextResponse.json({ 
      url: result.secure_url,
      publicId: result.public_id 
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: err.message 
    }, { status: 500 });
  }
}