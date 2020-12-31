const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let consultasSchema = new Schema({
    fecha: {
        type: Date,
        default: new Date() //Date.now
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
    },
    comprador: {
        type: Schema.Types.ObjectId,
        ref: 'Persona'
    },
    publicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Publicaciones'
    }
});

consultasSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

module.exports = mongoose.model('Consultas', consultasSchema);