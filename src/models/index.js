const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const { DB_URI, } = process.env;
const basename = path.basename(__filename);
const modelDefiners = [];
const config = {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
};

const sequelize = new Sequelize(DB_URI, config);


// Reading all models from files
fs.readdirSync(path.join(__dirname, './'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, './', file)));
  });

// Inject models to sequelize
modelDefiners.forEach(model => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// Creating relationships between tables
const { Prayer, User, Category,Comment } = sequelize.models;

// Relationships

// Relations N:M
User.hasMany(Prayer);
Prayer.belongsTo(User);

Category.hasMany(Prayer);
Prayer.belongsTo(Category);

User.hasMany(Comment);
Comment.belongsTo(User);

Prayer.hasMany(Comment);
Comment.belongsTo(Prayer);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conection: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
