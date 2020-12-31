const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const { vendidoArticuloPorId, reportesComprasPorUsuario } = require('../controller/compras_controller');

const app = express();

app.post('/articulo/consulta/:id', verificaToken, vendidoArticuloPorId);
app.get('/articulo/reportes', verificaToken, reportesComprasPorUsuario);

module.exports = app;