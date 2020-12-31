const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let compraSchema = new Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Persona'
    },
    articulo: {
        type: Schema.Types.ObjectId,
        ref: 'Articulo'
    }
});

compraSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

module.exports = mongoose.model('Compras', compraSchema);