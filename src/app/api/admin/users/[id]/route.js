// app/api/admin/users/[id]/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUserId = decoded.userId || decoded.id;

    const db = await getDB();

    // Verify admin
    const [admin] = await db.query(
      "SELECT is_admin FROM users WHERE id = ?",
      [adminUserId]
    );

    if (!admin.length || !admin[0].is_admin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Don't allow deleting yourself
    if (parseInt(id) === parseInt(adminUserId)) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Get user's blogs
    const [userBlogs] = await db.query(
      "SELECT id FROM blogs WHERE authorId = ?",
      [id]
    );

    // Delete all related data for each blog
    for (const blog of userBlogs) {
      await db.query("DELETE FROM blog_like WHERE blogId = ?", [blog.id]);
      await db.query("DELETE FROM blog_save WHERE blogId = ?", [blog.id]);
    }

    // Delete user's blogs
    await db.query("DELETE FROM blogs WHERE authorId = ?", [id]);

    // Delete user's profile
    await db.query("DELETE FROM user_profiles WHERE userId = ?", [id]);

    // Delete user's likes and saves
    await db.query("DELETE FROM blog_like WHERE userId = ?", [id]);
    await db.query("DELETE FROM blog_save WHERE userId = ?", [id]);

    // Delete the user
    await db.query("DELETE FROM users WHERE id = ?", [id]);

    console.log("User and all related data deleted by admin:", id);

    return NextResponse.json({
      success: true,
      message: "User and all their data deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}