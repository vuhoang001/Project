const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API project",
      version: "1.0.0",
      description: "Documentation for API",
    },
    server: [
      {
        url: process.env.URL_SERVER,
      },
    ],
    components: {
      securitySchemes: {
        AccessToken: {
          type: "http",
          schema: "bearer",
          bearerFormat: "JWT",
        },
        RefreshToken: {
          type: "apiKey",
          in: "header",
          name: "x-rtoken-id",
          description: "Client id for authentication",
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routers/*.route.js")],
};

const specs = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );
};

module.exports = {
  setupSwagger,
};
