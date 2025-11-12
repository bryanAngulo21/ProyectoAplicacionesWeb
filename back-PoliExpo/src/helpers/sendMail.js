import sendMail from "../config/nodemailer.js"


const sendMailToRegister = (userMail, token) => {

    return sendMail(
        userMail,
        "Bienvenido a SPOLIEXPO",
        `
            <h1>Confirma tu cuenta</h1>
            <p>Hola, haz clic en el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${process.env.URL_BACKEND}confirmar/${token}">
            Confirmar cuenta
            </a>
            <hr>
            <footer>El equipo de POLIEXPO te da la más cordial bienvenida.</footer>
        `
    )
}


export {
    sendMailToRegister
}