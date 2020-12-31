const express = require('express');
const fileUpload = require('express-fileupload');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(fileUpload());

let subirImagen = (archivo, tipo, id) => {
    let foto = archivo ? archivo.foto : undefined; //req.files.foto;

    const saveImage = new Promise((resolve, reject) => {
        if (foto === undefined) {
            if (tipo === 'usuarios')
                return resolve(`${tipo}/user-no-image.png`);
            if (tipo === 'publicaciones')
                return resolve(`${tipo}/user-no-image.png`);
        }

        //extenciones permitidas
        let extensionesValidas = ['png', 'jpg', 'jpeg'];
        let nombreArchivo = foto.name.split('.');
        let extension = nombreArchivo[nombreArchivo.length - 1];
        if (extensionesValidas.indexOf(extension) < 0) {
            return reject({
                ok: false,
                error: {
                    msg: 'Las extensiones permitidas son ' + extensionesValidas.join(', ') + ' la extension subida es: ' + extension,
                    err: null
                }
            });
        }

        //Cambiar nombre de imagen
        let nombrefoto = `${id}-${new Date().getMilliseconds()}.${extension}`;

        foto.mv(`uploads/${tipo}/${nombrefoto}`, function(err) {
            if (err) {
                reject({
                    ok: false,
                    err: {
                        msg: 'Error al guardar la imagen',
                        err
                    }
                });
            } else {
                resolve(`${tipo}/${nombrefoto}`)
            }
        });
    });

    return saveImage;
}

let subirImagenArticulo = (archivo, id) => {
    var fotosList = [];
    if (archivo.foto.length >= 2) {
        for (let index = 0; index < archivo.foto.length; index++) {
            rutaImg = guardarImagenes(archivo, index, id);
            fotosList.push(rutaImg);
        }
    } else {
        rutaImg = guardarImagen(archivo, id);
        fotosList.push(rutaImg);
    }
    return fotosList;
}

function guardarImagenes(archivo, index, id) {
    //extenciones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg'];
    let nombreArchivo = archivo.foto[index].name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    if (extensionesValidas.indexOf(extension) < 0) {
        return reject({
            ok: false,
            error: {
                msg: 'Las extensiones permitidas son ' + extensionesValidas.join(', ') + ' la extension subida es: ' + extension,
                err: null
            }
        });
    }

    //Cambiar nombre de imagen
    let nombrefoto = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.foto[index].mv(`uploads/publicaciones/${nombrefoto}`, function(err) {
        console.log(err);
    });
    return `publicaciones/${nombrefoto}`;
}

function guardarImagen(archivo, id) {
    let foto = archivo ? archivo.foto : undefined;
    //extenciones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg'];
    let nombreArchivo = foto.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    if (extensionesValidas.indexOf(extension) < 0) {
        return reject({
            ok: false,
            error: {
                msg: 'Las extensiones permitidas son ' + extensionesValidas.join(', ') + ' la extension subida es: ' + extension,
                err: null
            }
        });
    }

    //Cambiar nombre de imagen
    let nombrefoto = `${id}-${new Date().getMilliseconds()}.${extension}`;

    foto.mv(`uploads/publicaciones/${nombrefoto}`, function(err) {
        console.log(err);
    });

    return `publicaciones/${nombrefoto}`;
}

let borrarImagen = (urlImage) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${urlImage}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }

}

/* sendgrid email */
let enviarEmail = async(correo, id, host, protocol) => {
    let link = protocol + '://' + host + "/api/persona/verify?id=" + id;
    const msg = {
        to: correo,
        from: 'llanoscarlos649@gmail.com', // Use the email address or domain you verified above
        subject: "Por favor confirme su cuenta de correo electrónico",
        text: 'and easy to do anywhere, even with Node.js',
        html: "Hola,<br> Haga clic en el enlace para verificar su correo electrónico.<br><a href=" + link + ">Verificar correo</a>"
    };


    (async() => {
        try {
            await sgMail.send(msg);
            return true;
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                err: {
                    msg: 'Correo electronico invalido',
                    err
                }
            }
        }
    })();

    /* try {
        const result = await sgMail.send(msg);

        console.log(result);
        return true;

    } catch (error) {
        console.error('3>>>\n ' + error);
        return false;
    } */
}


module.exports = {
    subirImagen,
    borrarImagen,
    enviarEmail,
    subirImagenArticulo,
    guardarImagen
}