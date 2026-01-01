// app/api/admin/stats/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    const db = await getDB();

    // Verify admin
    const [admin] = await db.query(
      "SELECT is_admin FROM users WHERE id = ?",
      [userId]
    );

    if (!admin.length || !admin[0].is_admin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log("Fetching admin stats...");

    // Get total blogs
    const [totalBlogsResult] = await db.query("SELECT COUNT(*) as count FROM blogs");
    const totalBlogs = totalBlogsResult[0].count;
    console.log("Total blogs:", totalBlogs);

    // Get published blogs
    const [publishedBlogsResult] = await db.query(
      "SELECT COUNT(*) as count FROM blogs WHERE published = 1"
    );
    const publishedBlogs = publishedBlogsResult[0].count;
    console.log("Published blogs:", publishedBlogs);

    // Get draft blogs
    const [draftBlogsResult] = await db.query(
      "SELECT COUNT(*) as count FROM blogs WHERE published = 0"
    );
    const draftBlogs = draftBlogsResult[0].count;
    console.log("Draft blogs:", draftBlogs);

    // Get total users
    const [totalUsersResult] = await db.query("SELECT COUNT(*) as count FROM users");
    const totalUsers = totalUsersResult[0].count;
    console.log("Total users:", totalUsers);

    const stats = {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalUsers,
    };

    console.log("Final stats:", stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 }
    );
  }
}
