const https = require("https");

const BREVO_API_URL =
  process.env.BREVO_API_URL || "https://api.brevo.com/v3/smtp/email";

const resolveSender = () => {
  const email = process.env.BREVO_SENDER_EMAIL || "";
  const name = process.env.BREVO_SENDER_NAME || "BookHive";
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
        <div style="margin: 0; padding: 24px; background: #f5f7fb; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 24px;">
              <div style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">BookHive</div>
              <div style="font-size: 13px; color: #fff7ed; margin-top: 4px;">Your reading journey, delivered</div>
            </div>
            <div style="padding: 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #111827;">Hello!</h2>
              <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.7;">${safeMessage}</p>
              <div style="margin-top: 20px; padding: 14px 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; color: #9a3412; font-size: 12px;">
                If you didn’t request this, you can safely ignore this email.
              </div>
            </div>
            <div style="padding: 16px 24px; background: #111827; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                Copyright ${new Date().getFullYear()} BookHive. All rights reserved.
              </p>
            </div>
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
      "Sender email is not configured. Set BREVO_SENDER_EMAIL."
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
