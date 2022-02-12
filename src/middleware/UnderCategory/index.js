const validatePostUnderCategory = (req, res, next) => {
  const { title, category_id } = req.body;
  if (!title && !category_id) return res.status(422).send();
  req.underCategoryInformation = { title, category_id };
  return next();
};
const validatePutUnderCategory = (req, res, next) => {
  const { title, category_id } = req.body;
  req.underCategoryInformation = { title, category_id };
  return next();
};
module.exports = { validatePostUnderCategory, validatePutUnderCategory };
