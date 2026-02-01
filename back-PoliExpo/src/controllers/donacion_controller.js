import Stripe from 'stripe';
import Donacion from '../models/Donacion.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_PRIVATE_KEY);

export const donarPlataforma = async (req, res) => {
  try {
    const { paymentMethodId, monto, mensaje } = req.body;

    /* ================= VALIDACIONES ================= */
    if (!paymentMethodId || monto === undefined) {
      return res.status(400).json({
        msg: 'Todos los campos obligatorios deben ser enviados',
      });
    }

    const montoNumerico = Number(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({
        msg: 'El monto debe ser un número mayor a 0',
      });
    }

    /* ================= STRIPE ================= */
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(montoNumerico * 100),
      currency: 'usd',
      description: `Donación a la plataforma PoliExpo`,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        msg: 'El pago no fue completado',
        estado: paymentIntent.status,
      });
    }

    /* ================= DONACIÓN ================= */
    const donacion = await Donacion.create({
      donante: req.estudianteHeader._id, // ← Estudiante logueado
      monto: montoNumerico,
      mensaje: mensaje || '',
      stripePaymentIntentId: paymentIntent.id,
      estado: 'exitosa',
    });

    await donacion.populate('donante', 'nombre apellido email');

    /* ================= RESPUESTA ================= */
    return res.status(200).json({
      msg: '🎉 Donación realizada con éxito',
      donacion: {
        _id: donacion._id,
        donante: {
          _id: donacion.donante._id,
          nombre: donacion.donante.nombre,
          apellido: donacion.donante.apellido,
          email: donacion.donante.email
        },
        monto: donacion.monto,
        mensaje: donacion.mensaje,
        fecha: donacion.createdAt,
        stripePaymentIntentId: donacion.stripePaymentIntentId
      },
    });

  } catch (error) {
    console.error('❌ Error en donación:', error);

    // Manejo específico de errores de Stripe
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        msg: 'Error en la tarjeta de crédito',
        error: error.message,
      });
    }

    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        msg: 'Solicitud inválida a Stripe',
        error: error.message,
      });
    }

    return res.status(500).json({
      msg: 'Error interno del servidor. Intente nuevamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Obtener donaciones del estudiante
export const obtenerDonacionesEstudiante = async (req, res) => {
  try {
    const estudianteId = req.estudianteHeader._id;

    const donaciones = await Donacion.find({ donante: estudianteId })
      .sort({ createdAt: -1 });

    const totalDonado = donaciones.reduce((sum, d) => sum + (d.monto || 0), 0);

    res.status(200).json({
      msg: "Donaciones obtenidas",
      data: {
        donaciones,
        resumen: {
          totalDonaciones: donaciones.length,
          totalDonado
        }
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo donaciones:', error);
    res.status(500).json({
      msg: 'Error al obtener donaciones',
    });
  }
};

// Obtener todas las donaciones (admin)
export const obtenerTodasDonaciones = async (req, res) => {
  try {
    const donaciones = await Donacion.find()
      .populate('donante', 'nombre apellido email')
      .sort({ createdAt: -1 });

    const totalDonado = donaciones.reduce((sum, d) => sum + (d.monto || 0), 0);

    res.status(200).json({
      msg: "Todas las donaciones",
      data: {
        donaciones,
        resumen: {
          totalDonaciones: donaciones.length,
          totalDonado
        }
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo todas las donaciones:', error);
    res.status(500).json({
      msg: 'Error al obtener donaciones',
    });
  }
};