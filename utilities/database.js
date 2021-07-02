const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("shopito", "root", "25251818amin", {
  host: "localhost",
  dialect: "mysql",
});

const connectToDatabse = async () => {
  try {
    sequelize.authenticate();
    console.log("Connected to database successfully");
  } catch (error) {
    console.log("Error connecting to server", error);
  }
};

module.exports = {
  sequelize,
  connectToDatabse,
};
