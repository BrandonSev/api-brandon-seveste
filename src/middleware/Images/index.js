const fs = require("fs");
const path = require("path");
const { Images } = require("../../models");

const validatePutImages = (req, res, next) => {
  const { project_id } = req.body;
  const imageInformation = {};
  if (req.files[0]) {
    imageInformation.src = req.files[0].filename;
  }
  if (project_id) {
    imageInformation.project_id = project_id;
  }
  req.imageInformation = imageInformation;
  return next();
};

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

module.exports = { validatePutImages, deletePrevImage };
