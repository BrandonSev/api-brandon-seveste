const technologyRouter = require("express").Router();
const { TechnologyController, ImagesController } = require("../controllers");
const { isAuthenticated } = require("../controllers/auth.controllers");
const { validatePostTechnology, removePrevTechnologyImage, validatePutTechnology, validateRemoveTechnology } = require("../middleware/Technology");

technologyRouter.get("/", TechnologyController.findAll);
technologyRouter.get("/:id", TechnologyController.findOneById);

technologyRouter.post(
  "/",
  isAuthenticated,
  ImagesController.uploadFile,
  validatePostTechnology,
  TechnologyController.createOne,
  TechnologyController.findOneById,
);

technologyRouter.put(
  "/:id",
  isAuthenticated,
  ImagesController.uploadFile,
  validatePutTechnology,
  removePrevTechnologyImage,
  TechnologyController.updateOne,
  TechnologyController.findOneById,
);

technologyRouter.delete("/:id", isAuthenticated, validateRemoveTechnology, removePrevTechnologyImage, TechnologyController.deleteOne);

module.exports = technologyRouter;
