require("dotenv").config();
const emailRouter = require("express").Router();
const nodemailer = require("nodemailer");

const { SENDER_EMAIL_ADDRESS, SENDER_EMAIL_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL_ADDRESS,
    pass: SENDER_EMAIL_PASSWORD,
  },
});

emailRouter.post("/send", async (req, res) => {
  const { name, email, message, subject } = req.body;
  const mailOptions = {
    from: email,
    to: SENDER_EMAIL_ADDRESS,
    subject: `${subject} - ${name}`,
    html: `<p style="font-weight: bold">${name}</p><p>${message}</p>`,
  };
  await transport.sendMail(mailOptions, (err) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json({ message: "Le mail a bien été envoyé" });
  });
});

module.exports = emailRouter;
