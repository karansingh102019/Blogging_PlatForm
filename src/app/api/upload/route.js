// app/api/upload/route.js

import { NextResponse } from "next/server";

export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req) {
  try {
    console.log("🔍 Starting upload process...");
    
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

    console.log("📤 Converting file to base64...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${fileType};base64,${base64}`;

    // Generate unique filename without special characters
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const cleanFileName = `nexus_${timestamp}_${randomString}`;

    console.log("📤 Uploading to Cloudinary (Unsigned)...");
    console.log("Generated filename:", cleanFileName);
    console.log("File size:", file.size, "bytes");

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = 'nexusblogs';

    // Unsigned upload via REST API
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: dataURI,
          upload_preset: uploadPreset,
        }),
      }
    );

    console.log("📊 Cloudinary response status:", uploadResponse.status);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ Cloudinary Error Response:', errorText);
      return NextResponse.json({ 
        error: "Cloudinary upload failed",
        details: errorText 
      }, { status: 500 });
    }

    const result = await uploadResponse.json();
    console.log("✅ Upload successful:", result.secure_url);

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