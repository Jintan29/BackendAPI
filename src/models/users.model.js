module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("user", {
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role:{
        type: Sequelize.STRING,
        defaultValue: "user"
      },
      isactive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }

    });

 

    return User;

  };