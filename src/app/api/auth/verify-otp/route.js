// app/api/auth/verify-otp/route.js

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { tempUserId, otp } = await req.json();

    if (!tempUserId || !otp) {
      return NextResponse.json(
        { error: "User ID and OTP are required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Get temporary user data
    const [tempUsers] = await db.query(
      "SELECT * FROM temp_users WHERE id = ?",
      [tempUserId]
    );

    if (tempUsers.length === 0) {
      return NextResponse.json(
        { error: "Invalid verification request" },
        { status: 400 }
      );
    }

    const tempUser = tempUsers[0];

    // Check if OTP expired
    if (new Date() > new Date(tempUser.otp_expiry)) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (tempUser.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // OTP is valid - Create actual user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [tempUser.name, tempUser.email, tempUser.password]
    );

    const userId = result.insertId;

    // Delete temporary user data
    await db.query("DELETE FROM temp_users WHERE id = ?", [tempUserId]);

    console.log("User verified and created:", userId);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now login.",
      userId: userId,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}