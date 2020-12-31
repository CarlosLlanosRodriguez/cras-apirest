const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let procesarReporteSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es requerida'],
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    isbloqueado: {
        type: Boolean,
        default: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Persona'
    },
    publicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Publicaciones'
    }
});

procesarReporteSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

module.exports = mongoose.model('procesar_reportes', procesarReporteSchema);