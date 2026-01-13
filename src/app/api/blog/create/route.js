// api/blog/create/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, description, content, thumbnail, category, published } = await req.json();

    // Validation
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const db = await getDB();

    await db.query(
      `
      INSERT INTO blogs (title, description, content, thumbnail, category, authorId, published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        content,
        thumbnail,
        category, 
        decoded.id,
        published ? 1 : 0
      ]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}