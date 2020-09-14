require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const path = require('path');

const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//habilitar los archivos publicos
app.use(express.static(path.resolve(__dirname, '../uploads')));

app.use(require('./routes/datos'))
app.use(require('./routes/persona'))

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) {
        console.log(err);
        throw err;
    };
    console.log('Base de Datos Iniciada');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
})