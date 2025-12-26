import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, title, description, content, thumbnail, published } = await req.json();

    const db = await getDB();

    await db.query(
      `
      UPDATE blogs
      SET title=?, description=?, content=?, thumbnail=?, published=?
      WHERE id=? AND authorId=?
      `,
      [
        title,
        description,
        content,
        thumbnail,
        published ? 1 : 0,
        id,
        decoded.id
      ]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("EDIT BLOG ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
