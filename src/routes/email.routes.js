require("dotenv").config();
const emailRouter = require("express").Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fetch = require("node-fetch");

const { SENDER_EMAIL_ADDRESS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL, GOOGLE_REFRESH_TOKEN, RECAPTCHA_SECRET_KEY } = process.env;

const validateHuman = async (token) => {
  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`, {
    method: "POST",
  });
  const data = await res.json();

  return data.success;
};

// Utilisation de OAuth2 pour l'envoie de mail en prod
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
  const { firstname, lastname, email, message, token } = req.body;
  const human = await validateHuman(token);
  if (!human) {
    return res.status(400).send({ message: "You're not human!" });
  }
  const fullname = `${firstname} ${lastname}`;
  const mailOptions = {
    from: email,
    to: SENDER_EMAIL_ADDRESS,
    subject: `${fullname} - ${email}`,
    html: `
      <p style="font-weight: bold">${fullname},</p><p>${message}</p>
    `,
  };
  return transport.sendMail(mailOptions, (err) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json({ message: "Le mail a bien été envoyé" });
  });
});

module.exports = emailRouter;
