"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });

if (db.users && db.merchants) {
  db.users.hasOne(db.merchants, {
    foreignKey: "user_id",
    as: "merchantDetails",
  });
  db.merchants.belongsTo(db.users, { foreignKey: "user_id", as: "user" });
}

if (db.categories && db.conciergerequest) {
  db.categories.hasMany(db.conciergerequest, {
    foreignKey: "category_id",
    as: "conciergeRequests",
  });

  db.conciergerequest.belongsTo(db.categories, {
    foreignKey: "category_id",
    as: "category",
  });
}

if (db.users && db.subscriptions) {
  db.users.hasMany(db.subscriptions, {
    foreignKey: "user_id",
    as: "subscriptionss",
  });

  db.subscriptions.belongsTo(db.users, {
    foreignKey: "user_id",
    as: "user",
  });
}

if (db.users && db.offers) {
  db.users.hasMany(db.offers, {
    foreignKey: "user_id",
    as: "offer",
  });

  db.offers.belongsTo(db.users, {
    foreignKey: "user_id",
    as: "user",
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
