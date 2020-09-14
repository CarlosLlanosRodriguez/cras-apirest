const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Dato = require('../models/dato_model')
const Administrador = require('../models/Administrador_model')
const Usuario = require('../models/Usuario_model')

let Schema = mongoose.Schema;

let personaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    ap: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    am: {
        type: String,
        //required: true
    },
    estado: {
        type: Boolean,
        default: true,
    },
    foto: {
        type: String,
        required: false
    },
    dato: {
        type: Schema.Types.ObjectId,
        //type: Dato.schema,
        ref: 'Dato'
    },
    admin: {
        type: Administrador.schema,
        //ref: 'Administrador'
    },
    user: {
        type: Usuario.schema,
        //ref: 'Usuario'
    }
});

personaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })

module.exports = mongoose.model('Persona', personaSchema);