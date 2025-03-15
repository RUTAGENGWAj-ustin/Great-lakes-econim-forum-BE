// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import "dotenv/config";


// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});
// Email sending endpoint
router.post("/", (req, res) => {
    const { name, email, message } = req.body;
  
    const mailOptions = {
      from: email, // Sender's email
      to: "justrutagengwa@gmail.com", // Recipient's email
      subject: `New Message from ${name}`,
      text: message,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending email");
      }
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    });
  });

  export default router;