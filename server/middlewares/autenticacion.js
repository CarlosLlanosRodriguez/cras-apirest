//const express = require('express');
const jwt = require('jsonwebtoken');

//const app = express();

/* Verificar Token */
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                error: {
                    msg: 'Token invalido',
                    err
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

module.exports = {
    verificaToken
}