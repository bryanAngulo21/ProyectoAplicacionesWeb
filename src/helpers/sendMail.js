import { sendMail } from "../config/nodemailer.js"


const sendMailToRegister = (userMail, token) => {
    return sendMail(
        userMail,
        "Bienvenido a PoliExpo – 🧠📂",
        `
            <h1>Confirma tu cuenta</h1>
            <p>Hola, haz clic en el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${process.env.URL_FRONTEND}api/confirm/${token}">
                Confirmar cuenta
            </a>
            <hr>
            <footer>El equipo de PoliExpo te da la más cordial bienvenida.</footer>
        `
    )
}

const sendMailToRecoveryPassword = (userMail, token) => {
    return sendMail(
        userMail,
        "Recupera tu contraseña",
        `
            <h1>PoliExpo – 🧠📂</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <a href="${process.env.URL_FRONTEND}reset/${token}">
                Clic para restablecer tu contraseña
            </a>
            <hr>
            <footer>El equipo de PoliExpo te da la más cordial bienvenida.</footer>
        `
    )
}

export {
    sendMailToRegister,
    sendMailToRecoveryPassword
}

