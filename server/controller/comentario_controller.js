const express = require('express');
const mongoose = require('mongoose');
const { select } = require('underscore');

const app = express();

const Comentario = require('../models/comentario_model');
const { patch } = require('../routes');

crearComentario = async(req, res) => {
    let idusu = req.usuario._id;
    let idpbl = req.params.id;
    try {
        const comentario = new Comentario({
            texto: req.body.texto,
            usuario: idusu,
            publicacion: idpbl
        });
        const crearComentario = await comentario.save();
        res.json({
            ok: true,
            msg: 'Registrado con éxito'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'No se pudo guardar los datos',
                err: error
            }

        });
    }
}

listaComentariosPorPublicacion = async(req, res) => {
    let idpbl = req.params.id;
    const comentarios = await Comentario.find({ 'publicacion': mongoose.Types.ObjectId(idpbl) })
        .populate({
            path: 'usuario',
            select: { nombre: 1, ap: 1, am: 1, foto: 1 }
        }).sort({ fecha: -1 });
    res.json({
        ok: true,
        comentarios
    })
}

module.exports = {
    listaComentariosPorPublicacion,
    crearComentario
}