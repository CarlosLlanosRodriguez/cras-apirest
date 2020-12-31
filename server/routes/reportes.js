const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const { crearReportePorPublicacion } = require('../controller/reportes_controller');

const app = express();

app.post('/crear/:id', verificaToken, crearReportePorPublicacion);

module.exports = app;