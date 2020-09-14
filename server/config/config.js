/*Puerto*/
process.env.PORT = process.env.PORT || 3000;

/* Entorno */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/* Base de Datos */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cras_database'
} else {
    urlDB = 'mongodb+srv://carlos:LE62NVsg6jfrp8u9@cluster0.6xpvt.mongodb.net/cras';
}

process.env.URLDB = urlDB;