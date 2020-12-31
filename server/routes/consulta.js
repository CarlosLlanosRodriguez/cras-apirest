const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const { consultaPublicacionUsuario } = require('../controller/consulta_controller');

const app = express();

app.post('/crear/publicacion/:id', verificaToken, consultaPublicacionUsuario);
app.get('/lista/:tipo', verificaToken, consultasPorTipoUsuario)

module.exports = app;