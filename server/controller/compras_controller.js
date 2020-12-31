const mongoose = require('mongoose');

const Compras = require('../models/compras_model');
const Consulta = require('../models/consulta_model');
const Articulo = require('../models/articulo_model');
const Publicacion = require('../models/publicacion_model');

vendidoArticuloPorId = async(req, res) => {
    var idcon = req.params.id;
    try {
        const consulta = await Consulta.findById({ _id: idcon });
        if (consulta == null) {
            return res.status(404).json({
                ok: false,
                error: {
                    msg: 'No se encontraron los datos',
                    err: null
                }
            });
        }

        if (consulta.vendedor != req.usuario._id) {
            return res.status(400).json({
                ok: false,
                error: {
                    msg: 'El usuario no tiene permisos para modificar este artículo',
                    err: null
                }
            });
        }

        const publicaicon = await Publicacion.findById({ _id: consulta.publicacion });

        const compra = new Compras({
            usuario: consulta.comprador,
            articulo: publicaicon.articulo
        })

        const actualizar = await Articulo.findByIdAndUpdate({ _id: publicaicon.articulo }, { isvendido: true }, { new: true });
        const guardar = await compra.save();

        res.json({
            ok: true,
            msg: 'Actualizado con éxito',
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

reportesComprasPorUsuario = async(req, res) => {
    const idusu = req.usuario._id;

    try {
        const [gastos] = await Articulo.aggregate([{
                $lookup: {
                    from: "compras",
                    localField: "_id",
                    foreignField: "articulo",
                    as: "compra"
                }
            },
            {
                $unwind: "$compra"
            },
            {
                $match: {
                    $and: [
                        { 'compra.usuario': mongoose.Types.ObjectId(idusu) }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    gastos: {
                        $sum: {
                            $cond: { if: { $eq: ['$isoferta', true] }, then: '$oferta.precio_oferta', else: '$precio' }
                        }
                    },
                }
            },
            {
                $project: {
                    _id: false,
                    gastos: 1,
                }
            },
        ]);

        const articulos = await Articulo.aggregate([{
                $lookup: {
                    from: "compras",
                    localField: "_id",
                    foreignField: "articulo",
                    as: "compra"
                }
            },
            {
                $unwind: "$compra"
            },
            {
                $match: {
                    $and: [
                        { 'compra.usuario': mongoose.Types.ObjectId(idusu) }
                    ]
                }
            },
            {
                $lookup: {
                    from: "personas",
                    localField: "persona",
                    foreignField: "_id",
                    as: "persona"
                },
            },
            {
                $unwind: "$persona",
            },
            {
                $project: {
                    'isoferta': 1,
                    'oferta': 1,
                    'titulo': 1,
                    'precio': 1,
                    //'persona': 1,
                    'compra._id': 1,
                    'compra.usuario': 1,
                    'compra.articulo': 1,
                    'compra.fecha': 1,

                    'persona._id': 1,
                    'persona.nombre': 1,
                    'persona.ap': 1,
                    'persona.am': 1,
                }
            }
        ]);

        // console.log(gastos);
        // console.log(articulos);

        res.json({
            ok: true,
            articulos,
            gastos: gastos === undefined ? 0 : gastos['gastos']
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

module.exports = {
    vendidoArticuloPorId,
    reportesComprasPorUsuario
}