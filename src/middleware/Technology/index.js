const fs = require("fs");
const path = require("path");
const { Technology } = require("../../models");
const { createImage } = require("../../controllers/images.controllers");

/**
 * Middleware qui permet de vérifier la création d'une technologie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const validatePostTechnology = async (req, res, next) => {
  const { title, category_id, under_category_id } = req.body;
  const [file] = req.files;
  if (!title && !category_id && !file && !under_category_id) return res.status(422).send();
  const image = await createImage(file, "webp");
  req.technologyInformation = { name: title, category_id, under_category_id, logo: image };
  return next();
};

/**
 * Middleware qui permet de supprimer une seule image d'une technologie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const removePrevTechnologyImage = async (req, res, next) => {
  if (req.method === "PUT") {
    if (!req.files.length) return next();
  }
  try {
    // eslint-disable-next-line consistent-return
    fs.unlink(path.join(__dirname, `../../../public/images/${req.technologyInformation.technology[0].logo}`), (err) => {
      if (err) return res.status(500).send();
    });
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de vérifier la modification d'une technologie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const validatePutTechnology = async (req, res, next) => {
  const { title, category_id, under_category_id } = req.body;
  const [file] = req.files;
  const [technology] = await Technology.findOneById(req.params.id);
  if (!technology.length) return res.status(404).send();
  req.technologyInformation = { name: title, category_id, under_category_id };
  if (file) {
    const image = await createImage(file, "webp");
    req.technologyInformation = { ...req.technologyInformation, logo: image, technology };
  }
  return next();
};

/**
 * Middleware qui permet de vérifier la suppression d'une technologie
 * @param req
 * @param res
 * @param next
 */
const validateRemoveTechnology = async (req, res, next) => {
  const { id } = req.params;
  const [technology] = await Technology.findOneById(id);
  if (!technology.length) return res.status(404).send();
  // Envoie de la technologie trouvée dans la requête pour permettre la suppresion de l'image en local via le nom de l'image en BDD
  req.technologyInformation = { technology };
  return next();
};

module.exports = { validatePostTechnology, removePrevTechnologyImage, validatePutTechnology, validateRemoveTechnology };
