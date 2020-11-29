const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//Middlewares
const response = require("./middlewares/response");

//Controllers
const usuario = require("./controllers/Usuario");
const operador = require("./controllers/Operador");
const auth = require("./controllers/Auth");
const fabricante = require("./controllers/Fabricante");
const categoria = require("./controllers/Categoria");
const produto = require("./controllers/Produto");

app.use(cors());
app.use(response);

app.use(bodyParser.json());

app.use(auth);
app.use("/usuario", usuario);
app.use("/operador", operador);
app.use("/fabricante", fabricante);
app.use("/categoria", categoria);
app.use("/produto", produto);

app.listen(3333);
