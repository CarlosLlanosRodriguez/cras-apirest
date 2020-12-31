const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const { favoritoPublicacionPorId, listaFavoritosPorUsuario } = require('../controller/favorito_controller');

const app = express();

app.post('/:id', verificaToken, favoritoPublicacionPorId);
app.get('/lista', verificaToken, listaFavoritosPorUsuario);

module.exports = app;