const express = require('express');
const mongoose = require('mongoose');

const app = express();

const Favorito = require('../models/favorito_model');

favoritoPublicacionPorId = async(req, res) => {
    let idpublicacion = req.params.id;
    let idusuario = req.usuario._id;
    try {
        const favorito = await Favorito.findOne({ publicacion: idpublicacion });
        if (favorito == null) {
            const favorito = new Favorito({
                usuario: idusuario,
                publicacion: idpublicacion
            });
            const guardar = await favorito.save();
            return res.json({
                ok: true,
                msg: 'Favorito guardado con exito',
            });
        }
        const eliminar = await Favorito.findByIdAndDelete(favorito._id);
        res.json({
            ok: true,
            msg: 'Favorito eliminado con exito',
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'Error en el servidor itentelo más tarde',
                err: error
            }
        });
    }
}

listaFavoritosPorUsuario = async(req, res) => {
    let idusuario = req.usuario._id;
    try {
        const favoritos = await Favorito.find({ usuario: idusuario })
            .populate({
                path: 'publicacion',
                populate: {
                    path: 'articulo',
                    populate: {
                        path: 'subcategoria',
                        select: { nombre: 1, icono: 1, categoria: 1 },
                        populate: {
                            path: 'categoria',
                            select: { nombre: 1, icono: 1 },
                        }
                    },
                    select: { __v: 0 },
                },
                select: { __v: 0 },
            })
            .populate({
                path: 'publicacion',
                populate: {
                    path: 'articulo',
                    populate: {
                        path: 'persona',
                        select: { nombre: 1, ap: 1, am: 1, celular: 1, foto: 1 },
                    },
                    select: { __v: 0 },
                },
                select: { __v: 0 },
            });
        res.json({
            ok: true,
            favoritos
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'No se pudo recuperar los datos',
                err: error
            }

        });
    }
}

module.exports = {
    favoritoPublicacionPorId,
    listaFavoritosPorUsuario
}