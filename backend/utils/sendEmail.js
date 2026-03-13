const nodemailer = require("nodemailer");

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message
 */
async function sendEmail({ email, subject, message }) {
  try {
    // Create transporter (production-friendly)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP
      port: 465,              // Use 465 for SSL (more reliable on Render)
      secure: true,           // true for port 465
      auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS, // App Password
      },
      connectionTimeout: 60000, // 60 sec
      greetingTimeout: 30000,
      socketTimeout: 60000,
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      pool: true, // Use pooled connections
      maxConnections: 5,
      maxMessages: 10,
    });

    // Skip verify in production to avoid timeout issues
    if (process.env.NODE_ENV !== 'production') {
      await transporter.verify();
    }

    // Send email
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
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                ${message}
              </p>
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

    console.log("Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

module.exports = sendEmail;