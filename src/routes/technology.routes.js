const technologyRouter = require("express").Router();
const { TechnologyController, ImagesController } = require("../controllers");
const { validatePostTechnology, removePrevImage, validatePutTechnology } = require("../middleware/Technology");

technologyRouter.get("/", TechnologyController.findAll);
technologyRouter.get("/:id", TechnologyController.findOneById);

technologyRouter.post("/", ImagesController.uploadFile, validatePostTechnology, TechnologyController.createOne, TechnologyController.findOneById);

technologyRouter.put(
  "/:id",
  ImagesController.uploadFile,
  validatePutTechnology,
  removePrevImage,
  TechnologyController.updateOne,
  TechnologyController.findOneById,
);

technologyRouter.delete("/:id", removePrevImage, TechnologyController.deleteOne);

module.exports = technologyRouter;
