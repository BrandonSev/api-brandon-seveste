const { UnderCategory } = require("../../models");

/**
 * Middleware qui permet de vérifier la création d'une sous-catégorie
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const validatePostUnderCategory = (req, res, next) => {
  const { title, category_id } = req.body;
  if (!title && !category_id) return res.status(422).send();
  req.underCategoryInformation = { title, category_id };
  return next();
};

/**
 * Middleware qui permet de vérifier la modification d'une sous-catégorie
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const validatePutUnderCategory = (req, res, next) => {
  const { title, category_id } = req.body;
  if (!title || !category_id) return res.status(422).send();
  const underCategoryInformation = {};
  if (title) underCategoryInformation.title = title;
  if (category_id) underCategoryInformation.category_id = category_id;
  req.underCategoryInformation = underCategoryInformation;
  return next();
};

/**
 * Middleware qui permet de vérifier la suppression d'une sous-catégorie
 * @param req
 * @param res
 * @param next
 */
const validateRemoveUnderCategory = async (req, res, next) => {
  const { id } = req.params;
  const underCategory = await UnderCategory.findOneById(id);
  if (!underCategory.length) return res.status(404).send();
  return next();
};

module.exports = { validatePostUnderCategory, validatePutUnderCategory, validateRemoveUnderCategory };
