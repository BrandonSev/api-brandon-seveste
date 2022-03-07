const { Category, UnderCategory, Technology } = require("../models");

/**
 * Middleware qui permet de récuperer toutes les catégories
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findAll = async (req, res) => {
  try {
    const [categories] = await Category.findAll();
    if (req.query.under_category) {
      const [underCategorie] = await UnderCategory.findCategories(req.query.under_category);
      return res.status(200).send(underCategorie);
    }
    if (req.query.underCategories && req.query.technologies) {
      const arr = [];
      const results = await Promise.all(
        categories.map((category) => {
          arr.push(category);
          return UnderCategory.findCategories(category.id);
        }),
      );
      results.forEach((underCategorie, index) => {
        arr[index] = { ...arr[index], underCategories: underCategorie[0] };
      });
      const test = await Promise.all(
        arr.map(async (categorie) => {
          const technologies = await Promise.all(
            categorie.underCategories.map((underCategory) => {
              return Technology.findUnderCategories(underCategory.id);
            }),
          );
          return {
            ...categorie,
            underCategories: categorie.underCategories.map((underCategories, i) => {
              return { ...underCategories, technologies: technologies[i][0] };
            }),
          };
        }),
      );
      return res.status(200).send(test);
    }
    return res.send(categories);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de récuperer une catégorie
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findOneById = async (req, res) => {
  const id = req.params.id ? req.params.id : req.id;
  const statusCode = req.method === "POST" ? 201 : 200;
  if (!id || !Number(id)) return res.status(400).json({ message: "Vous devez fournir un id valide" });
  try {
    const [results] = await Category.findOneById(id);
    if (results.length === 0) return res.status(404).send();
    // recuperer ici les sous catégorie associés
    return res.status(statusCode).json({ ...results[0], images: {} });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de créer une catégorie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createOne = async (req, res, next) => {
  try {
    const [result] = await Category.createOne(req.categoryInformation);
    req.id = result.insertId;
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de mettre à jour une catégorie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Category.updateOne(req.categoryInformation, id);
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de supprimer une catégorie
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.deleteOne(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = { findAll, findOneById, createOne, updateOne, deleteOne };
