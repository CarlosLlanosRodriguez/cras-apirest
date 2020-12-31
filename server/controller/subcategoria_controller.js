const express = require('express');
const _ = require('underscore');
const mongoose = require('mongoose');

const Subcategoria = require('../models/subcategoria_model');
const Categoria = require('../models/categoria_model');

const app = express();

listaSubcategoria2 = async(req, res) => {
    try {
        const lista = await Categoria.aggregate([{
                "$lookup": {
                    "from": "subcategorias",
                    "localField": "_id",
                    "foreignField": "categoria",
                    "as": "subcategorias"
                }
            },
            {
                $unwind: "$subcategorias"
            },
            {
                $lookup: {
                    from: "atributos",
                    let: {
                        ids: "$subcategorias.atributos"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $in: ["$_id", "$$ids"]
                            }
                        }
                    }],
                    as: "subcategorias.atributos"
                }
            }
        ]);
        res.status(500).json({
            ok: true,
            categoria: lista
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

listaSubcategoria = async(req, res) => {
    try {

        const list = await Subcategoria.find({ estado: true }).populate('categoria').populate('atributos');
        res.json({
            ok: true,
            subcategorias: list
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
    listaSubcategoria,
};