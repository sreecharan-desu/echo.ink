export const returnLinktoVerify = (userId: string, email: string) => {
    const verifyLink = `https://echoink-backend.cloudflare-apis.workers.dev/verifyemail?userId=${userId}&email=${email}`;
  
    const click_here_to_verify = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #444;
              text-align: center;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .btn {
              display: inline-block;
              padding: 12px 20px;
              font-size: 16px;
              background-color: #4CAF50;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
              text-align: center;
              margin: 0 auto;
              display: block;
            }
            .btn:hover {
              background-color: #45a049;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #777;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Email Verification</h1>
            <p>Hi there,</p>
            <p>Thank you for signing up with us! To verify your email address and complete your registration, please click the link below:</p>
            <a href="${verifyLink}" class="btn">Verify Your Email</a>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <div class="footer">
              <p>© 2025 echo.ink. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  
    return click_here_to_verify;
  }
  