const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const { listarMensajesPorConsulta, crearMensajePorConsulta } = require('../controller/mensajes_controller');

const app = express();

app.post('/crear/consulta/:id', verificaToken, crearMensajePorConsulta);
app.get('/lista/consulta/:id', verificaToken, listarMensajesPorConsulta);

module.exports = app;