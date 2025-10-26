"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const emailHost = process.env.EMAILHOST || "";
const emailSender = process.env.EMAILSENDER;
const emailSenderPassword = process.env.EMAILSENDERPASSWORD;
const emailFrom = process.env.EMAILFROM;
const adminEmail = process.env.ADMIN_EMAIL || "";
const companyName = process.env.COMPANY_NAME || "";
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
const sendEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverEmail, subject, emailTemplate } = input;
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: emailSender,
            pass: emailSenderPassword,
        },
    });
    const mailOptions = {
        from: `${process.env.COMPANY_NAME || "Your Company"} <${process.env.EMAILSENDER}>`,
        to: receiverEmail,
        subject,
        html: emailTemplate,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${receiverEmail}`);
    }
    catch (error) {
        console.error(`Failed to send email to ${receiverEmail}:`, error);
    }
});
exports.sendEmail = sendEmail;
const sendVerificationEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, otp } = input;
    return (0, exports.sendEmail)({
        receiverEmail: email,
        subject: "Email Verification",
        emailTemplate: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #000000;
      padding: 20px;
      text-align: center;
    }
    .email-header h1 {
      color: #FFD700;
      margin: 0;
      font-size: 24px;
    }
    .email-content {
      padding: 20px;
    }
    .email-content h2 {
      color: #333333;
      font-size: 20px;
    }
    .email-content p {
      color: #555555;
      line-height: 1.5;
    }
    .verification-code {
      display: inline-block;
      padding: 12px 24px;
      margin: 20px 0;
      background-color: #FFD700;
      color: #000000;
      font-weight: bold;
      font-size: 24px;
      border-radius: 4px;
      letter-spacing: 4px;
    }
    .email-footer {
      background-color: #f9f9f9;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${companyName}</h1>
    </div>
    <div class="email-content">
      <h2>Hello, ${firstName}!</h2>
      <p>Thank you for signing up with ${companyName}. Please use the code below to verify your email address:</p>
      <div class="verification-code">${otp}</div>
      <p>If you did not sign up for this account, please disregard this email.</p>
    </div>
    <div class="email-footer">
      &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.
    </div>
  </div>
</body>
</html>`,
    });
});
exports.sendVerificationEmail = sendVerificationEmail;
// export const sendForgotPasswordEmail = async (input: IOTP) => {
//   const email = input.email;
//   const otp = input.otp;
//   const userName = input.userName;
//   const verificationLink = `${clientUrl}/reset-password/?token=${otp}&email=${email}`;
//   return sendEmail({
//     receiverEmail: email,
//     subject: "Email Verification",
//     emailTemplate: `<!DOCTYPE html>
// <html>
// <head>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f9f9f9;
//       margin: 0;
//       padding: 0;
//     }
//     .email-container {
//       max-width: 600px;
//       margin: 0 auto;
//       background-color: #ffffff;
//       border: 1px solid #eaeaea;
//       border-radius: 8px;
//       overflow: hidden;
//     }
//     .email-header {
//       background-color: #000000;
//       padding: 20px;
//       text-align: center;
//     }
//     .email-header h1 {
//       color: #FFD700;
//       margin: 0;
//       font-size: 24px;
//     }
//     .email-content {
//       padding: 20px;
//     }
//     .email-content h2 {
//       color: #333333;
//       font-size: 20px;
//     }
//     .email-content p {
//       color: #555555;
//       line-height: 1.5;
//     }
//     .reset-button {
//       display: inline-block;
//       padding: 12px 24px;
//       margin: 20px 0;
//       background-color: #FFD700;
//       color: #000000;
//       text-decoration: none;
//       font-weight: bold;
//       border-radius: 4px;
//       font-size: 16px;
//     }
//     .email-footer {
//       background-color: #f9f9f9;
//       text-align: center;
//       padding: 10px;
//       font-size: 12px;
//       color: #888888;
//     }
//   </style>
// </head>
// <body>
//   <div class="email-container">
//     <div class="email-header">
//       <h1>Exquisite Investment Limited</h1>
//     </div>
//     <div class="email-content">
//       <h2>Hello, ${userName}!</h2>
//       <p>We received a request to reset your password. Click the button below to set a new password.</p>
//       <a href="${verificationLink}" class="reset-button">Reset Password</a>
//       <p>If you did not request a password reset, please ignore this email or contact support if you have any questions.</p>
//       <p>For security reasons, this link will expire in 30 minutes.</p>
//     </div>
//     <div class="email-footer">
//       &copy; ${new Date().getFullYear()} Exquisite Investment Limited. All rights reserved.
//     </div>
//   </div>
// </body>
// </html>`,
//   });
// };
// export const sendEmailToAdminOnUserDepositRequest = async (input: IAdminDepositEmail) => {
//   const email = adminEmail;
//   const planName = input.plan;
//   const paymentMethod = input.paymentMethod;
//   const amount= input.amount;
//   const userName = input.userName;
//   return sendEmail({
//     receiverEmail: email,
//     subject: "DEPOSIT NOTIFICATION",
//     emailTemplate: `<html>
//       <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
//         <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0;">
//           <!-- Header -->
//           <tr style="background-color: #000000;">
//             <td style="padding: 20px; text-align: center; color: #FFD700;">
//               <h1>Deposit Alert</h1>
//             </td>
//           </tr>
//           <!-- Body Content -->
//           <tr>
//             <td style="padding: 20px; color: #333333;">
//               <h2 style="color: #FFD700;">Deposit Notification</h2>
//               <p>Dear Admin,</p>
//               <p>A new deposit has been made with the following details:</p>
//               <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
//                <tr>
//                   <td style="color: #333333; padding: 10px 0; font-weight: bold;">Username:</td>
//                   <td style="color: #333333; padding: 10px 0;">${userName}</td>
//                 </tr> 
//               <tr>
//                   <td style="color: #333333; padding: 10px 0; font-weight: bold;">Plan Name:</td>
//                   <td style="color: #333333; padding: 10px 0;">${planName}</td>
//                 </tr>
//                 <tr>
//                   <td style="color: #333333; padding: 10px 0; font-weight: bold;">Payment Method:</td>
//                   <td style="color: #333333; padding: 10px 0;">${paymentMethod}</td>
//                 </tr>
//                 <tr>
//                   <td style="color: #333333; padding: 10px 0; font-weight: bold;">Amount:</td>
//                   <td style="color: #333333; padding: 10px 0;">$${amount}</td>
//                 </tr>
//               </table>
//               <p style="margin-top: 20px;">Please log in to the admin dashboard to view more details or take further actions.</p>
//               <!-- Footer -->
//               <p style="margin-top: 20px; color: #777777; font-size: 12px;">
//                 © ${new Date().getFullYear()} Exquisite Investment Limited. All rights reserved.
//               </p>
//             </td>
//           </tr>
//         </table>
//       </body>
//     </html>`,
//   });
// };
// export const sendEmailToAdminOnUserWithdrawalRequest = async (input: IAdminWithdrwalEmail) => {
//   const email = adminEmail;
//   const amount= input.amount;
//   const userName = input.userName;
//   const address = input.address;
//   const withdrawalMethod = input.withdrawalMethod;
//   return sendEmail({
//     receiverEmail: email,
//     subject: "WITHDRAWAL NOTIFICATION",
//     emailTemplate: `<html>
//       <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
//         <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0;">
//           <!-- Header -->
//           <tr style="background-color: #000000;">
//             <td style="padding: 20px; text-align: center; color: #FFD700;">
//               <h1>WIthdrwalAlert</h1>
//             </td>
//           </tr>
//           <!-- Body Content -->
//           <tr>
//             <td style="padding: 20px; color: #333333;">
//               <h2 style="color: #FFD700;">Withdrwal Notification</h2>
//               <p>Dear Admin,</p>
//               <p>A withdrwal request has been made with the following details:</p>
//               <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
//                <tr>
//                   <td style="color: #333333; padding: 10px 0; font-weight: bold;">Username:</td>
//                   <td style="color: #333333; padding: 10px 0;">${userName}</td>
//                 </tr> 
//                 <tr>
//                   <td style="color: #333333; padding: 10px 0; font-weight: bold;">Withdrawal Method:</td>
//                   <td style="color: #333333; padding: 10px 0;">${withdrawalMethod}</td>
//                 </tr>
//                  <tr>
//                   <td style="color: #333333; padding: 10px 0; font-weight: bold;">Address:</td>
//                   <td style="color: #333333; padding: 10px 0;">${address}</td>
//                 </tr>
//                 <tr>
//                   <td style="color: #333333; padding: 10px 0; font-weight: bold;">Amount:</td>
//                   <td style="color: #333333; padding: 10px 0;">$${amount}</td>
//                 </tr>
//               </table>
//               <p style="margin-top: 20px;">Please log in to the admin dashboard to view more details or take further actions.</p>
//               <!-- Footer -->
//               <p style="margin-top: 20px; color: #777777; font-size: 12px;">
//                 © ${new Date().getFullYear()} Exquisite Investment Limited. All rights reserved.
//               </p>
//             </td>
//           </tr>
//         </table>
//       </body>
//     </html>`,
//   });
// };
