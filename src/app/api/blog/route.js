import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q"); // 👈 search query

    const db = await getDB();

    let blogs;

    if (q) {
      // 🔍 SEARCH MODE
      [blogs] = await db.query(
        `
        SELECT 
          b.id,
          b.title,
          b.description,
          b.thumbnail,
          b.createdAt,
          u.name AS author,
          p.avatar AS avatar
        FROM blogs b
        JOIN users u ON b.authorId = u.id
        LEFT JOIN user_profiles p ON u.id = p.userId
        WHERE b.published = 1
          AND b.title LIKE ?
        ORDER BY b.createdAt DESC
        `,
        [`%${q}%`]
      );
    } else {
      // 📋 ALL BLOGS MODE
      [blogs] = await db.query(
        `
        SELECT 
          b.id,
          b.title,
          b.description,
          b.thumbnail,
          b.createdAt,
          u.name AS author,
          p.avatar AS avatar
        FROM blogs b
        JOIN users u ON b.authorId = u.id
        LEFT JOIN user_profiles p ON u.id = p.userId
        WHERE b.published = 1
        ORDER BY b.createdAt DESC
        `
      );
    }

    return NextResponse.json(blogs);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}