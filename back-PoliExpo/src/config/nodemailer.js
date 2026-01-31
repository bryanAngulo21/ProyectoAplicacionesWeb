import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Crear el transporte SMTP con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Función genérica para enviar correos
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"PoliExpo" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('✅ Email enviado:', info.messageId);
  } catch (error) {
    console.error('❌ Error enviando email:', error);
  }
};

export default sendMail;
