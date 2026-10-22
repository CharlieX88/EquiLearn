import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // Real Gmail SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || "StockMarket App"} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  
  // Console log for debugging (production mein hata sakte ho)
  console.log("📧 Email sent successfully: %s", info.messageId);
  
  // Testing ke liye link terminal mein print karenge
  if (options.resetUrl) {
    console.log("🔗 RESET LINK FOR TESTING:", options.resetUrl);
  }
};