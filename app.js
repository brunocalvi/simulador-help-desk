const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const consign = require("consign");
const connection = require("./database/connection");

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Adicionando a conexão ao contexto do consign
// Disponibiliza a conexão para os outros módulos
app.database = { connection }; 

consign({ verbose: true })
  .include("controllers")
  .then("common")
  .then("routes")
  .into(app);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}!`);
});