import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Función genérica para enviar correos con SendGrid
 */
const sendMail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: 'andiubra@gmail.com', // Debe ser un remitente verificado en SendGrid
      subject,
      html,
    };

    const info = await sgMail.send(msg);
    console.log('✅ Email enviado:', info);
  } catch (error) {
    // Mostrar error completo de SendGrid
    console.error('❌ Error enviando email:', error.response ? error.response.body : error);
  }
};

export default sendMail;
