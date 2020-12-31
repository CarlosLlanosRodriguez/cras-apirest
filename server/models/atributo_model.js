const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let atributoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        minlength: 3,
        maxlength: 200
    },
    descripcion: {
        type: String,
        minlength: 6,
        maxlength: 350,
    },
    ejemplo: {
        type: String,
        minlength: 6,
        maxlength: 100,
    },
    icono: {
        type: String,
        required: [true, 'El icono es requerido'],
        minlength: 6,
        maxlength: 500,
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

atributoSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}


module.exports = mongoose.model('Atributo', atributoSchema);