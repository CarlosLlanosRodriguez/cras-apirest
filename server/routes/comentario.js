const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const { crearComentario, listaComentariosPorPublicacion } = require('../controller/comentario_controller');

const app = express();

app.post('/crear/:id', verificaToken, crearComentario)
app.get('/lista/publicacion/:id', verificaToken, listaComentariosPorPublicacion);

module.exports = app;