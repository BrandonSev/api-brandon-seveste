const { UnderCategory } = require("../models");

/**
 * Middleware qui permet de récuperer toutes les sous-catégories
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findAll = async (req, res) => {
  try {
    const [results] = await UnderCategory.findAll();
    return res.status(200).send(results);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de récuperer une sous-catégorie
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findOneById = async (req, res) => {
  const id = req.params.id ? req.params.id : req.id;
  const statusCode = req.method === "POST" ? 201 : 200;
  if (!id || !Number(id)) return res.status(400).json({ message: "Vous devez fournir un id valide" });
  try {
    const [results] = await UnderCategory.findOneById(id);
    if (results.length === 0) return res.status(404).send();
    return res.status(statusCode).json({ ...results[0] });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de créer une sous-catégorie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createOne = async (req, res, next) => {
  try {
    const [result] = await UnderCategory.createOne(req.underCategoryInformation);
    req.id = result.insertId;
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de mettre à jour une sous-catégorie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    await UnderCategory.updateOne(req.underCategoryInformation, id);
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de supprimer une sous-catégorie
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await UnderCategory.deleteOne(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = { findAll, findOneById, createOne, updateOne, deleteOne };
