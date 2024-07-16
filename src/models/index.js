const dbConfig = require("../../configs/db.config.js"); // ดึงค่าที่ต่อ DB เอามาใช้

const Sequelize = require("sequelize"); //ตัวแทน ORM

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }

});

const db = {};
 
db.Sequelize = Sequelize;

db.sequelize = sequelize;

// table
db.users = require("./users.model.js")(sequelize, Sequelize); //ส่ง connDB + ORM เข้าไปที่ model user

 

module.exports = db;