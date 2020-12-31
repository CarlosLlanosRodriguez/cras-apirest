const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Dato = require('../models/dato_model')
const Administrador = require('../models/Administrador_model')
const Usuario = require('../models/Usuario_model')

let Schema = mongoose.Schema;

let personaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    ap: {
        type: String,
        required: [true, 'El apellido es requerido']
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
    ci: {
        type: String,
        unique: true,
        required: [true, 'El CI es necesario']
    },
    celular: {
        type: Number,
        required: [true, 'El numero de celular es necesario']
    },
    direccion: {
        type: String,
        default: null
    },
    fecha: { type: Date, default: Date.now },
    dato: {
        type: Schema.Types.ObjectId,
        //type: Dato.schema,
        ref: 'Dato'
    },
    administrador: {
        type: Administrador.schema,
        //ref: 'Administrador'
    },
    usuario: {
        type: Usuario.schema,
        //ref: 'Usuario'
    }
});

personaSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

personaSchema.plugin(uniqueValidator, { message: '{PATH} ya registrado' })

module.exports = mongoose.model('Persona', personaSchema);