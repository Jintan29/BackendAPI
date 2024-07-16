const db = require("../models");
const User = db.users;
// const Op = db.Sequelize.Op;

//reg+login
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "empowerhouse"; //เอาไว้ใช้ตอนGen token

// Create and Save a new User
exports.register = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a User

  //hash password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: hashedPassword,
    isactive: req.body.isactive ? req.body.isactive : false,
  };

  // Save User in the database
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Login

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // ตรวจสอบรหัสที่ login เข้ามา และออก token
  User.findOne({
    where: { email: email },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ id: user.id,name:user.name ,role:'admin'}, secret, { expiresIn: "24h" });
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  });
};

// find all user [*Need token]
exports.findAll = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    // get token from header
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1]; // แยกข้อมูลเอาแต่ token ออกมา
    } else if (!authHeader) {
      throw new Error("Invalid authorization");
    }

    //verify auth token
    const user = jwt.verify(authToken, secret);
    console.log(user);

    User.findAll()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving users.",
        });
      });
  } catch {}
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)

    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: `Cannot find User with id=${id}.` });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request

exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all User from the database.

exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

// Find all iseactive User

exports.findAllIsactive = (req, res) => {
  User.findAll({ where: { isactive: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
