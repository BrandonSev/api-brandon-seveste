const multer = require("multer");
const sharp = require("sharp");
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
      const imageSrc = `${new Date().getTime()}-${file.originalname.split(".")[0]}.webp`;
      await sharp(file.buffer).webp({ quality: 70 }).toFile(`public/images/${imageSrc}`);
      return await Images.createOne({
        src: imageSrc,
        alt: file.originalname.split(".")[0],
        project_id: req.id || req.body.project_id,
      });
    } catch (e) {
      return res.status(500).send(e.message);
    }
  });
  return next();
};

/**
 * @param {string} imageSrc
 * @param {Buffer} image
 * @param {string} extension
 * @returns {Promise<Object>}
 */
const createResponsiveImages = async (image, imageSrc, extension) => {
  const breakpointList = [
    {
      break: "sm",
      width: 360,
    },
    {
      break: "md",
      width: 768,
    },
    {
      break: "xl",
      width: 1024,
    },
  ];
  try {
    return breakpointList.map(async (breakpoint) => {
      await sharp(image)
        .resize({ width: breakpoint.width })
        .webp({ quality: 70 })
        .toFile(`public/images/${imageSrc.split(".")[0]}-${breakpoint.break}.${extension}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    return console.log(e.message);
  }
};

const createOne = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  try {
    const imageSrc = `${new Date().getTime()}-${req.files[0].originalname.split(".")[0]}.webp`;
    await createResponsiveImages(req.files[0].buffer, imageSrc, "webp");
    await sharp(req.files[0].buffer).webp({ quality: 70 }).toFile(`public/images/${imageSrc}`);
    const [image] = await Images.createOne({
      src: imageSrc,
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
  const storage = multer.memoryStorage();
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
