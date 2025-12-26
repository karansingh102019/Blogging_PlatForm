import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { currentPassword, newPassword } = await req.json();

    const db = await getDB();
    const [rows] = await db.query(
      "SELECT password FROM users WHERE id = ?",
      [decoded.id]
    );

    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) {
      return NextResponse.json(
        { error: "Current password incorrect" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password=? WHERE id=?",
      [hashed, decoded.id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PASSWORD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
