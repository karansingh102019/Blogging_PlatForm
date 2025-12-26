import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/auth/signup?error=no_code", req.url));
    }

    // Exchange code for token (simplified - in production, use proper Google OAuth flow)
    // For now, redirect back with error message
    return NextResponse.redirect(new URL("/auth/signup?error=oauth_not_configured", req.url));
  } catch (err) {
    console.error("GOOGLE CALLBACK ERROR:", err);
    return NextResponse.redirect(new URL("/auth/signup?error=server_error", req.url));
  }
}


