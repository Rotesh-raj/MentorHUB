import nodemailer from "nodemailer";

/**
 * High-Security Email Utility with Timeout Protection
 * Prevents server hanging (ERR_EMPTY_RESPONSE) during SMTP operations
 */
const sendEmail = async ({ email, subject, message }) => {
  try {
    if (!email || !subject || !message) {
      console.error("❌ sendEmail: Missing required parameters");
      return false;
    }

    // Create transporter with strict timeout settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 5000, // 5 seconds
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    // Verify SMTP connection with Race to prevent hanging
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP Connection Timeout")), 5000)
      ),
    ]);

    // Send Mail
    const info = await transporter.sendMail({
      from: `MentorHub <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
    });

    console.log(`✅ Email sent to ${email} | ID: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error("❌ Email Error (sendEmail):", error.message);
    return false;
  }
};

export default sendEmail;