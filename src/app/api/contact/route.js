// src/app/api/contact/route.js

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email options
    const mailOptionsToOwner = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: `New Contact Form NEXUS Blog_Platform ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #4079ff; padding-bottom: 10px;">New Contact Form Message</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong style="color: #666;">Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong style="color: #666;">Email:</strong> ${email}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #4079ff; border-radius: 5px;">
              <p style="margin: 0; color: #666;"><strong>Message:</strong></p>
              <p style="margin-top: 10px; color: #333; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
              <p>This email was sent from your NEXUS contact form</p>
            </div>
          </div>
        </div>
      `,
    };

    // Auto-reply to the sender
    const mailOptionsToSender = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Thank you for contacting me!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4079ff 0%, #40ffaa 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 28px;">Thank You for Reaching Out! ✨</h2>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Hi <strong>${name}</strong>,</p>
            
            <p style="font-size: 15px; color: #555; line-height: 1.6;">
              Thank you so much for taking the time to reach out to us! We've received your message and we're genuinely excited to hear from you. 
            </p>
            
            <p style="font-size: 15px; color: #555; line-height: 1.6;">
              Our team will carefully review your message and get back to you within <strong>24-48 hours</strong>. We value every inquiry and can't wait to connect with you!
            </p>
            
            <div style="background-color: white; padding: 20px; border-left: 4px solid #4079ff; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #4079ff; font-size: 14px;">YOUR MESSAGE:</p>
              <p style="color: #333; line-height: 1.6; margin: 0; font-size: 15px;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 15px; color: #555; margin: 5px 0;">Best regards,</p>
              <p style="font-size: 16px; color: #333; margin: 5px 0; font-weight: bold;">Team NEXUS</p>
              <p style="font-size: 13px; color: #999; margin-top: 15px;">
                📧 support@nexus.com | 📱 +91 7838758145 | 📍 Delhi, India
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 8px;">
            <p style="font-size: 12px; color: #777; margin: 0;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptionsToOwner);
    await transporter.sendMail(mailOptionsToSender);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
