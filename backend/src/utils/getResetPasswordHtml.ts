export const generatePasswordResetHtml = (
  resetUrl: string,
  userFirstname?: string
): string => {
  return `
    <div
      style="
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%);
        padding: 40px 20px;
        border-radius: 16px;
        max-width: 600px;
        margin: 40px auto;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.1);
        color: #e2e8f0;
      "
    >
      <h1
        style="
          color: #facc15;
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0 0 20px;
          text-shadow: 0 4px 10px rgba(0,0,0,0.3);
        "
      >
        Tick Trackerz
      </h1>
      
      <div
        style="
          background: #0f172a;
          padding: 32px 24px;
          border-radius: 12px;
          margin: 28px 0;
          border-left: 5px solid #facc15;
          text-align: left;
        "
      >
        <h2
          style="
            color: #f8fafc;
            font-size: 1.25rem;
            margin: 0 0 12px;
            font-weight: 600;
          "
        >
          Password Reset Request
        </h2>
        <p
          style="
            font-size: 0.95rem;
            color: #cbd5e1;
            margin: 0 0 24px;
            line-height: 1.6;
          "
        >
          Hello${userFirstname ? ` ${userFirstname}` : ""},<br />
          We received a request to reset the password for your Tick Trackerz account. Click the button below to choose a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a
            href="${resetUrl}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              background-color: #facc15;
              color: #0f172a;
              font-weight: 700;
              font-size: 1rem;
              padding: 14px 32px;
              border-radius: 8px;
              text-decoration: none;
              display: inline-block;
              box-shadow: 0 4px 15px rgba(250, 204, 21, 0.35);
              letter-spacing: 0.5px;
            "
          >
            Reset Your Password
          </a>
        </div>
        
        <p
          style="
            font-size: 0.85rem;
            color: #94a3b8;
            margin: 20px 0 0;
            line-height: 1.4;
          "
        >
          <strong>Security Notice:</strong> This link is valid for <strong>15 minutes</strong> and can only be used once.
        </p>
      </div>
      
      <p
        style="
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0;
          line-height: 1.5;
        "
      >
        If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
      
      <p
        style="
          margin-top: 30px;
          font-size: 0.8rem;
          color: #64748b;
        "
      >
        Best regards,<br />
        <strong>The Tick Trackerz Team</strong>
      </p>
    </div>
  `;
};
