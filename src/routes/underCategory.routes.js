const underCategoryRouter = require("express").Router();
const { UnderCategoryController } = require("../controllers");
const { validatePostUnderCategory, validatePutUnderCategory, validateRemoveUnderCategory } = require("../middleware/UnderCategory");

underCategoryRouter.get("/", UnderCategoryController.findAll);
underCategoryRouter.get("/:id", UnderCategoryController.findOneById);

underCategoryRouter.post("/", validatePostUnderCategory, UnderCategoryController.createOne, UnderCategoryController.findOneById);
underCategoryRouter.put("/:id", validatePutUnderCategory, UnderCategoryController.updateOne, UnderCategoryController.findOneById);

underCategoryRouter.delete("/:id", validateRemoveUnderCategory, UnderCategoryController.deleteOne);

module.exports = underCategoryRouter;
