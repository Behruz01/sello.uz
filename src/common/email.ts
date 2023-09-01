import { Request, Response } from "express";
import * as nodemailer from "nodemailer";
export const emailSending = async (email: string, res: Response) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "ibragimovbehruz822@gmail.com",
      pass: "xaygolwngzgxutbn",
    },
    secure: true,
  });
  const code: number = Math.floor(100000 + Math.random() * 900000);
  res.cookie("code", code, { maxAge: 120 * 100 * 60 });
  res.cookie("email", email, { maxAge: 120 * 100 * 60 });
  const mailData = {
    from: "ibragimovbehruz822@gmail.com",
    to: `${email}`,
    subject: "Tasdiqlash kodi",
    text: "That was easy!",
    html: `<b>Assalomu alaykum </b>
             <br> Sizning tastiqlash kodingiz: ${code}<br/>`,
  };

  res.status(200).json({ message: "Verification code sent to your email" });
  await transporter.sendMail(mailData);
};
