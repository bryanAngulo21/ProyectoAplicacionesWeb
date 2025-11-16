import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Función genérica para enviar correos
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */
const sendMail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: 'andiubra9722@gmail.com', // correo verificado en SendGrid
      subject,
      html,
    };

    const info = await sgMail.send(msg);
    console.log('✅ Email enviado:', info);
  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
  }
};

export default sendMail;
