const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../db-connection");

const maxAge = 3 * 24 * 60 * 60 * 1000;
// Function qui permet de génerer un token jwt
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

/**
 * Middleware qui permet de s'inscrire
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
module.exports.signUp = async (req, res) => {
  const saltRounds = 10;
  // eslint-disable-next-line prefer-const
  let { email, password } = req.body;
  password = await bcrypt.hash(password, saltRounds);
  try {
    if (!req.headers.authorization) return res.status(401).send({ message: "Token undefined" });
    // eslint-disable-next-line consistent-return
    return jwt.verify(req.headers.authorization.split(" ")[1], process.env.TOKEN_SECRET_AUTHENTICATION, async (err) => {
      if (err) {
        return res.status(401).send(err);
      }
      await db.query("INSERT INTO admin SET email=?, password=?", [email, password], (err2) => {
        if (err2) {
          if (err2.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Cet email est déjà pris." });
          return res.send(err2);
        }
        return res.status(201).json({ message: "Bravo, votre compte a bien été créer" });
      });
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de se connecter
 * @param req
 * @param res
 * @returns {Promise<unknown>}
 */
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send();
  try {
    return await db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(400).send(err);
      if (!result.length) return res.status(404).send({ message: "Cet email est introuvable" });
      const comparison = await bcrypt.compare(password, result[0].password);
      if (comparison) {
        const token = createToken(result[0].id);
        res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: true, maxAge });
        return res.status(200).json({
          message: "Connexion réussi",
          token,
        });
      }
      return res.status(400).json({ message: "Mot de passe incorrect, veuillez réessayer" });
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de se déconnecter
 * @param req
 * @param res
 * @returns {*}
 */
module.exports.signOut = (req, res) => {
  if (req.cookies.jwt) {
    return res.clearCookie("jwt").status(200).json({ message: "Vous êtes maintenant déconnecté" });
  }
  return res.status(400).json({ message: "Vous n'êtes actuellement pas connecté" });
};
