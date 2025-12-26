import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function POST(req) {
  const { email, password } = await req.json();
  const db = await getDB();

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  const user = rows[0];
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({
    message: "Login success",
    user: { id: user.id, name: user.name, email: user.email },
  });

  // ✅ COOKIE SET
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  

  return res;
}
