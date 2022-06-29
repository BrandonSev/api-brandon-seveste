const { Technology } = require("../models");

/**
 * Middleware qui permet de récuperer toutes les technologies
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findAll = async (req, res) => {
  try {
    const [technology] = await Technology.findAll();
    let results = [];
    technology.forEach((tech, i) => {
      results = [
        ...results,
        {
          ...tech,
          category: { title: technology[i].category },
          under_category: { title: technology[i].under_category },
        },
      ];
    });
    return res.status(200).send(results);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de récuperer une technologie
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findOneById = async (req, res) => {
  const id = req.params.id ? req.params.id : req.id;
  const statusCode = req.method === "POST" ? 201 : 200;
  if (!id || !Number(id)) return res.status(400).json({ message: "Vous devez fournir un id valide" });
  try {
    const [results] = await Technology.findOneById(id);
    if (!results.length) return res.status(404).send();
    // recuperer ici les sous catégorie associés
    return res.status(statusCode).json({ ...results[0] });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de créer une technologie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createOne = async (req, res, next) => {
  try {
    const [result] = await Technology.createOne(req.technologyInformation);
    req.id = result.insertId;
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de modifier une technologie
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Technology.updateOne(req.technologyInformation, id);
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de supprimer une technologie
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await Technology.deleteOne(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = { findAll, findOneById, createOne, updateOne, deleteOne };
