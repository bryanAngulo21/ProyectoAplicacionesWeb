import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { donacionService } from '../services/api';

const DonacionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    monto: '',
    mensaje: '',
  });

  const montosSugeridos = [5, 10, 20, 50];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMontoClick = (monto) => {
    setFormData(prev => ({
      ...prev,
      monto: monto.toString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.monto || Number(formData.monto) <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }

    setLoading(true);
    
    try {
      // Datos para la donación
      const donationData = {
        monto: Number(formData.monto),
        mensaje: formData.mensaje,
        paymentMethodId: 'pm_test_' + Date.now(), // Simulado para prueba
      };

      await donacionService.donateToPlatform(donationData);
      
      toast.success('¡Donación realizada con éxito!');
      
      // Limpiar formulario
      setFormData({ monto: '', mensaje: '' });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error en donación:', error);
      toast.error(error.response?.data?.msg || 'Error al procesar la donación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='font-black text-4xl text-gray-500'>Realizar Donación</h1>
      <hr className='my-4 border-t-2 border-gray-300' />
      <p className='mb-8'>Apoya a la plataforma PoliExpo con tu donación</p>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">💝</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tu apoyo hace la diferencia
            </h2>
            <p className="text-gray-600">
              Las donaciones ayudan a mantener y mejorar la plataforma para todos los estudiantes
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Montos sugeridos */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Selecciona un monto
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {montosSugeridos.map((monto) => (
                  <button
                    type="button"
                    key={monto}
                    onClick={() => handleMontoClick(monto)}
                    className={`py-3 px-4 rounded-lg border text-lg font-medium transition ${
                      formData.monto === monto.toString()
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    ${monto}
                  </button>
                ))}
              </div>

              {/* Monto personalizado */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  placeholder="Otro monto"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            {/* Mensaje opcional */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensaje de apoyo (opcional)
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Escribe un mensaje de apoyo a la comunidad..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                rows="4"
                maxLength="300"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.mensaje.length}/300 caracteres
              </p>
            </div>

            {/* Información de pago simulada */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-700 mb-2">💳 Información de pago (modo prueba)</p>
              <div className="text-sm text-gray-600">
                <p>Tarjeta de prueba: <span className="font-mono">4242 4242 4242 4242</span></p>
                <p>Fecha: 12/34 | CVC: 123 | Código postal: 12345</p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !formData.monto}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-lg transition ${
                  loading || !formData.monto
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></span>
                    Procesando...
                  </>
                ) : `Donar $${formData.monto || '0'}`}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="py-3 px-6 rounded-lg font-semibold text-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              🔒 Pago seguro procesado con Stripe. Tu información está protegida.
            </p>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">¿En qué se usan las donaciones?</h3>
          <ul className="text-blue-700 space-y-2">
            <li>• Mantenimiento de servidores y hosting</li>
            <li>• Mejoras en la plataforma</li>
            <li>• Nuevas funcionalidades para estudiantes</li>
            <li>• Soporte técnico y ayuda</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DonacionPage;