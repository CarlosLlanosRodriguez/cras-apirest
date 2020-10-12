const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Persona = require('../models/persona_model');
const Dato = require('../models/dato_model');
const Administrador = require('../models/Administrador_model');
const Usuario = require('../models/Usuario_model');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Dato.findOne({ email: body.email }, (err, DatoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err

            });
        }

        if (!DatoDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        msg: '1Usuario o Contraseña incorrectos'
                    }

                });
            }
        }

        if (!bcrypt.compareSync(body.password, DatoDB.password)) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        msg: '2Usuario o Contraseña incorrectos'
                    }

                });
            }
        }

        Persona.findOne(Persona._id = DatoDB.idper, (err, userDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        msg: 'No se pudo recuperar el usuario'
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
            })
        });


    })
});


module.exports = app;