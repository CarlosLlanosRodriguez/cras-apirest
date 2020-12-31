const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken')

const Persona = require('../models/persona_model');
const Dato = require('../models/dato_model');
const Administrador = require('../models/Administrador_model');
const Usuario = require('../models/Usuario_model');
const { subirImagen, borrarImagen, enviarEmail } = require('../tools/util');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.use(fileUpload());


app.get('/', verificaToken, async(req, res) => {
    const usuario = await Persona.findById(req.usuario._id)
        .populate({
            path: 'dato',
            select: { __v: 0, password: 0 },
        });
    res.json({
        ok: true,
        usuario
    })
});


app.post('/registro', async(req, res) => {
    let idusu = mongoose.Types.ObjectId();
    let idDato = mongoose.Types.ObjectId();
    let body = req.body;
    let rutaImg = '';
    let dato = new Dato({
        _id: idDato,
        email: body.email,
        password: body.password === undefined ? undefined : bcrypt.hashSync(body.password, 5),
        idper: idusu,
    });

    try {
        rutaImg = await subirImagen(req.files, 'usuarios', idusu);
        const datos = await dato.save();
        let persona = new Persona({
            _id: idusu,
            nombre: body.nombre,
            ap: body.ap,
            am: body.am,
            ci: body.ci,
            celular: body.celular,
            direccion: body.direccion === undefined ? null : body.direccion,
            foto: rutaImg,
            dato: idDato,
            administrador: new Administrador(),
            usuario: new Usuario()
        });
        const per = await persona.save();
        const est = await enviarEmail(body.email, idusu, req.get('host'), req.protocol);

        let token = jwt.sign({
            usuario: per
        }, process.env.SEED);

        res.json({
            ok: true,
            usuario: per,
            token
        });
    } catch (err) {
        await Dato.findOneAndRemove({ _id: idDato });
        await Persona.findOneAndRemove({ _id: idusu });
        borrarImagen(rutaImg);
        return res.status(500).json({
            ok: false,
            error: {
                msg: 'No se pudo guardar los datos',
                err
            }
        });
    }
});

app.put('/editar/email', verificaToken, async(req, res) => {
    const idDato = req.usuario.dato
    const idusu = req.usuario._id
    console.log(idDato);
    console.log(idusu);

    try {
        const newDato = await Dato.findByIdAndUpdate({ _id: idDato }, { email: req.body.email });
        const est = await enviarEmail(req.body.email, idusu, req.get('host'), req.protocol);

        res.json({
            ok: true,
            msg: 'Actualizado con éxito, se envio un enlace a su correo',
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
})


app.get('/verify', function(req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    console.log(req.query.id);
    Persona.findById({ _id: req.query.id }, (err, perdb) => {
        if (err) {
            console.log("El correo electrónico no está verificado");
            res.send("<h1>El correo electrónico no se pudo verificar</h1>");
        }
        perdb.usuario.isverificado = true
        Persona.findByIdAndUpdate(req.query.id, { 'usuario.isverificado': true }, (err, raw) => {
            if (err) {
                console.log('error ' + err);
                res.send("<h1>El correo electrónico no se pudo verificar</h1>");
            }
            console.log('res ' + raw);
            res.send("<h1>El correo electrónico se ha verificado correctamente</h1>");
        });
    });
});

/* actualizar datos personales */
app.put('/editar', verificaToken, async(req, res) => {
    let id = req.usuario._id;
    let body = _.pick(req.body, ['nombre', 'ap', 'am', 'foto', 'direccion']);
    let rutimg = 'usuarios/user-no-image.png';
    console.log(id);
    try {
        const persona = await Persona.findById(id);
        if (req.files != null) {
            rutimg = await subirImagen(req.files, 'usuarios', id);
            console.log('>>>> ' + rutimg);
            if (persona.foto != 'usuarios/user-no-image.png') {
                console.log('true');
                borrarImagen(persona.foto);
            }
            body.foto = rutimg;
        }

        actualizar = await Persona.findByIdAndUpdate({ _id: id }, body, { new: true, runValidators: true });

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

});

module.exports = app;


/*

app.post('/registro', async (req, res) => {
    let id = mongoose.Types.ObjectId();
    let body = req.body;

    let dato = new Dato({
        email: body.email,
        password: body.password === undefined ? undefined : bcrypt.hashSync(body.password, 5),
        idper: id,
    })

    subirImagen(req.files, 'usuarios', id).then((rutaImg) => {
        dato.save((err, datodb) => {
            if (err) {
                borrarImagen(rutaImg);
                console.log('Dato');
                return res.status(500).json({
                    ok: false,
                    error: {
                        msg: 'No se pudo guardar los datos',
                        err
                    }

                });
            }

            let persona = new Persona({
                _id: id,
                nombre: body.nombre,
                ap: body.ap,
                am: body.am,
                ci: body.ci,
                celular: body.celular,
                direccion: body.direccion === undefined ? null : body.direccion,
                foto: rutaImg,
                dato: datodb,
                administrador: new Administrador(),
                usuario: new Usuario()
            })
            persona.save((err, perdb) => {
                if (err) {
                    Dato.findOneAndRemove({ _id: datodb._id }, (err, doc) => {});
                    borrarImagen(rutaImg);
                    return res.status(500).json({
                        ok: false,
                        error: {
                            msg: 'No se pudo guardar los datos',
                            err
                        }
                    });
                }

                enviarEmail(body.email, perdb._id, req.get('host'), req.protocol).then((est) => {
                    Persona.findOne(Persona._id = id, (err, userDB) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                error: {
                                    msg: 'No se pudo recuperar el usuario',
                                    err
                                }

                            });

                        }
                        let token = jwt.sign({
                            usuario: userDB
                        }, process.env.SEED);

                        res.json({
                            ok: true,
                            usuario: userDB,
                            token
                        });
                    });
                }).catch((err) => {
                    Dato.findOneAndRemove({ _id: datodb._id }, (err, doc) => {
                        borrarImagen(rutaImg);
                        Persona.findOneAndRemove({ _id: perdb._id }, (err, doc) => {});
                    });
                    return res.json({
                        ok: false,
                        error: {
                            msg: 'Error al enviar correo',
                            error: err
                        },
                    });
                });
            });
        });
    }).catch((error) => {
        res.json(error);
    });

})


*/