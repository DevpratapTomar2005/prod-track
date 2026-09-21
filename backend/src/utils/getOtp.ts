export const generateOtp = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const generateOtpHtml = (otp: string) => {
  const digits = otp.split("");

  const otpBoxes = digits
    .map(
      (digit, i) => `
        <td style="padding: 0 3px;" align="center">
          <div
            style="
              width: 44px;
              height: 52px;
              background-color: #ffffff;
              border: 1.5px solid #cbd5e1;
              border-radius: 8px;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 24px;
              font-weight: 700;
              color: #0f172a;
              text-align: center;
              line-height: 52px;
              box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
            "
          >
            ${digit}
          </div>
        </td>
        ${
          i === 2
            ? `<td style="padding: 0 4px; color: #94a3b8; font-size: 18px; font-weight: 300; text-align: center;" align="center">&mdash;</td>`
            : ""
        }
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Your Verification Code - Tick Trackerz</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
        <style>
          body, table, td, p, a, li {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            outline: none;
            text-decoration: none;
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper {
              padding: 20px 12px !important;
            }
            .email-card {
              width: 100% !important;
              border-radius: 12px !important;
            }
            .card-body {
              padding: 28px 20px !important;
            }
            .digit-box {
              width: 38px !important;
              height: 48px !important;
              line-height: 48px !important;
              font-size: 20px !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table
          role="presentation"
          class="email-wrapper"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #f1f5f9; width: 100%; margin: 0; padding: 48px 16px;"
        >
          <tr>
            <td align="center">
              <!-- Main Email Card -->
              <table
                role="presentation"
                class="email-card"
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="540"
                style="
                  max-width: 540px;
                  width: 100%;
                  background-color: #ffffff;
                  border-radius: 16px;
                  border: 1px solid #e2e8f0;
                  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
                  overflow: hidden;
                "
              >
                <!-- Top Repeated Pattern Header Bar (matching Login & Verify OTP pages) -->
                <tr>
                  <td
                    height="30"
                    style="
                      height: 30px;
                      background-color: #fafbfc;
                      background-image: repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 15px,
                        #e5e7eb 15px,
                        #e5e7eb 16.5px
                      );
                      border-bottom: 1px solid #e5e7eb;
                    "
                  >&nbsp;</td>
                </tr>

                <!-- Card Content -->
                <tr>
                  <td class="card-body" style="padding: 40px 44px 36px 44px;">
                    <!-- Brand Navbar / Top Bar -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                      <tr>
                        <td align="left" valign="middle">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              
                              <td valign="middle">
                                <span
                                  style="
                                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                    font-size: 25px;
                                    font-weight: 800;
                                    color: #0f172a;
                                    letter-spacing: -0.3px;
                                  "
                                >
                                  Tick Trackerz
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        
                      </tr>
                    </table>

                    <!-- Heading & Context -->
                    <h1
                      style="
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        color: #0f172a;
                        font-size: 24px;
                        font-weight: 700;
                        line-height: 1.3;
                        margin: 0 0 12px;
                        letter-spacing: -0.4px;
                      "
                    >
                      Verify your email address
                    </h1>
                    <p
                      style="
                        font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        font-size: 14px;
                        color: #64748b;
                        margin: 0 0 28px;
                        line-height: 1.6;
                      "
                    >
                      Use the one-time verification code below to verify your account and complete your sign-in to Tick Trackerz.
                    </p>

                    <!-- OTP Block Container -->
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 12px;
                        margin-bottom: 28px;
                      "
                    >
                      <tr>
                        <td align="center" style="padding: 24px 16px;">
                          <div
                            style="
                              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                              font-size: 11px;
                              font-weight: 700;
                              color: #64748b;
                              letter-spacing: 1px;
                              text-transform: uppercase;
                              margin-bottom: 14px;
                            "
                          >
                            One-Time Password
                          </div>

                          <!-- OTP Boxes Table -->
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              ${otpBoxes}
                            </tr>
                          </table>

                          <!-- Expiration & Status Info -->
                          <div
                            style="
                              margin-top: 16px;
                              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                              font-size: 12px;
                              font-weight: 500;
                              color: #0891b2;
                            "
                          >
                            Valid for 5 minutes &bull; Single-use only
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Info Box -->
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        background-color: #ffffff;
                        border-left: 3px solid #06b6d4;
                        padding: 12px 14px;
                        margin-bottom: 24px;
                      "
                    >
                      <tr>
                        <td>
                          <div
                            style="
                              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                              font-size: 12px;
                              font-weight: 700;
                              color: #334155;
                              margin-bottom: 4px;
                            "
                          >
                            Security Notice
                          </div>
                          <p
                            style="
                              font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                              font-size: 12px;
                              color: #64748b;
                              margin: 0;
                              line-height: 1.5;
                            "
                          >
                            Never share this verification code with anyone. Tick Trackerz representatives will never ask for your code or credentials.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        font-size: 12px;
                        color: #94a3b8;
                        margin: 0 0 28px;
                        line-height: 1.6;
                      "
                    >
                      If you did not request this verification code, please disregard this email. Your account remains secure.
                    </p>

                    <!-- Team Signature -->
                    <p
                      style="
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        font-size: 13px;
                        font-weight: 600;
                        color: #475569;
                        margin: 0;
                      "
                    >
                      The Tick Trackerz Team
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background-color: #f8fafc;
                      padding: 18px 44px;
                      border-top: 1px solid #e2e8f0;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        font-size: 11px;
                        color: #94a3b8;
                        margin: 0;
                        line-height: 1.6;
                      "
                    >
                      Tick Trackerz &bull; Smart Task &amp; Time Tracking<br />
                      This is an automated system email. Please do not reply directly to this message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
