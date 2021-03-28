const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// swagger definition
var swaggerDefinition = {
  info: {
    title: "API Mecânica",
    version: "1.0.0",
    description: "Uma API para a sua oficina mecânica",
  },
  host: "localhost:3333",
  basePath: "/",
  servers: [
    {
      url: "http://localhost:3333",
    },
  ],
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["./controllers/*.js"],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJsdoc(options);

// serve swagger

//Middlewares
const response = require("./middlewares/response");

//Controllers
const usuario = require("./controllers/User");
const regra = require("./controllers/Role");
const recurso = require("./controllers/Resource");
const vinculo = require("./controllers/Link");
const auth = require("./controllers/Auth");
const fabricante = require("./controllers/Brand");
const categoria = require("./controllers/Category");
const produto = require("./controllers/Product");
const modelo = require("./controllers/Model");
const servicoMecanico = require("./controllers/MechanicalService");
const orcamento = require("./controllers/Budget");
const agenda = require("./controllers/Schedule");
const ordemServico = require("./controllers/ServiceOrder");

//Middlewares
app.use(cors());
app.use(helmet());
app.use(response);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Controllers
app.use(auth);
app.use("/usuario", usuario);
app.use("/regra", regra);
app.use("/recurso", recurso);
app.use("/vinculo", vinculo);
app.use("/fabricante", fabricante);
app.use("/categoria", categoria);
app.use("/produto", produto);
app.use("/modelo-veiculo", modelo);
app.use("/servico-mecanico", servicoMecanico);
app.use("/orcamento", orcamento);
app.use("/agenda", agenda);
app.use("/ordem-servico", ordemServico);
app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.code || 500).json({
      status: "error",
      message: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message,
  });
});

app.listen(3333);
