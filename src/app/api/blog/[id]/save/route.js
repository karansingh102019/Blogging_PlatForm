// app/api/blog/[id]/save/route.js

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req, { params }) {
  try {
    const { id } = await params; // blog ID
    const db = await getDB();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    console.log("Save API called for blog:", id);

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json(
        { error: "Please login to save blogs" },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      console.error("No userId found in token");
      return NextResponse.json(
        { error: "Invalid user data in token" },
        { status: 401 }
      );
    }

    console.log("Authenticated user:", userId);

    // Check if blog exists
    const [blogs] = await db.query("SELECT id FROM blogs WHERE id = ?", [id]);
    
    if (blogs.length === 0) {
      console.log("Blog not found:", id);
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Check if user already saved this blog
    const [existingSave] = await db.query(
      "SELECT id FROM blog_save WHERE blogId = ? AND userId = ?",
      [id, userId]
    );

    let saved = false;

    if (existingSave.length > 0) {
      // Unsave - remove the save
      await db.query(
        "DELETE FROM blog_save WHERE blogId = ? AND userId = ?",
        [id, userId]
      );
      saved = false;
      console.log("Blog unsaved for user:", userId);
    } else {
      // Save - add the save
      await db.query(
        "INSERT INTO blog_save (blogId, userId) VALUES (?, ?)",
        [id, userId]
      );
      saved = true;
      console.log("Blog saved for user:", userId);
    }

    return NextResponse.json({
      success: true,
      saved,
      message: saved ? "Blog saved successfully!" : "Blog removed from saved list",
    });
  } catch (error) {
    console.error("Save API error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to process save", details: error.message },
      { status: 500 }
    );
  }
}