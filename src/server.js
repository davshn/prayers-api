const express = require("express");

const routes = require("./routes/index.js");
const { generalErrorHandler, error404 } = require("./middlewares/errors");
const { cors } = require("./middlewares/cors");

const server = express();

//Middlewares
server.name = "API";
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json({ limit: "50mb" }));
server.use(cors);

server.use("/", routes);

// Error handlers.
server.use(error404);
server.use(generalErrorHandler);

module.exports = server;
