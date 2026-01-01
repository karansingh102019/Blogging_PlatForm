// app/api/blog/[id]/route.js

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = await getDB();
    
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    let userId = null;
    let identifier = null;

    // Decode token if provided (optional for viewing)
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId || decoded.id;
        identifier = `user_${userId}`;
      } catch (err) {
        console.log("Invalid token, proceeding without auth");
      }
    }

    // Get guest ID if not logged in
    if (!identifier) {
      const guestIdFromHeader = req.headers.get("X-Guest-Id");
      if (guestIdFromHeader) {
        identifier = `guest_${guestIdFromHeader}`;
      }
    }

    // 🔥 UNIQUE VIEW TRACKING - Only if identifier exists
    if (identifier) {
      try {
        // Check if already viewed
        const [existingView] = await db.query(
          "SELECT id FROM blog_views WHERE blogId = ? AND userId = ?",
          [id, identifier]
        );

        // If not viewed before, add view
        if (existingView.length === 0) {
          await db.query(
            "INSERT INTO blog_views (blogId, userId) VALUES (?, ?)",
            [id, identifier]
          );
          
          await db.query(
            "UPDATE blogs SET views = views + 1 WHERE id = ?",
            [id]
          );
          
          console.log("✅ New view added:", identifier);
        } else {
          console.log("ℹ️ Already viewed:", identifier);
        }
      } catch (err) {
        console.log("⚠️ View tracking skipped:", err.message);
      }
    }

    const [blogs] = await db.query(
      `
      SELECT 
        b.id,
        b.title,
        b.description,
        b.content,
        b.thumbnail,
        b.createdAt,
        b.authorId,
        COALESCE(b.views, 0) as views,
        u.name AS author,
        p.avatar AS avatar,
        p.bio AS authorBio,
        p.cover AS cover,
        p.instagram AS instagram,
        p.twitter AS twitter,
        p.linkedin AS linkedin,
        p.website AS website
      FROM blogs b
      JOIN users u ON b.authorId = u.id
      LEFT JOIN user_profiles p ON u.id = p.userId
      WHERE b.id = ? AND b.published = 1
      `,
      [id]
    );

    if (!blogs || blogs.length === 0) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    const blog = blogs[0];

    // Get total likes count (with error handling)
    try {
      const [likesCount] = await db.query(
        "SELECT COUNT(*) as total FROM blog_like WHERE blogId = ?",
        [id]
      );
      blog.likes = likesCount[0]?.total || 0;
    } catch (err) {
      console.log("Likes table might not exist:", err.message);
      blog.likes = 0;
    }

    // Check if current user liked this blog
    if (userId) {
      // Logged in user
      const userIdentifier = `user_${userId}`;
      
      try {
        const [userLike] = await db.query(
          "SELECT id FROM blog_like WHERE blogId = ? AND userId = ?",
          [id, userIdentifier]
        );
        blog.isLiked = userLike.length > 0;
      } catch (err) {
        console.log("User like check failed:", err.message);
        blog.isLiked = false;
      }

      // Check if user saved this blog
      try {
        const [userSave] = await db.query(
          "SELECT id FROM blog_save WHERE blogId = ? AND userId = ?",
          [id, userId]
        );
        blog.isSaved = userSave.length > 0;
      } catch (err) {
        console.log("User save check failed:", err.message);
        blog.isSaved = false;
      }
    } else {
      // Guest user - check using guestId from header
      const guestIdFromHeader = req.headers.get("X-Guest-Id");
      
      if (guestIdFromHeader) {
        const guestIdentifier = `guest_${guestIdFromHeader}`;
        
        try {
          const [guestLike] = await db.query(
            "SELECT id FROM blog_like WHERE blogId = ? AND userId = ?",
            [id, guestIdentifier]
          );
          blog.isLiked = guestLike.length > 0;
          console.log("Guest like check:", blog.isLiked, "for", guestIdentifier);
        } catch (err) {
          console.log("Guest like check failed:", err.message);
          blog.isLiked = false;
        }
      } else {
        blog.isLiked = false;
      }
      
      blog.isSaved = false;
    }

    return NextResponse.json(blog);
  } catch (err) {
    console.error("Blog fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}