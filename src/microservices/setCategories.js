const { Category } = require("../models/index");

const categories = [
  "Bendición",
  "Adoración",
  "Petición",
  "Intercesión",
  "Agradecimiento",
  "Alabanza",
];

function setCategories() {
  categories.map(async (c) => {
    await Category.findOrCreate({ where: { name: c } });
  });
}

module.exports = setCategories;