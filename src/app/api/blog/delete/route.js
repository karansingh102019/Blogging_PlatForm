import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = await req.json();

    const db = await getDB();
    await db.query(
      "DELETE FROM blogs WHERE id=? AND authorId=?",
      [id, user.id]
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
