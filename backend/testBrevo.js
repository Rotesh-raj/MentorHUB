import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function test() {
  try {

    await transporter.verify();

    console.log("✅ SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: `MentorHub <${process.env.EMAIL_FROM}>`,
      to: "YOUR_REAL_EMAIL@gmail.com",
      subject: "MentorHub Test Email",
      html: "<h1>Brevo Working ✅</h1>"
    });

    console.log("✅ EMAIL SENT");
    console.log(info);

  } catch (error) {

    console.error("❌ FULL ERROR:");
    console.error(error);
  }
}

test();