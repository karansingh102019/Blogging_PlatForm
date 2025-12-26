import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function GET(req, context) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ VERY IMPORTANT (Next.js 15)
    const { id } = await context.params;

    const db = await getDB();

    const [rows] = await db.query(
      `
      SELECT id, title, description, content, thumbnail, published
      FROM blogs
      WHERE id = ? AND authorId = ?
      `,
      [Number(id), decoded.id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    console.error("LOAD BLOG ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
