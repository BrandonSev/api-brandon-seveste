const fs = require("fs");
const path = require("path");
const { Technology } = require("../../models");

const validatePostTechnology = (req, res, next) => {
  const { title, category_id, under_category_id } = req.body;
  const [file] = req.files;
  if (!title && !category_id && !file && !under_category_id) return res.status(422).send();
  req.technologyInformation = { name: title, category_id, logo: file.filename, under_category_id };
  return next();
};

const removePrevImage = async (req, res, next) => {
  if (req.method === "PUT") {
    if (!req.files.length) return next();
  }
  try {
    const [technology] = await Technology.findOneById(req.params.id);
    if (!technology.length) return next();
    // eslint-disable-next-line consistent-return
    fs.unlink(path.join(__dirname, `../../../public/images/${technology[0].logo}`), (err) => {
      if (err) return res.status(500).send();
    });
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const validatePutTechnology = (req, res, next) => {
  const { title, category_id, under_category_id } = req.body;
  const [file] = req.files;
  if (!title || !category_id || !under_category_id) return res.status(422).send(title);
  req.technologyInformation = { name: title, category_id, under_category_id };
  if (file) req.technologyInformation = { ...req.technologyInformation, logo: file.filename };
  return next();
};

module.exports = { validatePostTechnology, removePrevImage, validatePutTechnology };
