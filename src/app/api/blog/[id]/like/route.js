// app/api/blog/[id]/like/route.js

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req, { params }) {
  try {
    const { id } = await params; // blog ID
    const db = await getDB();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const body = await req.json();
    const guestId = body.guestId; // Guest user's unique ID from browser

    console.log("Like API called for blog:", id);
    console.log("Guest ID:", guestId);

    let userId = null;
    let isGuest = true;
    let identifier = null; // What we'll use to track the like

    // Try to get userId from token (for logged in users)
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId || decoded.id;
        isGuest = false;
        identifier = `user_${userId}`; // Prefix with "user_"
        console.log("Authenticated user:", userId);
      } catch (err) {
        console.log("No valid token, processing as guest");
      }
    }

    // If not logged in, use guest ID
    if (isGuest && guestId) {
      identifier = `guest_${guestId}`; // Prefix with "guest_"
      console.log("Using guest identifier:", identifier);
    }

    if (!identifier) {
      return NextResponse.json(
        { error: "Invalid request - no identifier" },
        { status: 400 }
      );
    }

    // Check if blog exists
    const [blogs] = await db.query("SELECT id FROM blogs WHERE id = ?", [id]);
    
    if (blogs.length === 0) {
      console.log("Blog not found:", id);
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    let liked = false;

    // Check if this identifier already liked the blog
    const [existingLike] = await db.query(
      "SELECT id FROM blog_like WHERE blogId = ? AND userId = ?",
      [id, identifier]
    );

    if (existingLike.length > 0) {
      // Unlike - remove the like
      await db.query(
        "DELETE FROM blog_like WHERE blogId = ? AND userId = ?",
        [id, identifier]
      );
      liked = false;
      console.log("Like removed for:", identifier);
    } else {
      // Like - add the like
      await db.query(
        "INSERT INTO blog_like (blogId, userId) VALUES (?, ?)",
        [id, identifier]
      );
      liked = true;
      console.log("Like added for:", identifier);
    }

    // Get total likes count for this blog
    const [likesCount] = await db.query(
      "SELECT COUNT(*) as total FROM blog_like WHERE blogId = ?",
      [id]
    );

    const totalLikes = likesCount[0].total;

    console.log("Final like status:", { liked, totalLikes, isGuest, identifier });

    return NextResponse.json({
      success: true,
      liked,
      totalLikes,
      isGuest,
    });
  } catch (error) {
    console.error("Like API error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to process like", details: error.message },
      { status: 500 }
    );
  }
}