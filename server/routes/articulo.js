const express = require('express');
const fileUpload = require('express-fileupload');

const { verificaToken } = require('../middlewares/autenticacion');
const {
    crearNuevoArticulo,
    listaPublicaciones,
    publicacionPorId,
    listaPublicacionesPorUsuario,
    editarArticuloPorId,
    vendidoArticuloPorId,
    estadoPublicacionPorId,
    eliminarFotoArticuloPorId,
    volverPublicarPorId,
    datosVentasGrafico,
    datosComprasGrafico,
    reportesVentasPorUsuario
} = require('../controller/ariticulo_controller');

const app = express();

app.use(fileUpload());

app.get('/publicaciones', verificaToken, listaPublicaciones);
app.get('/publicaciones/detalle/:id', verificaToken, publicacionPorId);
app.get('/publicaciones/usuario', verificaToken, listaPublicacionesPorUsuario);
app.post('/crear', verificaToken, crearNuevoArticulo);
app.put('/editar/:id', verificaToken, editarArticuloPorId);
app.put('/vendido/:id', verificaToken, vendidoArticuloPorId);
app.put('/publicacion/estado/:idpubl/:idart', verificaToken, estadoPublicacionPorId);
app.put('/eliminar/foto/:id', verificaToken, eliminarFotoArticuloPorId);
app.put('/publicaciones/volver/publicar/:idpubl/:idart', verificaToken, volverPublicarPorId);
app.get('/grafico/venta', verificaToken, datosVentasGrafico);
app.get('/grafico/compra', verificaToken, datosComprasGrafico);
app.get('/reportes/ventas', verificaToken, reportesVentasPorUsuario);

//app.get('/publicaciones/usuario/prueba', verificaToken, listaPublicacionesPorUsuarioPrueba);


module.exports = app;