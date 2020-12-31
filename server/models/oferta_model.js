const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ofertaSchema = new Schema({
    porcentaje: {
        type: String,
    },
    precio_anterior: {
        type: Number,
    },
    precio_oferta: {
        type: Number,
    },
    /* articulo: {
        type: Schema.Types.ObjectId,
        ref: 'Articulo',
    } */
});

module.exports = mongoose.model('Oferta', ofertaSchema);