require("dotenv").config();
const emailRouter = require("express").Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { SENDER_EMAIL_ADDRESS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL, GOOGLE_REFRESH_TOKEN } = process.env;

const oAuth2client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL);
oAuth2client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
const accessToken = oAuth2client.getAccessToken();
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: SENDER_EMAIL_ADDRESS,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN,
    accessToken,
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
