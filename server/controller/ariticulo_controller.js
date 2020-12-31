const express = require('express');
const fileUpload = require('express-fileupload');
const _ = require('underscore');
const mongoose = require('mongoose');

const Articulo = require('../models/articulo_model');
const Publicacion = require('../models/publicacion_model');
const Oferta = require('../models/oferta_model');
const Compras = require('../models/compras_model');
const { subirImagenArticulo, borrarImagen } = require('../tools/util');
const { find } = require('../models/oferta_model');

const app = express();

app.use(fileUpload());

crearNuevoArticulo = async(req, res) => {
    let idart = mongoose.Types.ObjectId();
    //let idpbl = mongoose.Types.ObjectId;
    console.log(`idart : ${idart}`);
    //let body = req.body;
    let body = _.pick(req.body, ['titulo', 'precio', 'estado', 'marca', 'descripcion', 'modelo', 'talla', 'subcategoria']);
    let listarutaimg = [];
    try {
        if (req.files === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    msg: 'Debe subir al menos una imagen',
                    err: null
                }
            });
        } else {
            try {
                listarutaimg = subirImagenArticulo(req.files, req.usuario._id);
            } catch (error) {
                for (let index = 0; index < listarutaimg.length; index++) {
                    borrarImagen(listarutaimg[index]);
                }
                return res.status(500).json({
                    ok: false,
                    error: {
                        msg: 'No se pudo guardar las imagenes',
                        err: error
                    }

                });
            }
            const articulo = new Articulo({
                _id: idart,
                foto: listarutaimg,
                titulo: body.titulo,
                precio: body.precio,
                estado: body.estado,
                marca: body.marca ? body.marca : null,
                descripcion: body.descripcion ? body.descripcion : null,
                modelo: body.modelo ? body.modelo : null,
                talla: body.talla ? body.talla : null,
                subcategoria: body.subcategoria,
                persona: req.usuario._id
            });
            const publicacion = new Publicacion({
                articulo: idart
            });
            const art = await articulo.save();
            const pbl = await publicacion.save();
            res.json({
                ok: true,
                msg: 'Registrado con éxito',
            });
        }
    } catch (error) {
        for (let index = 0; index < listarutaimg.length; index++) {
            borrarImagen(listarutaimg[index]);
        }
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'No se pudo guardar los datos',
                err: error
            }

        });
    }


}

editarArticuloPorId = async(req, res) => {
    var id = req.params.id;
    let body = _.pick(req.body, ['titulo', 'precio', 'estado', 'marca', 'descripcion', 'modelo', 'talla', 'subcategoria', 'oferta', 'isoferta']);
    let precio = 0;
    let listarutaimg = [];
    try {
        const articulo = await Articulo.findById({ _id: id }).populate('persona');
        if (articulo.persona._id != req.usuario._id) {
            return res.status(400).json({
                ok: false,
                error: {
                    msg: 'El usuario no tiene permisos para modificar este artículo',
                    err: null
                }
            });
        }
        try {
            if (req.files != undefined) {
                listarutaimg = subirImagenArticulo(req.files, req.usuario._id);
            }
        } catch (error) {
            for (let index = 0; index < listarutaimg.length; index++) {
                borrarImagen(listarutaimg[index]);
            }
            return res.status(500).json({
                ok: false,
                error: {
                    msg: 'No se pudo guardar las imagenes',
                    err: error
                }

            });
        }
        precio = body.precio != undefined ? body.precio : articulo.precio;
        if (req.body.oferta_precio != undefined) {
            console.log('entro');
            if (req.body.oferta_precio >= precio || req.body.oferta_precio == 0) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        msg: 'El precio de oferta debe ser menor al precio actual del articulo',
                        err: null
                    }
                });
            } else {
                let porcentaje = (100 - ((req.body.oferta_precio / precio) * 100)).toFixed(1) + '%';
                let oferta = new Oferta({
                    porcentaje: porcentaje,
                    precio_anterior: precio,
                    precio_oferta: req.body.oferta_precio
                })
                body.isoferta = true;
                body.oferta = oferta
            }
        }
        const actualizar1 = await Articulo.findByIdAndUpdate({ _id: id }, /* { $push: { 'foto': listarutaimg } }, */ body, { new: true });
        const actualizar = await Articulo.findByIdAndUpdate({ _id: id }, { $push: { 'foto': listarutaimg } }, { new: true });

        res.json({
            ok: true,
            msg: 'Actualizado con éxito',
            actualizar
        });
    } catch (error) {
        for (let index = 0; index < listarutaimg.length; index++) {
            borrarImagen(listarutaimg[index]);
        }
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'No se pudo guardar los datos',
                err: error
            }
        });
    }

}

vendidoArticuloPorId = async(req, res) => {
    var id = req.params.id;
    try {
        const articulo = await Articulo.findById({ _id: id }).populate('persona');
        if (articulo.persona._id != req.usuario._id) {
            return res.status(400).json({
                ok: false,
                error: {
                    msg: 'El usuario no tiene permisos para modificar este artículo',
                    err: null
                }
            });
        }

        const actualizar = await Articulo.findByIdAndUpdate({ _id: id }, { isvendido: true }, { new: true });

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

estadoPublicacionPorId = async(req, res) => {
    var idpubl = req.params.idpubl;
    var idart = req.params.idart;
    try {
        const articulo = await Articulo.findById({ _id: idart }).populate('persona');
        if (articulo.persona._id != req.usuario._id) {
            return res.status(400).json({
                ok: false,
                error: {
                    msg: 'El usuario no tiene permisos para modificar este artículo',
                    err: null
                }
            });
        }

        const actualizar = await Publicacion.findByIdAndUpdate({ _id: idpubl }, { estado: false }, { new: true });

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

volverPublicarPorId = async(req, res) => {
    var idpubl = req.params.idpubl;
    var idart = req.params.idart;
    try {
        const articulo = await Articulo.findById({ _id: idart }).populate('persona');
        if (articulo.persona._id != req.usuario._id) {
            return res.status(400).json({
                ok: false,
                error: {
                    msg: 'El usuario no tiene permisos para modificar este artículo',
                    err: null
                }
            });
        }

        const actualizar = await Publicacion.findByIdAndUpdate({ _id: idpubl }, { repost_counter: 0 }, { new: true });

        res.json({
            ok: true,
            msg: 'Actualizado con éxito',
            actualizar
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

eliminarFotoArticuloPorId = async(req, res) => {
    var id = req.params.id;
    let arrayfotos = new Array();
    if (!Array.isArray(req.body.fotos)) {
        arrayfotos.push(req.body.fotos);
    } else {
        arrayfotos = req.body.fotos;
    }
    console.log(arrayfotos);
    console.log(arrayfotos.length);


    try {
        const articulo = await Articulo.findById({ _id: id }).populate('persona');
        if (articulo.persona._id != req.usuario._id) {
            return res.status(400).json({
                ok: false,
                error: {
                    msg: 'El usuario no tiene permisos para eliminar este archivo',
                    err: null
                }
            });
        }

        //const actualizar = await Articulo.findByIdAndUpdate({ _id: id }, { isvendido: true }, { new: true });
        const actualizar = await Articulo.findByIdAndUpdate({ _id: id }, { $pull: { foto: { $in: arrayfotos } } }, { new: true });
        for (let index = 0; index < arrayfotos.length; index++) {
            borrarImagen(arrayfotos[index]);
        }

        res.json({
            ok: true,
            msg: 'Borrado con éxito',
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

listaPublicaciones = async(req, res) => {
    var query = [{ 'isbaneo': false, 'estado': true }];
    if (req.query.oferta != undefined) {
        let oferta = {
            "articulo.isoferta": (req.query.oferta == 'true')
        };
        query.push(oferta);
    }
    if (req.query.categoria != undefined) {
        let categoria = {
            "articulo.subcategoria.categoria._id": mongoose.Types.ObjectId(req.query.categoria)
        };
        query.push(categoria);
    }
    if (req.query.preciomin != undefined) {
        if (req.query.preciomax != undefined) {
            let precio = {
                "articulo.precio": { "$gte": Number(req.query.preciomin), "$lte": Number(req.query.preciomax) }
            }
            query.push(precio);
        } else {
            let precio = {
                "articulo.precio": { "$gte": Number(req.query.preciomin) }
            }
            query.push(precio);
        }
    }

    if (req.query.estadomin != undefined) {
        if (req.query.estadomax != undefined) {
            let estado = {
                "articulo.estado": { "$gte": Number(req.query.estadomin), "$lte": Number(req.query.estadomax) }
            }
            query.push(estado);
        } else {
            let estado = {
                "articulo.estado": { "$gte": Number(req.query.estadomin) }
            }
            query.push(estado);
        }
    }

    if (req.query.fechamin != undefined) {
        if (req.query.fechamax != undefined) {
            let fecha = {
                "fecha": { "$gte": new Date(req.query.fechamin), "$lte": new Date(req.query.fechamax) }
            }
            query.push(fecha);
        } else {
            let fecha = {
                "fecha": { "$gte": new Date(req.query.fechamin) }
            }
            query.push(fecha);
        }
    }

    try {
        const lista = await Publicacion.aggregate([{
                $lookup: {
                    from: "articulos",
                    localField: "articulo",
                    foreignField: "_id",
                    as: "articulo"
                }
            },
            {
                $unwind: "$articulo"
            },
            {
                $lookup: {
                    from: "subcategorias",
                    localField: "articulo.subcategoria",
                    foreignField: "_id",
                    as: "articulo.subcategoria"
                },
            },
            {
                $unwind: "$articulo.subcategoria",
            },
            {
                $lookup: {
                    from: "categorias",
                    localField: "articulo.subcategoria.categoria",
                    foreignField: "_id",
                    as: "articulo.subcategoria.categoria"
                },
            },
            {
                $unwind: "$articulo.subcategoria.categoria",
            },
            {
                $lookup: {
                    from: "personas",
                    localField: "articulo.persona",
                    foreignField: "_id",
                    as: "articulo.persona"
                },
            },
            {
                $unwind: "$articulo.persona",
            },
            {
                $lookup: {
                    from: "favoritos",
                    let: {
                        id: "$_id"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                        $eq: ["$publicacion", "$$id"]
                                    },
                                    {
                                        $eq: ["$usuario", mongoose.Types.ObjectId(req.usuario._id)]
                                    }
                                ]
                            }
                        }
                    }],
                    as: "favorito",
                },
            },
            {
                $match: {
                    //$and: [{ "isbaneo": false }, { "articulo.isvendido": false }, matchQuery]
                    $and: query
                }
            }, {
                $project: {
                    "_id": 1,
                    "isbaneo": 1,
                    "fecha": 1,
                    "estado": 1,
                    "isfavorito": { $in: [mongoose.Types.ObjectId(req.usuario._id), '$favorito.usuario'] },
                    "articulo._id": 1,
                    "articulo.foto": 1,
                    "articulo.isoferta": 1,
                    "articulo.isvendido": 1,
                    "articulo.titulo": 1,
                    "articulo.precio": 1,
                    "articulo.estado": 1,
                    "articulo.marca": 1,
                    "articulo.descripcion": 1,
                    "articulo.modelo": 1,
                    "articulo.talla": 1,
                    "articulo.subcategoria._id": 1,
                    "articulo.subcategoria.nombre": 1,
                    "articulo.subcategoria.icono": 1,
                    "articulo.subcategoria.categoria._id": 1,
                    "articulo.subcategoria.categoria.nombre": 1,
                    "articulo.subcategoria.categoria.icono": 1,
                    "articulo.oferta": 1,
                    /* "articulo.oferta": {
                        $cond: { if: { $eq: ['$articulo.oferta', []] }, then: null, else: '$articulo.oferta' }
                    }, */
                    "articulo.persona._id": 1,
                    "articulo.persona.nombre": 1,
                    "articulo.persona.ap": 1,
                    "articulo.persona.am": 1,
                    "articulo.persona.celular": 1,
                    "articulo.persona.foto": 1,

                }
            }
        ]);
        res.json({
            ok: true,
            publicaciones: lista
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'No se pudo recuperar los datos',
                err: error
            }

        });
    };
};

publicacionPorId = async(req, res) => {
    var id = req.params.id;
    console.log(id);
    try {
        const publicacion = await Publicacion.findById({ _id: id })
            .populate({
                path: 'articulo',
                populate: {
                    path: 'subcategoria',
                    select: { nombre: 1, icono: 1, categoria: 1 },
                    populate: {
                        path: 'categoria',
                        select: { nombre: 1, icono: 1 },
                    }
                },
                //select: { __v: -1 },
            })
            .populate({
                path: 'articulo',
                populate: {
                    path: 'persona',
                    select: { nombre: 1, ap: 1, am: 1, celular: 1, foto: 1 }
                },
                select: { __v: 0 },
            });
        res.json({
            ok: true,
            publicacion: publicacion
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'No se pudo recuperar los datos',
                err: error
            }

        });
    };
}

listaPublicacionesPorUsuario = async(req, res) => {
    console.log(req.usuario._id);
    try {
        const lista = await Publicacion.aggregate([{
                $lookup: {
                    from: "articulos",
                    localField: "articulo",
                    foreignField: "_id",
                    as: "articulo"
                }
            },
            {
                $unwind: "$articulo"
            },
            {
                $lookup: {
                    from: "subcategorias",
                    localField: "articulo.subcategoria",
                    foreignField: "_id",
                    as: "articulo.subcategoria"
                },
            },
            {
                $unwind: "$articulo.subcategoria",
            },
            {
                $lookup: {
                    from: "categorias",
                    localField: "articulo.subcategoria.categoria",
                    foreignField: "_id",
                    as: "articulo.subcategoria.categoria"
                },
            },
            {
                $unwind: "$articulo.subcategoria.categoria",
            },
            {
                $lookup: {
                    from: "personas",
                    localField: "articulo.persona",
                    foreignField: "_id",
                    as: "articulo.persona"
                },
            },
            {
                $unwind: "$articulo.persona",
            },
            {
                $match: {
                    $and: [{ 'articulo.persona._id': mongoose.Types.ObjectId(req.usuario._id) }]
                }
            }, {
                $project: {
                    "_id": 1,
                    "isbaneo": 1,
                    "fecha": 1,
                    "estado": 1,
                    "repost_counter": 1,
                    "articulo._id": 1,
                    "articulo.foto": 1,
                    "articulo.isoferta": 1,
                    "articulo.isvendido": 1,
                    "articulo.titulo": 1,
                    "articulo.precio": 1,
                    "articulo.estado": 1,
                    "articulo.marca": 1,
                    "articulo.descripcion": 1,
                    "articulo.modelo": 1,
                    "articulo.talla": 1,
                    "articulo.oferta": 1,
                    "articulo.subcategoria._id": 1,
                    "articulo.subcategoria.nombre": 1,
                    "articulo.subcategoria.icono": 1,
                    "articulo.subcategoria.categoria._id": 1,
                    "articulo.subcategoria.categoria.nombre": 1,
                    "articulo.subcategoria.categoria.icono": 1,
                    "articulo.persona._id": 1,
                    "articulo.persona.nombre": 1,
                    "articulo.persona.ap": 1,
                    "articulo.persona.am": 1,
                    "articulo.persona.celular": 1,
                    "articulo.persona.foto": 1,

                }
            }
        ]);
        res.json({
            ok: true,
            publicacion: lista
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

datosVentasGrafico = async(req, res) => {
    try {
        const data = await Publicacion.aggregate([{
                $lookup: {
                    from: "articulos",
                    localField: "articulo",
                    foreignField: "_id",
                    as: "articulo"
                }
            },
            {
                $unwind: "$articulo"
            },
            {
                $lookup: {
                    from: "personas",
                    localField: "articulo.persona",
                    foreignField: "_id",
                    as: "articulo.persona"
                },
            },
            {
                $unwind: "$articulo.persona",
            },
            {
                $match: {
                    $and: [
                        { 'articulo.persona._id': mongoose.Types.ObjectId(req.usuario._id) },
                        { 'articulo.isvendido': true }
                    ]
                }
            },
            {
                $group: {
                    _id: { $month: '$fecha' },
                    mes: { $last: { $month: '$fecha' } },
                    fecha: { $last: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } } },
                    ventas: { $sum: 1 }
                },
            },
            {
                $project: {
                    _id: 0,
                    mes: 1,
                    fecha: 1,
                    ventas: 1
                }
            }
        ]);

        res.json({
            ok: true,
            ventas: data
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

datosComprasGrafico = async(req, res) => {
    try {
        console.log(req.usuario._id);
        const data = await Compras.aggregate([{
                $match: {
                    $and: [
                        { 'usuario': mongoose.Types.ObjectId(req.usuario._id) },
                    ]
                }
            },
            {
                $group: {
                    _id: { $month: '$fecha' },
                    mes: { $last: { $month: '$fecha' } },
                    //anio: { $last: { $year: '$fecha' } },
                    fecha: { $last: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } } },
                    compras: { $sum: 1 }
                },
            },
            {
                $project: {
                    _id: 0,
                    mes: 1,
                    //anio: 1,
                    fecha: 1,
                    compras: 1
                }
            }
        ])

        res.json({
            ok: true,
            compras: data
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

reportesVentasPorUsuario = async(req, res) => {
    const idusu = req.usuario._id;

    try {
        const [total] = await Articulo.aggregate([{
                $match: {
                    $and: [
                        { isvendido: true },
                        { persona: mongoose.Types.ObjectId(idusu) }
                    ]
                }
            },
            {
                $group: {
                    _id: '$persona',
                    total: {
                        $sum: {
                            $cond: { if: { $eq: ['$isoferta', true] }, then: '$oferta.precio_oferta', else: '$precio' }
                        }
                    },
                }
            },
            {
                $project: {
                    _id: false,
                    total: '$total'
                }
            }
        ]);

        // const articulos = await Articulo.find({ persona: idusu, isvendido: true }, { isoferta: true, oferta: 1, titulo: 1, precio: 1, persona: 1 });

        const articulos = await Articulo.aggregate([{
                $match: {
                    $and: [
                        { isvendido: true },
                        { persona: mongoose.Types.ObjectId(idusu) }
                    ]
                }
            },
            {
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
                $lookup: {
                    from: "personas",
                    localField: "compra.usuario",
                    foreignField: "_id",
                    as: "compra.usuario"
                }
            },
            {
                $unwind: "$compra.usuario"
            },
            {
                $project: {
                    'isoferta': 1,
                    'oferta': 1,
                    'titulo': 1,
                    'precio': 1,
                    'persona': 1,
                    'compra._id': 1,
                    //'compra.usuario': 1,
                    'compra.articulo': 1,
                    'compra.fecha': 1,
                    'compra.usuario_id': 1,
                    'compra.usuario.nombre': 1,
                    'compra.usuario.ap': 1,
                    'compra.usuario.am': 1,
                }
            }
        ]);

        res.json({
            ok: true,
            articulos,
            total: total === undefined ? 0 : total['total']
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
};