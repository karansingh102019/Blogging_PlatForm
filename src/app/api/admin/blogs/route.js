// app/api/admin/blogs/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
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

    // Get all blogs with author info, views, and likes
    const [blogs] = await db.query(`
      SELECT 
        b.id,
        b.title,
        b.description,
        b.thumbnail,
        b.published,
        b.createdAt,
        b.views,
        u.name as author,
        u.id as authorId,
        (SELECT COUNT(*) FROM blog_like WHERE blogId = b.id) as likes
      FROM blogs b
      JOIN users u ON b.authorId = u.id
      ORDER BY b.createdAt DESC
    `);

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Fetch blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}