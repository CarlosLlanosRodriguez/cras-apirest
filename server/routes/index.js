const express = require('express');

const app = express();

app.use('/api', require('./login'));
app.use('/api/persona', require('./persona'));
app.use('/api/categoria', require('./categoria'));
app.use('/api/articulo', require('./articulo'));
app.use('/api/subcategoria', require('./subcategoria'));
app.use('/api/favorito', require('./favorito'));
app.use('/api/reporte', require('./reportes'));
app.use('/api/comentario', require('./comentario'));
app.use('/api/consulta', require('./consulta'));
app.use('/api/mensaje', require('./mensaje'));
app.use('/api/compras', require('./compras'));

module.exports = app;