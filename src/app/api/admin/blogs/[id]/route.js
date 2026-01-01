// app/api/admin/blogs/[id]/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
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

    // Delete related data first
    await db.query("DELETE FROM blog_like WHERE blogId = ?", [id]);
    await db.query("DELETE FROM blog_save WHERE blogId = ?", [id]);
    
    // Delete the blog
    await db.query("DELETE FROM blogs WHERE id = ?", [id]);

    console.log("Blog deleted by admin:", id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}