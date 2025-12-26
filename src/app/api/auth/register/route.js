import { getDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    const db = await getDB();

    // Check if user exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed]
    );

    return Response.json({ message: "User registered successfully" });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
