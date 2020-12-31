const express = require('express');
const mongoose = require('mongoose');

const Categoria = require('../models/categoria_model');
const Subcategoria = require('../models/subcategoria_model');
const Atributo = require('../models/atributo_model');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.get('/', verificaToken, async(req, res) => {
    //let jts = await Subcategoria.find({ estado: true }).populate('categoria').populate('atributos');
    let jts = await Categoria.find({ estado: true });
    res.json({
        ok: true,
        lista: jts
    });
});

module.exports = app;