// api/blog/edit/route.js

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
    const { id, title, description, content, thumbnail, category, published } = await req.json();

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const db = await getDB();

    // Check ownership
    const [blog] = await db.query(
      "SELECT authorId FROM blogs WHERE id = ?",
      [id]
    );

    if (!blog[0] || blog[0].authorId !== decoded.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update blog
    await db.query(
      `
      UPDATE blogs 
      SET title = ?, description = ?, content = ?, thumbnail = ?, category = ?, published = ?
      WHERE id = ?
      `,
      [title, description, content, thumbnail, category, published ? 1 : 0, id]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}