// app/api/admin/check/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    console.log("Admin check - Token present:", !!token);

    // ✅ CRITICAL: No token = immediate rejection
    if (!token) {
      console.log("Admin check failed: No token");
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // ✅ Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("Token verified for user:", decoded.userId || decoded.id);
    } catch (err) {
      console.log("Admin check failed: Invalid token");
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;

    // ✅ Check if user exists and is admin
    const db = await getDB();
    const [users] = await db.query(
      "SELECT id, name, email, is_admin FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      console.log("Admin check failed: User not found");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!users[0].is_admin) {
      console.log("Admin check failed: User is not admin");
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
       
      );
    }

    console.log("Admin check passed for:", users[0].email);

    return NextResponse.json({
      success: true,
      isAdmin: true,
      user: {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
      }
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}