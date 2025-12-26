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

    const [drafts] = await db.query(
      `
      SELECT id, title, description, thumbnail, createdAt
      FROM blogs
      WHERE authorId = ? AND published = 0
      ORDER BY createdAt DESC
      `,
      [decoded.id]
    );

    return NextResponse.json(drafts);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
}
