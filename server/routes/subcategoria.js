const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const { listaSubcategoria, listaSubcategoria2 } = require('../controller/subcategoria_controller');

const app = express();


app.get('/lista', verificaToken, listaSubcategoria);
app.get('/lista2', verificaToken, listaSubcategoria);

module.exports = app;