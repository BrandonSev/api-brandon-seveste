const categoryRouter = require("express").Router();
const { CategoryController } = require("../controllers");
const { isAuthenticated } = require("../controllers/auth.controllers");
const { validatePostCategory, validatePutCategory, validateRemoveCategory } = require("../middleware/Category");

categoryRouter.get("/", CategoryController.findAll);
categoryRouter.get("/:id", CategoryController.findOneById);

categoryRouter.post("/", isAuthenticated, validatePostCategory, CategoryController.createOne, CategoryController.findOneById);
categoryRouter.put("/:id", isAuthenticated, validatePutCategory, CategoryController.updateOne, CategoryController.findOneById);

categoryRouter.delete("/:id", isAuthenticated, validateRemoveCategory, CategoryController.deleteOne);

module.exports = categoryRouter;
