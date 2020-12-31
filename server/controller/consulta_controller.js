const mongoose = require('mongoose');

const Consulta = require('../models/consulta_model');
const Publicacion = require('../models/publicacion_model');
const Mensaje = require('../models/mensaje_model');

consultaPublicacionUsuario = async(req, res) => {
    let idpublicacion = req.params.id;
    let idusuario = req.usuario._id;
    let idcon = mongoose.Types.ObjectId();
    let idmen = mongoose.Types.ObjectId();
    let consulta;
    let mensaje;
    try {
        let pub = await verificarArticuloUsuario(idusuario, idpublicacion);

        if (pub.articulo.persona._id == idusuario) {
            return res.status(404).json({
                ok: false,
                error: {
                    msg: 'No puede iniciar una conversación por que usted creó el artículo',
                    err: null
                }
            });
        }

        let est = await verificarConversacion(idusuario, idpublicacion);

        if (est) {
            return res.status(404).json({
                ok: false,
                error: {
                    msg: 'Ya creo una conversación par este artículo',
                    err: null
                }
            });
        }

        consulta = new Consulta({
            _id: idcon,
            vendedor: pub.articulo.persona._id,
            comprador: idusuario,
            publicacion: idpublicacion
        });
        mensaje = new Mensaje({
            _id: idmen,
            texto: req.body.texto,
            consulta: idcon,
            usuario: idusuario,
        })
        await consulta.save();
        await mensaje.save();

        res.json({
            ok: true,
            msg: 'Registrado con éxito',
        });

    } catch (error) {
        await Consulta.findOneAndRemove({ _id: idcon });
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'No se pudo guardar los datos',
                err: error
            }
        });
    }

}

async function verificarArticuloUsuario(idusuario, idpublicacion) {
    const publicacion = await Publicacion.findById({ _id: idpublicacion })
        .populate({
            path: 'articulo',
            populate: {
                path: 'persona',
                select: { nombre: 1, ap: 1, am: 1, celular: 1, foto: 1 },
            },
            select: { __v: 0 },
        });
    return publicacion;
}

async function verificarConversacion(idusuario, idpublicacion) {
    const consulta = await Consulta.findOne({ usuario: idusuario, publicacion: idpublicacion });

    if (consulta != null) {
        return true
    }
    return false;
}

consultasPorTipoUsuario = async(req, res) => {
    let tipo = req.params.tipo;
    let idusu = req.usuario._id;
    let optipo;
    if (tipo == 'comprador') {
        optipo = { comprador: idusu }
    }
    if (tipo == 'vendedor') {
        optipo = { vendedor: idusu }
    }
    try {
        const consulta = await Consulta.find(optipo)
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
                    select: { __v: 0 }
                },
                select: { __v: 0 }
            })
            .populate({
                path: 'vendedor',
                select: { nombre: 1, ap: 1, am: 1, celular: 1, foto: 1 }
            })
            .populate({
                path: 'comprador',
                select: { nombre: 1, ap: 1, am: 1, celular: 1, foto: 1 }
            });
        res.json({
            ok: true,
            consulta
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
    consultaPublicacionUsuario,
    consultasPorTipoUsuario
}