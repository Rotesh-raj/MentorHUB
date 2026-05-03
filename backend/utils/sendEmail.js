import nodemailer from "nodemailer";

/**
 * BREVO SMTP EMAIL UTILITY
 * -------------------------
 * Migrated from Resend for better SMTP stability.
 */
const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("✅ Brevo SMTP Connected");

    const info = await transporter.sendMail({
      from: `MentorHub <${process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      html: message,
    });

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);

    return true;

  } catch (error) {
    console.error("❌ BREVO EMAIL ERROR:");
    console.error(error);
    return false;
  }
};

export default sendEmail;