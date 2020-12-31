require('dotenv').config();

/*Puerto*/
process.env.PORT = process.env.PORT || 3000;

/* Entorno */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/* SEED de autenticacion de JWT */
process.env.SEED = process.env.SEED || 'seed-desarrollo';

/* api key de sendgrid */
//console.log(process.env.SENDGRID_API_KEY_DEV);
process.env.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY_DEV;

/* Base de Datos */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cras_database'
} else {
    urlDB = process.env.MONGO_URIDB; //'mongodb+srv://carlos:LE62NVsg6jfrp8u9@cluster0.6xpvt.mongodb.net/cras';
}

process.env.URLDB = urlDB;