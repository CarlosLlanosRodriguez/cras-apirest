const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let datoSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    idper: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

datoSchema.methods.toJSON = function() {
    let dato = this;
    let datoObject = dato.toObject();
    delete datoObject.password;
    delete datoObject.__v;

    return datoObject
}

datoSchema.plugin(uniqueValidator, { message: '{PATH} ya registrado' })

module.exports = mongoose.model('Dato', datoSchema);