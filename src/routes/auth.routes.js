const authRouter = require("express").Router();
const { AuthController } = require("../controllers");
const { isAuthenticated } = require("../controllers/auth.controllers");

authRouter.post("/register", AuthController.signUp);
authRouter.post("/login", AuthController.signIn);
authRouter.post("/logout", isAuthenticated, AuthController.signOut);

module.exports = authRouter;
