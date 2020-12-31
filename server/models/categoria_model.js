const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        minlength: 3,
        maxlength: 150
    },
    descripcion: {
        type: String,
        minlength: 6,
        maxlength: 350,
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

categoriaSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

module.exports = mongoose.model('Categoria', categoriaSchema);