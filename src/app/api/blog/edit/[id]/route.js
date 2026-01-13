// api/blog/edit/[id]/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDB();

    const [blogs] = await db.query(
      `SELECT 
        id, 
        title, 
        description, 
        content, 
        thumbnail, 
        category,
        published 
      FROM blogs 
      WHERE id = ? AND authorId = ?`,
      [params.id, decoded.id]
    );

    if (!blogs[0]) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blogs[0]);
  } catch (err) {
    console.error("GET BLOG ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}