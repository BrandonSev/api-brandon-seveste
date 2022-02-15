require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const mainRouter = require("./src/routes");
const { connection } = require("./db-connection");
const { checkUser, isAuthenticated } = require("./src/middleware/Auth");

app.use(
  cors({
    // origin: ["http://localhost:3000", "http://localhost:3001", "http://192.168.0.28:3000", "http://192.168.0.28:3001"],
    origin: [process.env.CLIENT_ORIGIN, process.env.CLIENT_DASHBOARD_ORIGIN],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("*", checkUser);
// Prefix all routes with /api
app.use("/api", mainRouter);
app.use("/images", express.static("public/images"));
app.get("/api/jwtid", checkUser, isAuthenticated, (req, res) => {
  res.status(200).json({ id: res.locals.user.id });
});

const server = app.listen(process.env.PORT || 8000, (err) => {
  // eslint-disable-next-line no-console
  if (err) return console.log(err.message);
  // eslint-disable-next-line no-console
  console.log(`La connexion au serveur a réussi: http://localhost:${process.env.PORT || 8000}`);
  // Test connexion to MYSQL DB
  return connection.getConnection((dbErr) => {
    // eslint-disable-next-line no-console
    if (dbErr) return console.log(dbErr.message);
    // eslint-disable-next-line no-console
    return console.log(`La connexion a la base de donnée a réussi`);
  });
});

module.exports = server;
