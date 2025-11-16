import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { ISendEmail, IVerificationEmail } from "./interface";

dotenv.config();

const smtpSender = process.env.EMAILSENDER;
const smtpPassword = process.env.EMAILSENDERPASSWORD;
const smtpEmailFrom = process.env.EMAILFROM;
const clientUrl = process.env.CLIENT_URL;
const adminEmail = process.env.ADMIN_EMAIL ?? "";
const baseUrl = process.env.FRONTEND_URL;
const logoUrl = `${baseUrl}/assets/logo/stopreg-logo.svg`;


// export const sendEmail = async (input: ISendEmail) => {
//   const { receiverEmail, subject, emailTemplate } = input;

//   var transport = nodemailer.createTransport({
//       host: emailHost,
//       port: 587,
//       auth: {
//       user: emailSender,
//       pass: emailSenderPassword
//       }
//   });

//   var mailOptions = {
//       from: `Exquisite Investment <${emailFrom}>`,
//       to: receiverEmail,
//       subject,
//       html: emailTemplate ,
//   };

//   transport.sendMail(mailOptions, (error: any, info:any) => {
//       if (error) {
//       return console.log(error);
//       }
//       console.log('Successfully sent');
//   });
// };

export const sendEmail = async (input: ISendEmail) => {
  const mailOptions = {
    from: `"StopReg Team" <${smtpEmailFrom}>`,
    to: input.receiverEmail,
    replyTo: smtpEmailFrom,
    subject: input.subject,
    html: input.emailTemplate,
  };

  const tryPort587 = async () => {
    const transport = nodemailer.createTransport({
      host: "smtp.zeptomail.com",
      port: 587,
      auth: {
        user: smtpSender,
        pass: smtpPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      tls: {
        servername: "smtp.zeptomail.com",
        rejectUnauthorized: true,
      },
    });
    return await transport.sendMail(mailOptions);
  };

  const tryPort465 = async () => {
    const transport = nodemailer.createTransport({
      host: "smtp.zeptomail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpSender,
        pass: smtpPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      tls: {
        servername: "smtp.zeptomail.com",
        rejectUnauthorized: true,
      },
    });
    return await transport.sendMail(mailOptions);
  };

  try {
    const info = await tryPort587();
    console.log("Email successfully sent via port 587:", info.messageId);
    return info;
  } catch (error587: any) {
    if (
      error587.code === "ETIMEDOUT" ||
      error587.code === "ECONNREFUSED" ||
      error587.code === "ESOCKET"
    ) {
      try {
        console.log("Port 587 failed, trying port 465 (SSL)...");
        const info = await tryPort465();
        console.log("Email successfully sent via port 465:", info.messageId);
        return info;
      } catch (error465) {
        console.error("Both ports failed. Port 587 error:", error587);
        console.error("Port 465 error:", error465);
        throw error465;
      }
    }
    console.error("Error sending email via port 587:", error587);
    throw error587;
  }
};
  // try {
  //   // const transporter = nodemailer.createTransport({
  //   //   host: 'smtp-relay.sendinblue.com',
  //   //   port: 587,
  //   //   secure: false,
  //   //   auth: {
  //   //     user: smtpSender,
  //   //     pass: smtpPassword,
  //   //   },
  //   // });

  //   // const mailOptions = {
  //   //   from: `Kingsway <${smtpEmailFrom}>`,
  //   //   to: input.receiverEmail,
  //   //   subject: input.subject,
  //   //   html: input.emailTemplate,
  //   // };

  //   const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: smtpSender,
  //       pass: smtpPassword,
  //     },
  //   });

  //   const mailOptions = {
  //     from: `Kingsway <${smtpEmailFrom}>`,
  //     to: input.receiverEmail,
  //     subject: input.subject,
  //     html: input.emailTemplate,
  //   };

  //   const info = await transporter.sendMail(mailOptions);
  //   return info.response;
  // } catch (error) {
  //   console.error("Email sending error:", error);
  //   // throw error;
  // }

export const sendEmailVerificationMail = async (input: IVerificationEmail) => {
  const { email, otp, expiryTime } = input;

  const verificationLink = `${baseUrl}/?email=${encodeURIComponent(
    email
  )}&token=${encodeURIComponent(otp)}`;

  return sendEmail({
    receiverEmail: email,
    subject: "Welcome to StopReg - Verify Your Email",
    emailTemplate: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      padding: 40px 20px;
      text-align: center;
      position: relative;
    }
    .logo-container {
      margin-bottom: 20px;
    }
    .logo-container img {
      max-width: 180px;
      height: auto;
      background-color: #ffffff;
      padding: 15px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .email-header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .email-header p {
      color: #e2e8f0;
      margin: 10px 0 0;
      font-size: 14px;
    }
    .email-content {
      padding: 40px 30px;
    }
    .email-content h2 {
      color: #1e293b;
      font-size: 24px;
      margin: 0 0 20px;
      font-weight: 600;
    }
    .email-content p {
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 20px;
      font-size: 16px;
    }
    .verification-section {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-radius: 12px;
      padding: 30px;
      margin: 25px 0;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    .otp-display {
      background: #ffffff;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
      text-align: center;
    }
    .otp-label {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 15px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .otp-code {
      font-size: 32px;
      font-weight: 700;
      color: #1e3c72;
      letter-spacing: 6px;
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      display: inline-block;
      padding: 18px 30px;
      border: 2px solid #1e3c72;
      border-radius: 10px;
      margin: 10px auto;
      box-shadow: 0 4px 12px rgba(30, 60, 114, 0.2);
    }
    .expiry-notice {
      margin-top: 15px;
      color: #f59e0b;
      font-size: 14px;
      font-weight: 600;
    }
    .verify-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      border-radius: 8px;
      margin: 25px 0;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
      transition: all 0.3s ease;
    }
    .verify-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(30, 60, 114, 0.4);
    }
    .copy-link-section {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #e2e8f0;
    }
    .link-label {
      color: #64748b;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .link-text {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #475569;
      word-break: break-all;
      user-select: all;
      margin-top: 10px;
    }
    .security-note {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    .security-note p {
      color: #92400e;
      margin: 0;
      font-size: 14px;
    }
    .features-list {
      margin: 25px 0;
      padding-left: 0;
      list-style: none;
    }
    .features-list li {
      color: #64748b;
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
      font-size: 15px;
    }
    .features-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #1e3c72;
      font-weight: bold;
      font-size: 18px;
    }
    .email-footer {
      background: #f8fafc;
      text-align: center;
      padding: 30px;
      border-top: 1px solid #e2e8f0;
    }
    .email-footer p {
      color: #64748b;
      font-size: 12px;
      margin: 5px 0;
    }
    .social-links {
      margin: 15px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #64748b;
      text-decoration: none;
      font-size: 13px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .email-content {
        padding: 30px 20px !important;
      }
      .otp-code {
        font-size: 24px !important;
        letter-spacing: 4px !important;
        padding: 15px 20px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="logo-container">
        <img src="${logoUrl}" alt="StopReg Logo" />
      </div>
      <h1>Welcome to StopReg</h1>
      <p>Professional Email Verification Service</p>
    </div>
    <div class="email-content">
      <h2>Hello!</h2>
      <p>Thank you for signing up with StopReg! We're excited to have you on board. To get started, please verify your email address.</p>
      
      <div class="verification-section">
        <p style="margin-bottom: 20px; color: #1e293b; font-weight: 600; font-size: 18px;">Verify Your Email Address</p>
        
        <div class="otp-display">
          <p class="otp-label">Your 6-digit verification code</p>
          <div class="otp-code">${otp}</div>
          <p class="expiry-notice">⏰ This code will expire in ${expiryTime}</p>
          <p style="margin-top: 10px; color: #64748b; font-size: 13px;">Enter this code on the verification page or click the button below</p>
        </div>
       
        <a href="${verificationLink}" class="verify-button">Verify Email Address</a>
        
        <div class="copy-link-section">
          <p class="link-label">If the button doesn't work, copy and paste this link into your browser:</p>
          <div class="link-text">${verificationLink}</div>
        </div>
      </div>

      <div class="security-note">
        <p><strong>Security Note:</strong> This verification code will expire in ${expiryTime}. If you didn't create an account with StopReg, please ignore this email.</p>
      </div>

      <p style="margin-top: 30px; font-weight: 600; color: #1e293b;">Once verified, you'll have access to:</p>
      <ul class="features-list">
        <li>Advanced email domain verification</li>
        <li>Bulk email validation</li>
        <li>Disposable email detection</li>
        <li>Real-time API access</li>
        <li>Comprehensive analytics dashboard</li>
        <li>24/7 customer support</li>
      </ul>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} StopReg. All rights reserved.</p>
      <p>Professional Email Verification Solutions</p>
      <div class="social-links">
        <a href="${baseUrl}/support">Support</a> | <a href="${baseUrl}/docs">Documentation</a> | <a href="${baseUrl}/privacy">Privacy Policy</a>
      </div>
    </div>
  </div>
</body>
</html>`,
  });
};
