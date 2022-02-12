const multer = require("multer");
const { Images } = require("../models");

const findAll = async (req, res) => {
  try {
    const [results] = await Images.findAll();
    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const findOneById = async (req, res) => {
  const id = req.params.id ? req.params.id : req.id || req.body.project_id;
  const statusCode = req.method === "POST" ? 201 : 200;

  try {
    const [result] = await Images.findOneById(id);
    if (!result.length) {
      res.status(404).send();
    } else {
      res.status(statusCode).json(result);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const create = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  req.files.map(async (file) => {
    try {
      return await Images.createOne({
        src: file.filename,
        alt: file.originalname.split(".")[0],
        project_id: req.id || req.body.project_id,
      });
    } catch (e) {
      return res.status(500).send(e.message);
    }
  });
  return next();
};
const createOne = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  try {
    const [image] = await Images.createOne({
      src: req.files[0].filename,
      alt: req.files[0].originalname.split(".")[0],
      project_id: req.id || req.body.project_id,
    });
    req.id = image.insertId;
  } catch (e) {
    return res.status(500).send(e.message);
  }
  return next();
};

const uploadFile = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "public/images");
    },
    filename: (_, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const fileFilter = (request, file, cb) => {
    const typeArray = file.mimetype.split("/");
    const fileType = typeArray[1];
    if (fileType === "jpg" || fileType === "png" || fileType === "jpeg" || fileType === "svg+xml") {
      return cb(null, true);
    }
    return res.status(422).send({ message: "Seulement les formats, jpg / png / jpeg / svg sont autorisés" });
  };
  const upload = multer({
    storage,
    fileFilter,
  }).array("images", 10);

  return upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (req.files !== undefined) {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
    }
    return next();
  });
};

const removeOneById = async (req, res) => {
  try {
    const { id } = req.params;
    const [image] = await Images.deleteOne(id);
    if (image.affectedRows > 0) return res.status(204).send();
    return res.status(404).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [image] = await Images.updateOne(req.imageInformation, id);
    if (image.affectedRows > 0) {
      return next();
    }
    return res.status(404).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = {
  findAll,
  findOneById,
  create,
  createOne,
  uploadFile,
  removeOneById,
  updateOne,
};
