const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//Middlewares
const response = require("./middlewares/response");

//Controllers
const usuario = require("./controllers/User");
const regra = require("./controllers/Role");
const vinculo = require("./controllers/Link");
const auth = require("./controllers/Auth");
const fabricante = require("./controllers/Brand");
const categoria = require("./controllers/Category");
const produto = require("./controllers/Product");
const servicoMecanico = require("./controllers/MechanicalService");

app.use(cors());
app.use(response);

app.use(bodyParser.json());

app.use(auth);
app.use("/usuario", usuario);
app.use("/regra", regra);
app.use("/vinculo", vinculo);
app.use("/fabricante", fabricante);
app.use("/categoria", categoria);
app.use("/produto", produto);
app.use("/servico-mecanico", servicoMecanico);

app.listen(3333);
