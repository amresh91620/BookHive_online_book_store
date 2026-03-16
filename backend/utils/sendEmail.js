const nodemailer = require("nodemailer");

const toBoolean = (value, fallback = false) => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  if (typeof value === "boolean") {
    return value;
  }
  return fallback;
};

const buildTransportConfig = () => {
  if (process.env.SMTP_URL) {
    return process.env.SMTP_URL;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT;
  const smtpPort = Number.parseInt(smtpPortRaw, 10);
  const smtpSecure = toBoolean(process.env.SMTP_SECURE, smtpPort === 465);
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const smtpService = process.env.SMTP_SERVICE;

  if (smtpHost) {
    const config = {
      host: smtpHost,
      port: Number.isFinite(smtpPort) ? smtpPort : 587,
      secure: smtpSecure,
    };
    if (smtpUser && smtpPass) {
      config.auth = { user: smtpUser, pass: smtpPass };
    }
    return config;
  }

  if (process.env.SENDGRID_API_KEY) {
    return {
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    };
  }

  if (smtpUser && smtpPass) {
    return {
      service: smtpService || "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    };
  }

  return null;
};

const resolveFromEmail = () =>
  process.env.EMAIL_FROM ||
  process.env.SMTP_FROM_EMAIL ||
  process.env.SENDGRID_FROM_EMAIL ||
  process.env.EMAIL_USER ||
  process.env.SMTP_USER ||
  "";

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });

const transporter = (() => {
  const config = buildTransportConfig();
  if (!config) {
    return null;
  }
  return nodemailer.createTransport(config);
})();

async function sendEmail({ email, subject, message }) {
  const fromEmail = resolveFromEmail();
  if (!transporter) {
    throw new Error(
      "Email transport is not configured. Set SENDGRID_API_KEY (SendGrid SMTP) or SMTP_HOST/SMTP_USER/SMTP_PASS (SMTP), or EMAIL_USER/EMAIL_PASS (legacy Gmail)."
    );
  }
  if (!fromEmail) {
    throw new Error(
      "Sender email is not configured. Set EMAIL_FROM, SMTP_FROM_EMAIL, or SENDGRID_FROM_EMAIL."
    );
  }

  try {
    const safeMessage = escapeHtml(message);
    await transporter.sendMail({
      from: `"BookHive" <${fromEmail}>`,
      to: email,
      subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">BookHive</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">${safeMessage}</p>
            </div>
          </div>
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Copyright ${new Date().getFullYear()} BookHive. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send error:", error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
}

module.exports = sendEmail;
