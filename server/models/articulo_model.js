const mongoose = require('mongoose');

const Oferta = require('../models/oferta_model');

let Schema = mongoose.Schema;

let articuloSchema = new Schema({
    foto: [{
        type: String,
        required: [true, 'Debe enviar al menos una imagen']
    }],
    titulo: {
        type: String,
        required: [true, 'El titulo es requerido'],
        minlength: 3,
        maxlength: 150
    },
    precio: {
        type: Number,
        //type: mongoose.Types.Decimal128,
        required: [true, 'El precio es requerido'],
    },
    estado: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'El estado es requerido'],
    },
    marca: {
        type: String,
        minlength: 3,
        maxlength: 150
    },
    descripcion: {
        type: String,
        minlength: 6,
        maxlength: 600,
        required: [true, 'La descripción es requerida'],
    },
    modelo: {
        type: String,
        minlength: 3,
        maxlength: 150
    },
    talla: {
        type: String,
    },
    isoferta: {
        type: Boolean,
        default: false,
    },
    isvendido: {
        type: Boolean,
        default: false,
    },
    subcategoria: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategoria'
    },
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona'
    },
    oferta: {
        type: Oferta.schema,
        //type: Schema.Types.ObjectId,
        //ref: 'Oferta',
        default: null
    }
});

articuloSchema.methods.toJSON = function() {
    let modelData = this;
    let modelDataObject = modelData.toObject();
    delete modelDataObject.__v;

    return modelDataObject
}

module.exports = mongoose.model('Articulo', articuloSchema);