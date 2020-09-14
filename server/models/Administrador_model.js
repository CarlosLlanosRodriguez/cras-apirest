const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let administradorSchema = new Schema({
    isadmin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Administrador', administradorSchema)