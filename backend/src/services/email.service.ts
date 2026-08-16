import nodemailer from "nodemailer";
import { envConfig } from "../config/env.config.ts";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: envConfig.GOOGLE_USER,
    clientId: envConfig.GOOGLE_CLIENT_ID,
    clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
    refreshToken: envConfig.GOOGLE_REFRESH_TOKEN,
  },
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Email service is ready!");
  } catch (error) {
    console.error("Email service configuration failed:", error);
  }
};

verifyTransporter();

export const sendEmail = async (to: string, subject: string, html: string) => {
  return await transporter.sendMail({
    from: envConfig.GOOGLE_USER,
    to,
    subject,
    html,
  });
};
