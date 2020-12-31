const mongoose = require('mongoose')
    //const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    isverificado: {
        type: Boolean,
        default: false
    }

})

//usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya registrado' })

module.exports = mongoose.model('Usuario', usuarioSchema)