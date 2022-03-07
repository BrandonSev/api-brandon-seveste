const technologyRouter = require("express").Router();
const { TechnologyController, ImagesController } = require("../controllers");
const { validatePostTechnology, removePrevTechnologyImage, validatePutTechnology, validateRemoveTechnology } = require("../middleware/Technology");

technologyRouter.get("/", TechnologyController.findAll);
technologyRouter.get("/:id", TechnologyController.findOneById);

technologyRouter.post("/", ImagesController.uploadFile, validatePostTechnology, TechnologyController.createOne, TechnologyController.findOneById);

technologyRouter.put(
  "/:id",
  ImagesController.uploadFile,
  validatePutTechnology,
  removePrevTechnologyImage,
  TechnologyController.updateOne,
  TechnologyController.findOneById,
);

technologyRouter.delete("/:id", validateRemoveTechnology, removePrevTechnologyImage, TechnologyController.deleteOne);

module.exports = technologyRouter;
