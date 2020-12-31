const mongoose = require('mongoose');

const Mensajes = require('../models/mensaje_model');

crearMensajePorConsulta = async(req, res) => {
    let idusu = req.usuario._id;
    let idcon = req.params.id;
    try {
        const mensaje = new Mensajes({
            texto: req.body.texto,
            usuario: idusu,
            consulta: idcon
        });
        const crearmensaje = await mensaje.save();
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

listarMensajesPorConsulta = async(req, res) => {
    let idcon = req.params.id;
    const mensajes = await Mensajes.find({ 'consulta': mongoose.Types.ObjectId(idcon) })
        .populate({
            path: 'usuario',
            select: { nombre: 1, ap: 1, am: 1, foto: 1 }
        }).sort({ fecha: -1 });
    res.json({
        ok: true,
        mensajes
    })
}

module.exports = {
    listarMensajesPorConsulta,
    crearMensajePorConsulta
}