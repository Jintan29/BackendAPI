const express = require("express");
const { Client } = require("pg");
const { Sequelize, DataTypes } = require("sequelize") // ORM
const bodyParser = require("body-parser"); //แปลง req.body ให้อ่านค่าได้
const cors = require("cors");
const db = require("./src/models"); // ดึงค่าการต่อ DB จาก Models

const app = express();
app.use(bodyParser.json()); // read json body

app.use(cors({
  origin: ["http://localhost:3000", "https://localhost:5500"],
  credentials: true, // necessary for cookies, authorization headers, etc.
}))


//connect DB new 

// *เชื่อม code กับ DB*
db.sequelize.sync()
  .then(() => {
    console.log("Drop and re-sync db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// *force เอาไว้ใช้ตอนสร้าง table ใหม่แล้วบังคบให้มัน update (ข้อมูลจะหาย)

//db.sequelize.sync({force: true})

// Schema ของเก่า เอาไว้ดูตอนโยง Relation
// const Employee = sequelize.define('employees',{
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email:{
//     type: DataTypes.STRING,
//     allowNull: false,
//   }
// },{})

// const Address = sequelize.define('address', {
//   address1: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   employeeId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Employee, // ชื่อโมเดลที่ต้องการเชื่อม
//       key: 'id' // คีย์ในโมเดลที่ต้องการเชื่อม
//     }
//   }
// }, {});


// Employee.hasMany(Address)  // โยง relations
// Address.belongsTo(Employee)




app.get('/',(req,res)=>{
  res.json({message: 'Server is running'})  
})

// เรียกใช้งาน user router
require('./src/routes/user.routes')(app);

app.listen(8080,async () => {
  console.log("Start sever at Port 8080");
});




