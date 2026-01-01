// app/api/auth/resend-otp/route.js

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { tempUserId } = await req.json();

    if (!tempUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
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
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const tempUser = tempUsers[0];

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("New OTP:", newOtp); // For testing

    // Update OTP and expiry
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await db.query(
      "UPDATE temp_users SET otp = ?, otp_expiry = ? WHERE id = ?",
      [newOtp, otpExpiry, tempUserId]
    );

    // Send new OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Your Blog Platform" <${process.env.EMAIL_USER}>`,
      to: tempUser.email,
      subject: "New OTP Code - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New OTP Code</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${tempUser.name}! 👋</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              You requested a new OTP code. Here is your verification code:
            </p>
            
            <div style="background: #f3f4f6; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your New OTP Code</p>
              <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">${newOtp}</h1>
            </div>
            
            <p style="color: #ef4444; font-size: 14px; text-align: center; margin: 20px 0;">
              ⏰ This code will expire in 10 minutes
            </p>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              If you didn't request this code, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © 2024 Your Blog Platform. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("New OTP sent to:", tempUser.email);

    return NextResponse.json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Failed to resend OTP. Please try again." },
      { status: 500 }
    );
  }
}