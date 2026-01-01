// app/api/auth/send-otp/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validation
    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: "Name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Check if user already exists
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp); // For testing

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store temporary user data with OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    const [result] = await db.query(
      `INSERT INTO temp_users (name, email, password, otp, otp_expiry) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, otp, otpExpiry]
    );

    const tempUserId = result.insertId;

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: `"Your Blog Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Platform!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${name}! 👋</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for signing up! To complete your registration, please verify your email address using the OTP code below:
            </p>
            
            <div style="background: #f3f4f6; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your OTP Code</p>
              <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h1>
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

    console.log("OTP sent to:", email);

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      tempUserId: tempUserId,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}