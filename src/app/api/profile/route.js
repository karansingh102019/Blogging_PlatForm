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

    const [rows] = await db.query(
      `SELECT 
        u.id, u.name, u.email,
        p.bio, p.avatar, p.cover,
        p.instagram, p.twitter, p.linkedin, p.website
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.userId
       WHERE u.id = ?`,
      [decoded.id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔥 IMPORTANT: u.id bhi return karo
    return NextResponse.json(rows[0]);

  } catch (err) {
    console.error("PROFILE GET ERROR:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}