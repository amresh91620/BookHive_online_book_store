const https = require("https");

const BREVO_API_URL =
  process.env.BREVO_API_URL || "https://api.brevo.com/v3/smtp/email";

const resolveSender = () => {
  const email =
    process.env.BREVO_SENDER_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_FROM_EMAIL ||
    process.env.SENDGRID_FROM_EMAIL ||
    process.env.EMAIL_USER ||
    process.env.SMTP_USER ||
    "";
  const name =
    process.env.BREVO_SENDER_NAME ||
    process.env.EMAIL_FROM_NAME ||
    "BookHive";
  return { email, name };
};

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

const buildHtml = (safeMessage) => `
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
      `;

const postJson = (url, body, headers = {}) =>
  new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const parsedUrl = new URL(url);
    const request = https.request(
      {
        method: "POST",
        hostname: parsedUrl.hostname,
        path: `${parsedUrl.pathname}${parsedUrl.search}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          ...headers,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const status = res.statusCode || 0;
          const contentType = res.headers["content-type"] || "";
          let parsed = data;

          if (data && contentType.includes("application/json")) {
            try {
              parsed = JSON.parse(data);
            } catch (error) {
              parsed = data;
            }
          }

          if (status >= 200 && status < 300) {
            resolve({ status, data: parsed });
            return;
          }

          const message =
            (parsed &&
              typeof parsed === "object" &&
              (parsed.message || parsed.error || parsed.code)) ||
            (typeof parsed === "string" && parsed) ||
            `Brevo API request failed with status ${status}`;
          const error = new Error(message);
          error.status = status;
          error.response = parsed;
          reject(error);
        });
      }
    );

    request.on("error", reject);
    request.write(payload);
    request.end();
  });

async function sendEmail({ email, subject, message }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("Brevo API key is not configured. Set BREVO_API_KEY.");
  }

  const sender = resolveSender();
  if (!sender.email) {
    throw new Error(
      "Sender email is not configured. Set BREVO_SENDER_EMAIL or EMAIL_FROM."
    );
  }

  try {
    const textContent =
      typeof message === "string" ? message : String(message ?? "");
    const safeMessage = escapeHtml(textContent);
    await postJson(
      BREVO_API_URL,
      {
        sender: {
          name: sender.name,
          email: sender.email,
        },
        to: [{ email }],
        subject,
        textContent,
        htmlContent: buildHtml(safeMessage),
      },
      { "api-key": apiKey }
    );
  } catch (error) {
    console.error("Email send error:", error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
}

module.exports = sendEmail;
