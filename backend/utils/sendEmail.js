import nodemailer from "nodemailer";

/**
 * Production-Safe Email Utility — MentorHUB
 *
 * Changes from previous version:
 *  - Timeouts increased from 5s → 30s  (Render cold-start SMTP latency)
 *  - requireTLS: true                  (force STARTTLS upgrade on port 587)
 *  - tls.rejectUnauthorized: false     (allow self-signed certs on some SMTP relays)
 *  - Removed Promise.race verify()     (verify() is non-essential and was causing
 *                                       false-positive timeouts on Render)
 *  - host read from process.env        (allows overriding SMTP host via .env)
 */
const sendEmail = async ({ email, subject, message }) => {
  try {
    if (!email || !subject || !message) {
      console.error("❌ sendEmail: Missing required parameters");
      return false;
    }

    // ── Transporter (production-safe config) ────────────────────────────────
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: 587,
      secure: false,       // false = STARTTLS on port 587
      requireTLS: true,    // enforce TLS upgrade — do NOT fall back to plaintext

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      tls: {
        rejectUnauthorized: false, // allow Render's outbound TLS without strict CA check
      },

      // Generous timeouts for Render's cold-start & network latency
      connectionTimeout: 30000,  // 30 s
      greetingTimeout:   30000,  // 30 s
      socketTimeout:     30000,  // 30 s
    });

    // ── Send ────────────────────────────────────────────────────────────────
    const info = await transporter.sendMail({
      from:    `MentorHub <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: subject,
      html:    message,
    });

    console.log(`✅ Email sent to ${email} | ID: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error("❌ Email Error (sendEmail):", error.message);
    return false;
  }
};

export default sendEmail;