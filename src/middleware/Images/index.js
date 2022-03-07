const fs = require("fs");
const path = require("path");
const { Images } = require("../../models");
const { breakpointList, createImage } = require("../../controllers/images.controllers");

/**
 * Middleware qui permet de vérifier la modification d'une image
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const validatePutImages = async (req, res, next) => {
  const { project_id } = req.body;
  const imageInformation = {};
  if (req.files[0]) {
    imageInformation.src = await createImage(req.files[0], "webp");
  }
  if (project_id) {
    imageInformation.project_id = parseInt(project_id, 10);
  }
  req.imageInformation = imageInformation;
  return next();
};

/**
 * Middleware qui permet de supprimer une ancienne image en local
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const deletePrevImage = async (req, res, next) => {
  if (req.method === "PUT") {
    if (!req.files.length) return next();
  }
  try {
    const [[image]] = await Images.findOneById(req.params.id);
    if (!image) return res.status(404).send();
    return fs.unlink(path.join(__dirname, `../../../public/images/${image.src}`), (err) => {
      if (err) return res.status(500).send();
      return next();
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de supprimer les images responsive en local
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
const deletePrevResponsiveImage = async (req, res, next) => {
  if (req.method === "PUT") {
    if (!req.files.length) return next();
  }
  try {
    const [[image]] = await Images.findOneById(req.params.id);
    if (!image) return res.status(404).send();
    return fs.unlink(path.join(__dirname, `../../../public/images/${image.src}`), (err) => {
      if (err) return res.status(500).send();
      breakpointList.forEach((breakpoint) => {
        // eslint-disable-next-line consistent-return
        fs.unlink(
          path.join(__dirname, `../../../public/images/${image.src.split(".")[0]}-${breakpoint.break}.${image.src.split(".")[1]}`),
          // eslint-disable-next-line consistent-return
          (err2) => {
            if (err2) return res.status(500).send();
          },
        );
      });
      return next();
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de vérifier la création d'une image
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const validatePostImages = async (req, res, next) => {
  const { project_id } = req.body;
  const file = req.files[0];
  if (!project_id || !file) {
    return res.status(422).send();
  }
  const image = await createImage(file, "webp");
  req.imageInformation = { project_id: parseInt(project_id, 10), src: image, alt: file.originalname.split(".")[0] };
  return next();
};

/**
 * Middleware qui permet de vérifier la suppression d'une image
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const validateRemoveImages = async (req, res, next) => {
  const { id } = req.params;
  const [image] = await Images.findOneById(id);
  if (!image.length) return res.status(404).send();
  return next();
};

module.exports = { validatePutImages, deletePrevResponsiveImage, deletePrevImage, validatePostImages, validateRemoveImages };
