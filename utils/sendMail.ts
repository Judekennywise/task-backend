import dotenv from "dotenv";
dotenv.config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import { EmailOptions } from "../@types/@mail/emailOptions";

const SendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: parseInt(process.env.SMPT_PORT || "587"),
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const { email, subject, template } = options;

  const mailOptions = {
    from: "app@aagolf.co.uk",
    to: email,
    subject,
    html:template,
  };

  await transporter.sendMail(mailOptions);
};

export default SendMail;
