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

    // 🔥 PARALLEL DATABASE QUERIES for better performance
    const queries = [];

    // Get total likes count
    queries.push(
      db.query("SELECT COUNT(*) as total FROM blog_like WHERE blogId = ?", [id])
        .then(([result]) => ({ type: 'likesCount', data: result }))
        .catch(() => ({ type: 'likesCount', data: [{ total: 0 }] }))
    );

    // Check if current user liked/saved this blog
    if (userId) {
      const userIdentifier = `user_${userId}`;
      
      // User like check
      queries.push(
        db.query("SELECT id FROM blog_like WHERE blogId = ? AND userId = ?", [id, userIdentifier])
          .then(([result]) => ({ type: 'userLike', data: result }))
          .catch(() => ({ type: 'userLike', data: [] }))
      );

      // User save check
      queries.push(
        db.query("SELECT id FROM blog_save WHERE blogId = ? AND userId = ?", [id, userId])
          .then(([result]) => ({ type: 'userSave', data: result }))
          .catch(() => ({ type: 'userSave', data: [] }))
      );
    } else {
      // Guest user - check using guestId from header
      const guestIdFromHeader = req.headers.get("X-Guest-Id");
      
      if (guestIdFromHeader) {
        const guestIdentifier = `guest_${guestIdFromHeader}`;
        
        queries.push(
          db.query("SELECT id FROM blog_like WHERE blogId = ? AND userId = ?", [id, guestIdentifier])
            .then(([result]) => ({ type: 'guestLike', data: result }))
            .catch(() => ({ type: 'guestLike', data: [] }))
        );
      }
    }

    // Execute all queries in parallel
    const results = await Promise.all(queries);

    // Process results
    results.forEach((result) => {
      switch (result.type) {
        case 'likesCount':
          blog.likes = result.data[0]?.total || 0;
          break;
        case 'userLike':
          blog.isLiked = result.data.length > 0;
          break;
        case 'userSave':
          blog.isSaved = result.data.length > 0;
          break;
        case 'guestLike':
          blog.isLiked = result.data.length > 0;
          break;
      }
    });

    // Set defaults if not set
    if (blog.isLiked === undefined) blog.isLiked = false;
    if (blog.isSaved === undefined) blog.isSaved = false;

    return NextResponse.json(blog);
  } catch (err) {
    console.error("Blog fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}