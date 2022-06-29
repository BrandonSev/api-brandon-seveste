const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

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
    const [[emailAlreadyExist]] = await Admin.findOneByEmail(email);
    if (emailAlreadyExist) return res.status(400).json({ message: "Cet email est déjà pris." });

    return jwt.verify(req.headers.authorization.split(" ")[1], process.env.TOKEN_SECRET_AUTHENTICATION, async (err) => {
      if (err) {
        return res.status(401).send(err);
      }
      const [newAdmin] = await Admin.createOne({
        email,
        password,
      });
      if (newAdmin.affectedRows <= 0) {
        return res.status(400).send({ message: "Une erreur est survenue lors de la création du compte" });
      }
      return res.status(200).send({ message: "Bravo, le compte a bien été créé" });
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
    const [[admin]] = await Admin.findOneByEmail(email);
    if (!admin) return res.status(404).send({ message: "Aucun compte avec cet email n'a été trouvé" });
    const comparison = await bcrypt.compare(password, admin.password);
    if (comparison) {
      const token = createToken(admin.id);
      res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: true, maxAge });
      return res.status(200).json({
        message: "Connexion réussi",
        token,
      });
    }
    return res.status(401).json({ message: "Mot de passe incorrect, veuillez réessayer" });
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

/**
 * Middleware qui permet de vérifier qu'un utilisateur est connecté
 * afin de poursuivre certaine requêtes limité
 * @param req
 * @param res
 * @returns {*}
 */
module.exports.isAuthenticated = (req, res, next) => {
  if (req.cookies.jwt) {
    return jwt.verify(req.cookies.jwt, process.env.TOKEN_SECRET, async (err) => {
      if (err) {
        return res.status(401).send(err);
      }
      return next();
    });
  }
  return res.status(401).json({ message: "Vous n'êtes pas connecté" });
};
