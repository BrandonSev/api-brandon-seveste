const authRouter = require("express").Router();
const { AuthController } = require("../controllers");

authRouter.post("/register", AuthController.signUp);
authRouter.post("/login", AuthController.signIn);
authRouter.post("/logout", AuthController.signOut);

module.exports = authRouter;
