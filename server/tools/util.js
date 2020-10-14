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
                err: {
                    message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ') + ' la extension subida es: ' + extension,
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
                        message: 'Error al guardar la imagen',
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

let borrarImagen = (urlImage) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${urlImage}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }

}

/* sendgrid email */
let enviarEmail = async(correo, id, host, protocol) => {
    let link = protocol + '://' + host + "/verify?id=" + id;
    const msg = {
        to: correo,
        from: 'llanoscarlos649@gmail.com', // Use the email address or domain you verified above
        subject: "Por favor confirme su cuenta de correo electrónico",
        text: 'and easy to do anywhere, even with Node.js',
        html: "Hola,<br> Haga clic en el enlace para verificar su correo electrónico.<br><a href=" + link + ">Verificar correo</a>"
    };

    try {
        const { err, result } = await sgMail.send(msg);

        if (err) {
            console.error('1>>>>\n ' + error);
            if (error.response) {
                console.error('2>>>>>\n ' + error.response.body);
                return error;
            }
            return err
        };
        console.log(result);
        return true;

    } catch (error) {
        console.error('3>>>\n ' + error);

        if (error.response) {
            console.error('4>>>\n ' + error.response.body);
            return error;
        }
    }
}


module.exports = {
    subirImagen,
    borrarImagen,
    enviarEmail
}