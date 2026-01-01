// app/api/user/saved-blogs/route.js

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req) {
  try {
    const db = await getDB();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    console.log("Fetching saved blogs");

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json(
        { error: "Please login to view saved blogs" },
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
      return NextResponse.json(
        { error: "Invalid user data in token" },
        { status: 401 }
      );
    }

    console.log("Fetching saved blogs for user:", userId);

    // Get all saved blogs for this user with blog details
    const [savedBlogs] = await db.query(
      `
      SELECT 
        b.id,
        b.title,
        b.description,
        b.content,
        b.thumbnail,
        b.createdAt,
        u.name AS author,
        p.avatar AS authorAvatar,
        (SELECT COUNT(*) FROM blog_like WHERE blogId = b.id) AS likes,
        s.createdAt AS savedAt
      FROM blog_save s
      JOIN blogs b ON s.blogId = b.id
      JOIN users u ON b.authorId = u.id
      LEFT JOIN user_profiles p ON u.id = p.userId
      WHERE s.userId = ? AND b.published = 1
      ORDER BY s.createdAt DESC
      `,
      [userId]
    );

    console.log(`Found ${savedBlogs.length} saved blogs`);

    return NextResponse.json({
      success: true,
      savedBlogs,
      count: savedBlogs.length,
    });
  } catch (error) {
    console.error("Saved blogs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved blogs", details: error.message },
      { status: 500 }
    );
  }
}