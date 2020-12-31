const express = require('express');
const mongoose = require('mongoose');

const app = express();

const ProcesarReporte = require('../models/procesar_reporte_model');

crearReportePorPublicacion = async(req, res) => {
    let idusu = req.usuario._id;
    let idpbl = req.params.id;
    try {
        let est = await verificarReporte(idusu, idpbl);
        console.log(est);
        console.log(!est);
        if (est) {
            console.log('entra');
            return res.status(404).json({
                ok: false,
                error: {
                    msg: 'Usted ya envio un reporte de esta publicación',
                    err: null
                }

            });
        }
        const reporte = new ProcesarReporte({
            descripcion: req.body.descripcion,
            usuario: idusu,
            publicacion: idpbl
        });
        const crearReporte = await reporte.save();
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

async function verificarReporte(idusu, idpbl) {
    try {
        const doc = await ProcesarReporte.findOne({ usuario: idusu, publicacion: idpbl });

        console.log(doc);

        if (doc != null) {
            return true;
        }
        return false;
    } catch (error) {
        return false
    }

}

module.exports = {
    crearReportePorPublicacion
}