const { Category } = require("../../models");

/**
 * Middleware qui permet de vérifier la création d'une catégorie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const validatePostCategory = async (req, res, next) => {
  const { title } = req.body;
  if (!title) return res.status(422).send();
  const [category] = await Category.findOneByTitle(title);
  if (category.length) return res.status(422).send({ message: "Une catégorie existe déjà sous ce nom" });
  req.categoryInformation = { title };
  return next();
};

/**
 * Middleware qui permet de vérifier la modification d'une catégorie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const validatePutCategory = async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  const [category] = await Category.findOneById(id);
  if (!category.length) return res.status(404).send();
  req.categoryInformation = { title };
  return next();
};

/**
 * Middleware qui permet de vérifier la suppression d'une catégorie
 * @param req
 * @param res
 * @param next
 */
const validateRemoveCategory = async (req, res, next) => {
  const { id } = req.params;
  const [category] = await Category.findOneById(id);
  if (!category.length) return res.status(404).send();
  return next();
};

module.exports = { validatePostCategory, validatePutCategory, validateRemoveCategory };
