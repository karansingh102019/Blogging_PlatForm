// app/api/admin/users/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Get all users with blog count
    const [users] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.createdAt,
        u.is_admin,
        COUNT(b.id) as blogCount
      FROM users u
      LEFT JOIN blogs b ON u.id = b.authorId
      GROUP BY u.id, u.name, u.email, u.createdAt, u.is_admin
      ORDER BY u.createdAt DESC
    `);

    console.log(`Fetched ${users.length} users`);

    return NextResponse.json({ 
      success: true,
      users 
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}