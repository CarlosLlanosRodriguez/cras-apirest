const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let favoritoSchema = new Schema({
    fecha: {
        type: Date,
        default: Date.now
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

favoritoSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

module.exports = mongoose.model('Favorito', favoritoSchema);