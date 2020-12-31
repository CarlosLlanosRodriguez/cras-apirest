const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let publicacionesSchema = new Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    isbaneo: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    repost_counter: {
        type: Number,
        default: 0
    },
    articulo: {
        type: Schema.Types.ObjectId,
        ref: 'Articulo'
    }
});

publicacionesSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

module.exports = mongoose.model('Publicaciones', publicacionesSchema);