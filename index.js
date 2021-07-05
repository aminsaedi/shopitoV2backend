const express = require("express");
const { connectToDatabse, sequelize } = require("./utilities/database");

const app = express();

require("./utilities/routes")(app);
connectToDatabse();

// sequelize.sync({ force: true });

app.listen(3000, () => console.log(`server started`));
