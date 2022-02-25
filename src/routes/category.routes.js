const categoryRouter = require("express").Router();
const { CategoryController } = require("../controllers");
const { validatePostCategory, validatePutCategory } = require("../middleware/Category");

categoryRouter.get("/", CategoryController.findAll);
categoryRouter.get("/:id", CategoryController.findOneById);

categoryRouter.post("/", validatePostCategory, CategoryController.createOne, CategoryController.findOneById);
categoryRouter.put("/:id", validatePutCategory, CategoryController.updateOne, CategoryController.findOneById);

categoryRouter.delete("/:id", CategoryController.deleteOne);

module.exports = categoryRouter;
