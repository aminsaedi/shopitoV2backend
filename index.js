const express = require("express");
const { connectToDatabse, sequelize } = require("./utilities/database");
const InStoreCustomers = require("./models/inStoreCustomers");

const app = express();

require("./utilities/routes")(app);
connectToDatabse();

// sequelize.sync({ alter: true });
// sequelize.sync();

app.listen(3000, () => console.log(`server started`));
