const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const fileUpload = require('express-fileupload');

const Persona = require('../models/persona_model');
const Dato = require('../models/dato_model');
const Administrador = require('../models/Administrador_model');
const Usuario = require('../models/Usuario_model');
const { subirImagen, borrarImagen, sendEmail } = require('../tools/util');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.use(fileUpload());


app.get('/persona', verificaToken, (req, res) => {
    Persona.find((err, doc) => {
        res.json({
            ok: true,
            lista: doc
        })
    });
})

app.post('/persona', function(req, res) {
    let id = mongoose.Types.ObjectId();
    let body = req.body;
    console.log(body);
    let dato = new Dato({
        email: body.email,
        password: body.password === undefined ? undefined : bcrypt.hashSync(body.password, 10),
        idper: id,
    })

    subirImagen(req.files, 'usuarios', id).then((rutaImg) => {
        dato.save((err, datodb) => {
            if (err) {
                borrarImagen(rutaImg);
                return res.status(400).json({
                    ok: false,
                    error: err

                });
            }

            let usuario = new Usuario({
                ci: body.ci,
                direccion: body.direccion || null
            })
            let admin = new Administrador({
                isadmin: body.isadmin || false
            })

            let persona = new Persona({
                _id: id,
                nombre: body.nombre,
                ap: body.ap,
                am: body.am,
                dato: datodb,
                foto: rutaImg,
                admin: admin,
                user: usuario
            })
            persona.save((err, perdb) => {
                if (err) {
                    Dato.findOneAndRemove({ _id: datodb._id }, (err, eliminado) => {
                        if (err) {
                            console.log("Error al eliminar");
                        }
                        console.log("Exito al eliminar " + eliminado);

                    });
                    borrarImagen(rutaImg);
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }

                /* envia email para verificar */
                sendEmail(body.email, perdb._id, req.get('host'), req.protocol).then((est) => {
                    res.json({
                        ok: true,
                        persona: perdb,
                    })
                }).catch((err) => {
                    Dato.findOneAndRemove({ _id: datodb._id }, (err, eliminado) => {
                        if (err) {
                            console.log("Error al eliminar");
                        }
                        console.log("Exito al eliminar " + eliminado);

                    });
                    Persona.findOneAndRemove({ _id: perdb._id }, (err, eliminado) => {
                        if (err) {
                            console.log("Error al eliminar");
                        }
                        console.log("Exito al eliminar " + eliminado);

                    });
                    borrarImagen(rutaImg);
                    res.json({
                        ok: false,
                        error: 'Correo electronico invalido',
                        err
                    })
                })
            });
        });
    }).catch((error) => {
        res.json(error);
    });

})


app.get('/verify', function(req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    Persona.findById(req.query.id, {}, (err, perdb) => {
        if (err) {
            console.log("El correo electrónico no está verificado");
            res.send("<h1>El correo electrónico no se pudo verificar</h1>");
        }
        perdb.user.isverificado = true;
        Persona.updateOne(perdb, (err, raw) => {
            if (err) {
                console.log('error ' + err);
                res.send("<h1>El correo electrónico no se pudo verificar</h1>");
            }
            console.log('res ' + raw);
            res.send("<h1>El correo electrónico se ha verificado correctamente</h1>");
        });
    });
});

app.put('/persona/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'ap', 'am' /* , 'foto' */ , 'ci', 'direccion', 'email']);

    Persona.findByIdAndUpdate(id, { body, foto: '/dddd.jpg' }, { new: true, runValidators: true }, (err, perdb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        let usid = perdb.user._id;

        perdb.user.ci = body.ci || perdb.user.ci
        perdb.user.direccion = body.direccion || perdb.user.direccion

        Persona.updateOne(perdb, (err, raw) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }
        });

        res.json({
            ok: true,
            persona: perdb
        })

    })

})

app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
})

/* async function sendEmail(correo, id, host, protocol) {
    let link = protocol + '://' + host + "/verify?id=" + id;

    console.log(link);
    mailOptions = {
        from: 'llanoscarlos649@gmail.com',
        to: correo,
        subject: "Por favor confirme su cuenta de correo electrónico",
        html: "Hola,<br> Haga clic en el enlace para verificar su correo electrónico.<br><a href=" + link + ">Verificar correo</a>"
    }
    console.log(mailOptions);
    const { err, response } = await smtpTransport.sendMail(mailOptions);
    if (err) {
        console.log('no enviado');
        return false;
    } else {
        console.log('enviado');
        return true;
    }
} */


async function getusu(id, body) {
    //const us = await Persona.update({ user._id: usid }, body);
    //const us = await Dato.findOne({ _id: '5f3d6b84e595381a5f1ce417' })
    //const us = await Dato.update({ _id: '5f3d6b84e595381a5f1ce417' }, { body })

    //const us = await Dato.findByIdAndUpdate('5f3d6b84e595381a5f1ce417', body /* { email: 'body.email' } */ , { new: true })
    const us = await Usuario.findOne(Persona.user._id = '5f3d6b84e595381a5f1ce418')
    console.log(us);
}

module.exports = app;