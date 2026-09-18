import { Resend } from "resend";
import { envConfig } from "../config/env.config.ts";

const apiKey = envConfig.RESEND_API_KEY;
const fromEmail = envConfig.RESEND_EMAIL_FROM;



const resend = new Resend(apiKey);


export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
     
      console.error("Resend API internal error:", JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
  
    console.error("Failed to execute sendEmail service:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Unknown connection error" 
    };
  }
};



