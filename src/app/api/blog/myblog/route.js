// api/blog/myblog/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDB();

    // ✅ IMPORTANT: Make sure to SELECT category field
    const [blogs] = await db.query(
      `
      SELECT 
        b.id,
        b.title,
        b.description,
        b.content,
        b.thumbnail,
        b.category,
        b.createdAt,
        (SELECT COUNT(*) FROM blog_views WHERE blogId = b.id) AS views,
        (SELECT COUNT(*) FROM blog_like WHERE blogId = b.id) AS likes
      FROM blogs b
      WHERE b.authorId = ? AND b.published = 1
      ORDER BY b.createdAt DESC
      `,
      [decoded.id]
    );

    console.log("✅ Fetched blogs:", blogs); // Debug log

    return NextResponse.json({ blogs });
  } catch (err) {
    console.error("MY BLOGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}