"use strict";
import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, subject: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("testAccount: ", testAccount);
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "hotmail",
      // port: 465,
      // secure: true, // true for 465, false for other ports, 587
      auth: {
        user: "next_journey_app@outlook.com", // generated ethereal user
        pass: process.env.MAIL_PASS, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "next_journey_app@outlook.com", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      // text: `${text}`, // plain text body
      html: html, // html body
    });

    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("Email sent");
  } catch (err) {
    console.log(err);
  }
}
