import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q"); // Search query
    const category = searchParams.get("category"); // ✅ Category filter

    const db = await getDB();
    let blogs;

    // Build query conditions
    let conditions = ["b.published = 1"];
    let params = [];

    // Add search condition
    if (q) {
      conditions.push("b.title LIKE ?");
      params.push(`%${q}%`);
    }

    // ✅ Add category filter
    if (category && category !== "All") {
      conditions.push("b.category = ?");
      params.push(category);
    }

    const whereClause = conditions.join(" AND ");

    // ✅ Fetch blogs with category
    [blogs] = await db.query(
      `
      SELECT 
        b.id,
        b.title,
        b.description,
        b.thumbnail,
        b.category,
        b.createdAt,
        u.name AS author,
        p.avatar AS avatar,
        (SELECT COUNT(*) FROM blog_views WHERE blogId = b.id) AS views,
        (SELECT COUNT(*) FROM blog_like WHERE blogId = b.id) AS likes
      FROM blogs b
      JOIN users u ON b.authorId = u.id
      LEFT JOIN user_profiles p ON u.id = p.userId
      WHERE ${whereClause}
      ORDER BY b.createdAt DESC
      `,
      params
    );

    return NextResponse.json(blogs);
  } catch (err) {
    console.error("BLOG API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}