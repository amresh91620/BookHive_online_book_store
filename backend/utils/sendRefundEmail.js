const https = require("https");

const BREVO_API_URL = process.env.BREVO_API_URL || "https://api.brevo.com/v3/smtp/email";

const resolveSender = () => {
  const email = process.env.BREVO_SENDER_EMAIL || "";
  const name = process.env.BREVO_SENDER_NAME || "BookHive";
  return { email, name };
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const buildRefundEmailHtml = ({ 
  userName, 
  orderNumber, 
  refundAmount, 
  refundId, 
  cancelledBy,
  cancellationReason,
  paymentMethod 
}) => {
  const isOnlinePayment = paymentMethod === "ONLINE";
  const refundTimeline = isOnlinePayment ? "5-7 business days" : "N/A (COD)";
  const refundMessage = isOnlinePayment 
    ? `Your refund of <strong>${formatPrice(refundAmount)}</strong> has been initiated and will be credited to your original payment method within <strong>5-7 business days</strong>.`
    : `Your order was placed with Cash on Delivery. No payment was collected, so no refund is necessary.`;

  return `
    <div style="margin: 0; padding: 24px; background: #f5f7fb; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 24px;">
          <div style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">BookHive</div>
          <div style="font-size: 13px; color: #fff7ed; margin-top: 4px;">Your reading journey, delivered</div>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #111827;">Order Cancelled & Refund Initiated</h2>
          <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280;">Order #${orderNumber}</p>

          <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.7;">
            Hi <strong>${userName}</strong>,
          </p>

          <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.7;">
            Your order <strong>#${orderNumber}</strong> has been cancelled ${cancelledBy === 'user' ? 'as per your request' : 'by our team'}.
          </p>

          ${cancellationReason ? `
          <div style="margin: 0 0 20px 0; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>Reason:</strong> ${cancellationReason}
            </p>
          </div>
          ` : ''}

          <!-- Refund Details -->
          <div style="margin: 24px 0; padding: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #166534;">💰 Refund Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Refund Amount:</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827; text-align: right; font-weight: 600;">
                  ${formatPrice(refundAmount)}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Payment Method:</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827; text-align: right;">
                  ${paymentMethod === 'ONLINE' ? 'Online Payment' : 'Cash on Delivery'}
                </td>
              </tr>
              ${refundId ? `
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Refund ID:</td>
                <td style="padding: 8px 0; font-size: 12px; color: #111827; text-align: right; font-family: monospace;">
                  ${refundId}
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Refund Timeline:</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827; text-align: right; font-weight: 600;">
                  ${refundTimeline}
                </td>
              </tr>
            </table>
          </div>

          <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.7;">
            ${refundMessage}
          </p>

          ${isOnlinePayment ? `
          <div style="margin: 24px 0; padding: 16px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af; font-weight: 600;">
              ℹ️ What happens next?
            </p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px; color: #1e3a8a; line-height: 1.6;">
              <li>Your refund has been processed from our end</li>
              <li>It will appear in your account within 5-7 business days</li>
              <li>The exact timeline depends on your bank/payment provider</li>
              <li>You'll receive the refund in the same account used for payment</li>
            </ul>
          </div>
          ` : ''}

          <!-- Action Button -->
          <div style="margin: 32px 0; text-align: center;">
            <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/orders" 
               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
              View Order History
            </a>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;">
            <p style="margin: 0; font-size: 13px; color: #991b1b; line-height: 1.6;">
              <strong>Need help?</strong> If you have any questions about your refund or cancellation, please contact our support team. We're here to help!
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 24px; background: #111827; text-align: center;">
          <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 12px;">
            Thank you for shopping with BookHive
          </p>
          <p style="color: #6b7280; margin: 0; font-size: 11px;">
            Copyright ${new Date().getFullYear()} BookHive. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
};

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

async function sendRefundEmail({ 
  email, 
  userName, 
  orderNumber, 
  refundAmount, 
  refundId,
  cancelledBy,
  cancellationReason,
  paymentMethod 
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("Brevo API key not configured. Skipping refund email.");
    return;
  }

  const sender = resolveSender();
  if (!sender.email) {
    console.warn("Sender email not configured. Skipping refund email.");
    return;
  }

  try {
    const subject = `Order Cancelled & Refund Initiated - #${orderNumber}`;
    const htmlContent = buildRefundEmailHtml({
      userName,
      orderNumber,
      refundAmount,
      refundId,
      cancelledBy,
      cancellationReason,
      paymentMethod
    });

    const textContent = `
Hi ${userName},

Your order #${orderNumber} has been cancelled ${cancelledBy === 'user' ? 'as per your request' : 'by our team'}.

${cancellationReason ? `Reason: ${cancellationReason}\n` : ''}

Refund Details:
- Amount: ${formatPrice(refundAmount)}
- Payment Method: ${paymentMethod === 'ONLINE' ? 'Online Payment' : 'Cash on Delivery'}
${refundId ? `- Refund ID: ${refundId}\n` : ''}
- Timeline: ${paymentMethod === 'ONLINE' ? '5-7 business days' : 'N/A (COD)'}

${paymentMethod === 'ONLINE' ? 'Your refund has been initiated and will be credited to your original payment method within 5-7 business days.' : 'Your order was placed with Cash on Delivery. No payment was collected, so no refund is necessary.'}

Thank you for shopping with BookHive!
    `.trim();

    await postJson(
      BREVO_API_URL,
      {
        sender: {
          name: sender.name,
          email: sender.email,
        },
        to: [{ email, name: userName }],
        subject,
        textContent,
        htmlContent,
      },
      { "api-key": apiKey }
    );

    console.log(`Refund email sent to ${email} for order ${orderNumber}`);
  } catch (error) {
    console.error("Refund email send error:", error.message);
    // Don't throw error - email failure shouldn't block refund processing
  }
}

module.exports = sendRefundEmail;
