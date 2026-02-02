import Stripe from 'stripe';
import Donacion from '../models/Donacion.js';

// Inicializar Stripe con tu clave secreta de prueba
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const donarPlataforma = async (req, res) => {
  try {
    const { paymentMethodId, monto, mensaje } = req.body;

    /* ================= VALIDACIONES ================= */
    if (!paymentMethodId || !monto) {
      return res.status(400).json({
        msg: 'Todos los campos obligatorios deben ser enviados',
        error: 'Falta paymentMethodId o monto'
      });
    }

    const montoNumerico = Number(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({
        msg: 'El monto debe ser un número mayor a 0',
      });
    }

    /* ================= STRIPE REAL ================= */
    // Convertir a centavos (Stripe trabaja en centavos)
    const montoCentavos = Math.round(montoNumerico * 100);

    console.log('💳 Procesando pago con Stripe:');
    console.log('- Monto:', montoNumerico, 'USD');
    console.log('- Centavos:', montoCentavos);
    console.log('- PaymentMethod ID:', paymentMethodId);

    // 1. Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: montoCentavos,
      currency: 'usd',
      description: `Donación a PoliExpo`,
      payment_method: paymentMethodId,
      confirm: true, // Confirmar inmediatamente
      confirmation_method: 'manual',
      return_url: `${process.env.URL_FRONTEND}/donacion/completada`,
      metadata: {
        estudianteId: req.estudianteHeader._id.toString(),
        tipo: 'donacion_plataforma',
        plataforma: 'PoliExpo'
      }
    });

    console.log('✅ PaymentIntent creado:', paymentIntent.id);
    console.log('📊 Estado:', paymentIntent.status);

    // 2. Verificar si necesita autenticación adicional (3D Secure)
    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
      console.log('⚠️ Pago requiere acción adicional');
      return res.status(200).json({
        requiereAccion: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        nextAction: paymentIntent.next_action
      });
    }

    // 3. Verificar si el pago fue exitoso
    if (paymentIntent.status !== 'succeeded') {
      console.log('❌ Pago no completado. Estado:', paymentIntent.status);
      return res.status(400).json({
        msg: 'El pago no se completó correctamente',
        estado: paymentIntent.status,
        error: paymentIntent.last_payment_error
      });
    }

    /* ================= GUARDAR DONACIÓN ================= */
    const donacion = await Donacion.create({
      donante: req.estudianteHeader._id,
      monto: montoNumerico,
      mensaje: mensaje || '',
      stripePaymentIntentId: paymentIntent.id,
      estado: 'exitosa',
    });

    await donacion.populate('donante', 'nombre apellido email');

    /* ================= RESPUESTA ================= */
    console.log('🎉 Donación guardada en BD:', donacion._id);
    
    return res.status(200).json({
      msg: '🎉 ¡Donación realizada con éxito!',
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
      stripe: {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100
      }
    });

  } catch (error) {
    console.error('❌ Error en donación:', error);
    console.error('Stripe error type:', error.type);
    console.error('Stripe error code:', error.code);
    console.error('Stripe error message:', error.message);

    // Manejo específico de errores de Stripe
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        msg: 'Error en la tarjeta de crédito',
        error: error.message,
        code: error.code,
        decline_code: error.decline_code
      });
    }

    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        msg: 'Solicitud inválida a Stripe',
        error: error.message,
        param: error.param
      });
    }

    if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({
        msg: 'Error de autenticación con Stripe',
        error: 'Verifica tus claves de API'
      });
    }

    return res.status(500).json({
      msg: 'Error interno del servidor. Intente nuevamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Nueva función para confirmar pagos pendientes
export const confirmarDonacion = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ msg: 'ID de PaymentIntent requerido' });
    }

    console.log('🔄 Confirmando PaymentIntent:', paymentIntentId);

    // Recuperar el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Si ya está exitoso, verificar si ya existe la donación
    if (paymentIntent.status === 'succeeded') {
      let donacion = await Donacion.findOne({ stripePaymentIntentId: paymentIntentId });

      if (!donacion) {
        donacion = await Donacion.create({
          donante: req.estudianteHeader._id,
          monto: paymentIntent.amount / 100,
          mensaje: 'Donación confirmada',
          stripePaymentIntentId: paymentIntentId,
          estado: 'exitosa',
        });

        await donacion.populate('donante', 'nombre apellido email');
      }

      return res.status(200).json({
        msg: '✅ Donación confirmada exitosamente',
        donacion,
        status: paymentIntent.status
      });
    }

    // Si necesita confirmación
    if (paymentIntent.status === 'requires_confirmation') {
      const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntentId);

      if (confirmedIntent.status === 'succeeded') {
        const donacion = await Donacion.create({
          donante: req.estudianteHeader._id,
          monto: confirmedIntent.amount / 100,
          mensaje: 'Donación confirmada',
          stripePaymentIntentId: confirmedIntent.id,
          estado: 'exitosa',
        });

        await donacion.populate('donante', 'nombre apellido email');

        return res.status(200).json({
          msg: '✅ Donación confirmada y procesada',
          donacion,
          status: confirmedIntent.status
        });
      }
    }

    return res.status(400).json({
      msg: 'El pago aún no está listo',
      status: paymentIntent.status,
      requiereAccion: paymentIntent.status === 'requires_action',
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('❌ Error confirmando donación:', error);
    return res.status(500).json({
      msg: 'Error al confirmar la donación',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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