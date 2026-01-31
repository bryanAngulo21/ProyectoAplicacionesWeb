import Stripe from 'stripe';
import Proyecto from '../models/Proyecto.js';
import Donacion from '../models/Donacion.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const donarProyecto = async (req, res) => {
  try {
    const { paymentMethodId, proyectoId, monto, mensaje } = req.body;

    /* ================= VALIDACIONES ================= */
    if (!paymentMethodId || !proyectoId || monto === undefined) {
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

    /* ================= PROYECTO ================= */
    const proyecto = await Proyecto.findById(proyectoId);
    if (!proyecto) {
      return res.status(404).json({
        msg: 'Proyecto no encontrado',
      });
    }

    /* ================= STRIPE ================= */
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(montoNumerico * 100),
      currency: 'usd',
      description: `Donación al proyecto: ${proyecto.titulo}`,
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
      proyecto: proyectoId,
      donante: req.estudianteHeader?._id || null,
      monto: montoNumerico,
      mensaje: mensaje || '',
      stripePaymentIntentId: paymentIntent.id,
      estado: 'exitosa',
    });

    /* ================= ACTUALIZAR PROYECTO ================= */
    proyecto.totalDonaciones = (proyecto.totalDonaciones || 0) + montoNumerico;
    await proyecto.save();

    return res.status(200).json({
      msg: '🎉 Donación realizada con éxito',
      donacion,
    });

  } catch (error) {
    console.error('❌ Error en donación:', error);

    return res.status(500).json({
      msg: 'Error interno del servidor. Intente nuevamente.',
    });
  }
};
