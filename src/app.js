const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const { setupSwagger } = require("./config/swagger");

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Set up swagger
setupSwagger(app);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

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
