const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const app = express();

//define error handler/not found
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

//enable cors for all routes, parse data into JSON
app.use(cors());
app.use(express.json());

//define router
const reservationsRouter = require("./reservations/reservations.router");

//point routes to routers
app.use("/reservations", reservationsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
