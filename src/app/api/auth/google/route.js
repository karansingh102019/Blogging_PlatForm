import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { token, name, email, picture } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
    }

    // Note: In production, you should verify the JWT token with Google's public keys
    // For now, we'll decode and use the token data (simplified approach)
    // In production, use: https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=TOKEN

    const db = await getDB();

    // Check if user exists
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    let user;

    if (existing.length > 0) {
      // User exists - login
      user = existing[0];
      
      // Update avatar if provided and user doesn't have one
      if (picture && !user.avatar) {
        await db.query(
          "UPDATE users SET avatar = ? WHERE id = ?",
          [picture, user.id]
        );
        user.avatar = picture;
      }
    } else {
      // Create new user
      await db.query(
        "INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)",
        [name || email.split("@")[0], email, "google_oauth", picture || null]
      );

      const [newUser] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      user = newUser[0];
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Google login success",
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    });

    // Set cookie
    res.cookies.set("token", jwtToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

