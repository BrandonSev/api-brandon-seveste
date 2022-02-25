const { Category } = require("../../models");

const validatePostCategory = async (req, res, next) => {
  const { title } = req.body;
  if (!title) return res.status(422).send();
  const [category] = await Category.findOneByTitle(title);
  if (category.length) return res.status(422).send({ message: "Une catégorie existe déjà sous ce nom" });
  req.categoryInformation = { title };
  return next();
};

const validatePutCategory = async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) return res.status(422).send();
  const [category] = await Category.findOneById(id);
  if (!category.length) return res.status(404).send({ message: "Aucune catégorie n'a été trouvée" });
  req.categoryInformation = { title };
  return next();
};

module.exports = { validatePostCategory, validatePutCategory };
