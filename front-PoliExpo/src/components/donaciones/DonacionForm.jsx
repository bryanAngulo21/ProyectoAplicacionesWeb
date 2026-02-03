import { useState, useEffect } from 'react';
import { donacionService } from '../../services/api';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import logoPoliExpo from '../../assets/logo-PoliExpo3.png'


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY|| 
  'pk_test_51SrNzYIbKaYC42xVfcEG2Rn7qwTxEAKdCWo6yr4wcYJBoAhIWIexBRxMqrrQzrGBh1AuDYmSPYrULLOEBl2IfHXY00UpksWlSi');

const StripeDonationForm = ({ onDonationSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    monto: '',
    mensaje: '',
  });

  const montosSugeridos = [5, 10, 20, 50, 100];

  useEffect(() => {
    console.log('Stripe cargado:', !!stripe);
    console.log('Stripe Key:', import.meta.env.VITE_STRIPE_KEY?.substring(0, 20) + '...');
  }, [stripe]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMontoClick = (monto) => {
    setFormData(prev => ({ ...prev, monto: monto.toString() }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!stripe || !elements) {
    toast.error('Stripe no está cargado. Recarga la página.');
    return;
  }

  if (!formData.monto || parseFloat(formData.monto) < 1) {
    toast.error('El monto mínimo es $1 USD');
    return;
  }

  setLoading(true);

  try {
    console.log('Iniciando proceso de donación...');
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      toast.error('No se pudo cargar el formulario de tarjeta');
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      console.error('Error de Stripe:', stripeError);
      toast.error(`Error: ${stripeError.message}`);
      setLoading(false);
      return;
    }

    console.log('PaymentMethod creado:', paymentMethod.id);

    const donationData = {
      paymentMethodId: paymentMethod.id,
      monto: parseFloat(formData.monto),
      mensaje: formData.mensaje || '',
    };
    
    console.log('Enviando al backend:', donationData);
    
    const response = await donacionService.donateToPlatform(donationData);
    console.log('Respuesta del backend:', response.data);
    
    if (response.data.requiereAccion && response.data.clientSecret) {
      console.log('Procesando 3D Secure...');
      
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        response.data.clientSecret
      );

      if (confirmError) {
        console.error('Error 3D Secure:', confirmError);
        toast.error(`Error en autenticación: ${confirmError.message}`);
        setLoading(false);
        return;
      }

      console.log('3D Secure completado:', paymentIntent.status);
      
      if (paymentIntent.status === 'succeeded') {
        await donacionService.confirmDonation({
          paymentIntentId: paymentIntent.id
        });
        
        toast.success('¡Donación realizada con éxito! (3D Secure)');
        
        if (onDonationSuccess) {
          onDonationSuccess(response.data.donacion || { monto: formData.monto });
        }
      }
    } else {
      console.log('Pago exitoso sin 3D Secure');
      toast.success('¡Donación realizada con éxito!');
      
      if (onDonationSuccess) {
        onDonationSuccess(response.data.donacion || { monto: formData.monto });
      }
    }
    
    // Limpiar formulario solo después del éxito
    setFormData({ monto: '', mensaje: '' });
    cardElement.clear();
    
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Detalles del error:', error.response?.data);
    
    if (error.response?.status === 401) {
      toast.error('Tu sesión expiró. Vuelve a iniciar sesión.');
    } else if (error.response?.data?.msg) {
      toast.error(error.response.data.msg);
    } else if (error.message?.includes('Network Error')) {
      toast.error('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
    } else if (error.message?.includes('timeout')) {
      toast.error('Tiempo de espera agotado. Intenta nuevamente.');
    } else {
      toast.error('Error al procesar la donación');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Selecciona un monto de donación
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {montosSugeridos.map((monto) => (
            <button
              key={monto}
              type="button"
              onClick={() => handleMontoClick(monto)}
              className={`py-3 px-4 rounded-xl border transition-all duration-200 ${
                parseFloat(formData.monto) === monto
                  ? 'bg-red-600 text-white border-red-600 transform scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
              }`}
            >
              <div className="font-bold">${monto}</div>
              <div className="text-xs opacity-75">USD</div>
            </button>
          ))}
        </div>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleInputChange}
            placeholder="Otro monto"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
            min="1"
            step="0.01"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Monto mínimo: $1.00 USD
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mensaje de apoyo (opcional)
        </label>
        <textarea
          name="mensaje"
          value={formData.mensaje}
          onChange={handleInputChange}
          placeholder="Deja un mensaje de apoyo o dedicación..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
          rows="3"
          maxLength="300"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            Tu mensaje será público en la sección de donaciones recientes
          </p>
          <p className="text-xs text-gray-500">
            {formData.mensaje.length}/300 caracteres
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <span className="text-gray-700">💳</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Información de tarjeta</h4>
            <p className="text-sm text-gray-600">
              Procesado de forma segura por Stripe
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalles de la tarjeta
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Para pruebas usa <span className="font-mono">4242 4242 4242 4242</span>
            </p>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Tarjeta de prueba:</span> 4242 4242 4242 4242</p>
            <p><span className="font-medium">Fecha:</span> Cualquier fecha futura (12/34)</p>
            <p><span className="font-medium">CVC:</span> Cualquier 3 dígitos (123)</p>
            <p><span className="font-medium">Código postal:</span> Cualquier 5 dígitos (12345)</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe || !formData.monto || parseFloat(formData.monto) < 1}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
          loading || !stripe || !formData.monto || parseFloat(formData.monto) < 1
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Procesando donación...
          </div>
        ) : (
          `Donar $${formData.monto || '0'} USD`
        )}
      </button>
    </form>
  );
};

const DonacionForm = ({ onDonationSuccess, onClose }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        <div className="text-center mb-8 flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={logoPoliExpo}
                alt="logo"
                className="w-20 h-20"
              />
              <h1 className="text-2xl md:text-3xl font-extrabold text-black">
                Apoya a <span className="text-red-800">Poli</span>Expo
              </h1>
            </div>

            <p className="text-gray-600 max-w-lg">
              Tu donación ayuda a mantener la plataforma activa y apoyar a más estudiantes.
            </p>
          </div>

        <StripeDonationForm 
          onDonationSuccess={onDonationSuccess} 
          onClose={onClose}
        />
      </div>
    </Elements>
  );
};

export default DonacionForm;