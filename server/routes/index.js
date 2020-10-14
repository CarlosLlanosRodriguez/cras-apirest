const express = require('express');

const app = express();

app.use('/api', require('./login'));
app.use('/api/persona', require('./persona'))

module.exports = app;