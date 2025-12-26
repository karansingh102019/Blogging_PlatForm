import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {
      name,
      bio,
      avatar,
      cover,
      instagram,
      twitter,
      linkedin,
      website,
    } = await req.json();

    const db = await getDB();

    // update name in users table
    await db.query(`UPDATE users SET name=? WHERE id=?`, [
      name,
      decoded.id,
    ]);

    // upsert profile
    await db.query(
      `INSERT INTO user_profiles
      (userId, bio, avatar, cover, instagram, twitter, linkedin, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        bio=VALUES(bio),
        avatar=VALUES(avatar),
        cover=VALUES(cover),
        instagram=VALUES(instagram),
        twitter=VALUES(twitter),
        linkedin=VALUES(linkedin),
        website=VALUES(website)
      `,
      [
        decoded.id,
        bio,
        avatar,
        cover,
        instagram,
        twitter,
        linkedin,
        website,
      ]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
