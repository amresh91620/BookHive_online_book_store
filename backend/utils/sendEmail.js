const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Book Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>${subject}</h2>
          <p>${message}</p>
          <p style="margin-top:20px;font-size:12px;color:#555;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
};

module.exports = sendEmail;
