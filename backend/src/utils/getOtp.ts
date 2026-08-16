export const generateOtp = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const generateOtpHtml = (otp: string) => {
  return `
    <div
      style="
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%);
        padding: 40px;
        border-radius: 16px;
        max-width: 600px;
        margin: 40px auto;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.1);
      "
    >
      <h1
        style="
          color: #facc15;
          font-size: 2.5rem;
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
          padding: 30px;
          border-radius: 12px;
          margin: 30px 0;
          border-left: 5px solid #facc15;
        "
      >
        <p
          style="
            font-size: 1rem;
            color: #e2e8f0;
            margin: 0 0 15px;
          "
        >
          Hello! Your One-Time Password (OTP) for account verification is:
        </p>
        
        <div
          style="
            font-size: 4rem;
            font-weight: 800;
            color: #facc15;
            letter-spacing: 8px;
            margin: 20px 0;
            text-shadow: 0 4px 15px rgba(0,0,0,0.4);
          "
        >
          ${otp}
        </div>
        
        <p
          style="
            font-size: 0.9rem;
            color: #94a3b8;
            margin: 20px 0 0;
            font-style: italic;
          "
        >
          This OTP will expire in 5 minutes
        </p>
      </div>
      
      <p
        style="
          font-size: 0.9rem;
          color: #cbd5e1;
          margin: 0;
          line-height: 1.5;
        "
      >
        If you did not request this code, please ignore this email
        <br />
        For security reasons, never share your OTP with anyone
      </p>
      
      <p
        style="
          margin-top: 30px;
          font-size: 0.85rem;
          color: #475569;
        "
      >
        Best regards,<br />
        The Tick Trackerz Team
      </p>
    </div>
  `;
};
