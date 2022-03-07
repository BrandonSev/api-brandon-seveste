const imagesRouter = require("express").Router();
const { ImagesController } = require("../controllers");
const { validatePutImages, deletePrevImage, validatePostImages, validateRemoveImages } = require("../middleware/Images");

imagesRouter.get("/", ImagesController.findAll);
imagesRouter.get("/:id", ImagesController.findOneById);

imagesRouter.post("/", ImagesController.uploadFile, validatePostImages, ImagesController.createOne, ImagesController.findOneById);
imagesRouter.put("/:id", ImagesController.uploadFile, validatePutImages, deletePrevImage, ImagesController.updateOne, ImagesController.findOneById);

imagesRouter.delete("/:id", validateRemoveImages, deletePrevImage, ImagesController.removeOneById);

module.exports = imagesRouter;
