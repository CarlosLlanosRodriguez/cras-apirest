const fs = require('fs');

/*Puerto*/
process.env.PORT = process.env.PORT || 3000;

/* Entorno */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/* SEED de autenticacion de JWT */
process.env.SEED = process.env.SEED || 'seed-desarrollo';

/* api key de sendgrid */
let sendgridapikey;
fs.readFile('sendgrid_api_key.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log('error al leer el archivo: ', err);
    } else {
        console.log(data);
        sendgridapikey = data;
    }
});
process.env.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || sendgridapikey;

/* Base de Datos */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cras_database'
} else {
    urlDB = process.env.MONGO_URIDB; //'mongodb+srv://carlos:LE62NVsg6jfrp8u9@cluster0.6xpvt.mongodb.net/cras';
}

process.env.URLDB = urlDB;