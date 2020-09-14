const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    ci: {
        type: String,
        unique: true,
        required: [true, 'El CI es necesario']
    },
    direccion: {
        type: String,
        default: null
    },
    isverificado: {
        type: Boolean,
        default: false
    }

})

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Usuario', usuarioSchema)