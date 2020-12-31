const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let mensajeSchema = new Schema({
    texto: {
        type: String,
        required: [true, 'El mensaje es requerido'],
        //minlength: 3,
        maxlength: 800
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
    },
    consulta: {
        type: Schema.Types.ObjectId,
        ref: 'Consultas'
    }
});

mensajeSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

module.exports = mongoose.model('Mensajes', mensajeSchema);