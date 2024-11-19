const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const { setupSwagger } = require("./config/swagger");
const path = require("path");

app.use(cors());
app.use(morgan("dev"));
app.use(helmet(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })));
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Set up swagger
setupSwagger(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

require("./database/init.mongodb");
app.use("/v1/api", require("./routers/index"));

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 501;
  return res.status(status).json({
    status: "error",
    code: status,
    stack: err.stack,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
