const multer = require("multer");
const sharp = require("sharp");
const { Images } = require("../models");

/**
 * Liste l'ensemble des breakpoints pour definir les différents formats d'images
 * @type {[{break: string, width: number},{break: string, width: number},{break: string, width: number}]}
 */
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

/**
 * Middleware qui permet de récupérer l'ensemble des images de la BDD
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const findAll = async (req, res) => {
  try {
    const [results] = await Images.findAll();
    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de recupérer une image
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const findOneById = async (req, res) => {
  const id = req.params.id ? req.params.id : req.id;
  const statusCode = req.method === "POST" ? 201 : 200;

  try {
    const [result] = await Images.findOneById(id);
    if (!result.length) return res.status(404).send();
    return res.status(statusCode).json(result);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/**
 * Fonction qui permet de créer différentes tailles d'images à partir d'une image originale
 * @param {string} imageSrc
 * @param {Buffer} image
 * @param {string} extension
 * @returns {Promise<Object>}
 */
const createResponsiveImages = async (image, imageSrc, extension) => {
  try {
    return breakpointList.map(async (breakpoint) => {
      await sharp(image)
        .resize(breakpoint.width)
        .webp({ quality: 70 })
        .toFile(`public/images/${imageSrc.split(".")[0]}-${breakpoint.break}.${extension}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    return console.log(e.message);
  }
};

/**
 * Fonction qui permet de créer une image dans le dossier local
 * @param file
 * @param {String} extension
 * @return {Promise<String>} Retourne le nom de l'image crée
 */
const createImage = async (file, extension) => {
  const imageSrc = `${new Date().getTime()}-${file.originalname.split(".")[0]}.${extension}`;
  await sharp(file.buffer).webp({ quality: 70 }).toFile(`public/images/${imageSrc}`);
  return imageSrc;
};

/**
 * Middleware qui permet de créer plusieurs images responsive en BDD
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createResponsiveSize = async (req, res, next) => {
  req.files.map(async (file) => {
    try {
      const imageSrc = await createImage(file, "webp");
      await createResponsiveImages(file.buffer, imageSrc, "webp");
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
 * Middleware qui permet de créer plusieurs images (formater en .webp) en BDD
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createMultiple = async (req, res, next) => {
  const [images] = await req.files.map(async (file) => {
    try {
      const imageSrc = await createImage(file, "webp");
      const [imageCreated] = await Images.createOne({
        src: imageSrc,
        alt: file.originalname.split(".")[0],
        project_id: req.id || req.body.project_id,
      });
      const [image] = await Images.findOneById(imageCreated.insertId);
      return image;
    } catch (e) {
      return res.status(500).send(e.message);
    }
  });
  req.images = await images;
  return next();
};

/**
 * Middleware qui permet de créer une image
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createOne = async (req, res, next) => {
  try {
    const [image] = await Images.createOne(req.imageInformation);
    req.id = image.insertId;
    return next();
  } catch (e) {
    return res.status(500).send();
  }
};

/**
 * Middleware qui permet de gérer les fichiers envoyés dans la requète
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
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
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    return next();
  });
};

/**
 * Fonction qui permet de supprimer une image
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const removeOneById = async (req, res) => {
  try {
    const { id } = req.params;
    const [image] = await Images.deleteOne(id);
    if (image.affectedRows > 0) {
      return res.status(204).send();
    }
    return res.status(404).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

/**
 * Middleware qui permet de mettre à jour les informations d'une image
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Images.updateOne(req.imageInformation, id);
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = {
  findAll,
  findOneById,
  createResponsiveSize,
  createOne,
  createMultiple,
  uploadFile,
  removeOneById,
  updateOne,
  breakpointList,
  createImage,
};
