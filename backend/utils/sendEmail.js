const nodemailer = require("nodemailer");

// 1. Transporter ko function se bahar rakhein taaki connection reuse ho (Pooling)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true, // Reuse existing connections
  maxConnections: 3,
  connectionTimeout: 20000, // 20 sec is enough for initial handshake
  tls: {
    rejectUnauthorized: false, // For Render stability
  },
});

async function sendEmail({ email, subject, message }) {
  try {
    // Send email directly
    const info = await transporter.sendMail({
      from: `"BookHive" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">📚 BookHive</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">${message}</p>
            </div>
          </div>
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} BookHive. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return info;
  } catch (error) {
    console.error("Nodemailer Error Details:", error); // Detailed log for debugging
    throw new Error(`Email failed: ${error.message}`);
  }
}

module.exports = sendEmail;