import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params; // 🔥 Await params
    const db = await getDB();

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
        u.name AS author,
        p.avatar AS avatar,
        p.bio AS authorBio
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

    return NextResponse.json(blogs[0]);
  } catch (err) {
    console.error("Blog fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}