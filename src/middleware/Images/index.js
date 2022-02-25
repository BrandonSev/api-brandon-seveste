const fs = require("fs");
const path = require("path");
const { Images } = require("../../models");
const { breakpointList } = require("../../controllers/images.controllers");

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

module.exports = { validatePutImages, deletePrevImage };
