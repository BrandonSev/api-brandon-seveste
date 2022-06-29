const underCategoryRouter = require("express").Router();
const { UnderCategoryController } = require("../controllers");
const { isAuthenticated } = require("../controllers/auth.controllers");
const { validatePostUnderCategory, validatePutUnderCategory, validateRemoveUnderCategory } = require("../middleware/UnderCategory");

underCategoryRouter.get("/", UnderCategoryController.findAll);
underCategoryRouter.get("/:id", UnderCategoryController.findOneById);

underCategoryRouter.post("/", isAuthenticated, validatePostUnderCategory, UnderCategoryController.createOne, UnderCategoryController.findOneById);
underCategoryRouter.put("/:id", isAuthenticated, validatePutUnderCategory, UnderCategoryController.updateOne, UnderCategoryController.findOneById);

underCategoryRouter.delete("/:id", isAuthenticated, validateRemoveUnderCategory, UnderCategoryController.deleteOne);

module.exports = underCategoryRouter;
