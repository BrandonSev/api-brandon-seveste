const mainRouter = require("express").Router();
const projectRouter = require("./project.routes");
const imagesRouter = require("./images.routes");
const authRouter = require("./auth.routes");
const categoryRouter = require("./category.routes");
const underCategoryRouter = require("./underCategory.routes");
const technologyRouter = require("./technology.routes");
const emailRouter = require("./email.routes");

mainRouter.use("/projects", projectRouter);

mainRouter.use("/images", imagesRouter);

mainRouter.use("/", authRouter);

mainRouter.use("/categories", categoryRouter);

mainRouter.use("/underCategories", underCategoryRouter);

mainRouter.use("/technologies", technologyRouter);

mainRouter.use("/email", emailRouter);

module.exports = mainRouter;
