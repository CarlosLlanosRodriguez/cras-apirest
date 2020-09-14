const express = require('express');
const fileUpload = require('express-fileupload');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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

/* enviar email */
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "llanoscarlos649@gmail.com",
        pass: "clr*1993"
    }
});

async function sendEmail(correo, id, host, protocol) {
    let link = protocol + '://' + host + "/verify?id=" + id;

    console.log(link);
    mailOptions = {
        from: 'llanoscarlos649@gmail.com',
        to: correo,
        subject: "Por favor confirme su cuenta de correo electrónico",
        html: "Hola,<br> Haga clic en el enlace para verificar su correo electrónico.<br><a href=" + link + ">Verificar correo</a>"
    }

    const { err, response } = await smtpTransport.sendMail(mailOptions);
    if (err) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    subirImagen,
    borrarImagen,
    sendEmail
}