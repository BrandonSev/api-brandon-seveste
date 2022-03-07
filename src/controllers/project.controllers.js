const { Project, Images } = require("../models");

/**
 * Middleware qui permet de récuperer tout les projets
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findAll = async (req, res) => {
  const { active } = req.query;
  if (active) {
    try {
      const [projects] = await Project.findAllActive();
      const arr = [];
      await Promise.all(
        projects.map(async (project, index) => {
          arr.push(project);
          const [images] = await Images.findImagesByProjectId(project.id);
          arr[index] = { ...arr[index], images };
        }),
      );
      return res.status(200).send(arr);
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }
  try {
    const [results] = await Project.findAll();
    const arr = [];
    await Promise.all(
      results.map(async (project, index) => {
        arr.push(project);
        const [images] = await Images.findImagesByProjectId(project.id);
        arr[index] = { ...arr[index], images };
      }),
    );
    return res.status(200).send(arr);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de récupérer un projet
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findOneById = async (req, res) => {
  const id = req.params.id ? req.params.id : req.id;
  const statusCode = req.method === "POST" ? 201 : 200;
  if (!id || !Number(id)) return res.status(400).json({ message: "Vous devez fournir un id valide" });
  try {
    const [results] = await Project.findOneById(id);
    if (results.length === 0) return res.status(404).send();
    const [images] = await Images.findImagesByProjectId(id);
    return res.status(statusCode).json({ ...results[0], images });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de créer un projet
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createOne = async (req, res, next) => {
  try {
    const [result] = await Project.createOne(req.projectInformation);
    req.id = result.insertId;
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de mettre à jour un projet
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Project.updateOne(req.projectInformation, id);
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de supprimer un projet
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await Project.deleteOne(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = { findAll, findOneById, createOne, updateOne, deleteOne };
