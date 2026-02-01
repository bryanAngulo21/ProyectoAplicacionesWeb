import { useState } from 'react';
import { donacionService } from '../../services/api';
import { toast } from 'react-toastify';

const DonacionForm = ({ onDonationSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    monto: '',
    mensaje: '',
    paymentMethodId: 'pm_test_' + Date.now(), // Simulado para pruebas
  });

  const montosSugeridos = [5, 10, 20, 50, 100];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMontoClick = (monto) => {
    setFormData(prev => ({ ...prev, monto }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    setLoading(true);
    try {
      const donationData = {
        ...formData,
        monto: parseFloat(formData.monto),
      };
      
      const response = await donacionService.donateToPlatform(donationData);
      
      toast.success('¡Donación realizada con éxito! 🎉');
      
      // Reset form
      setFormData({ 
        monto: '', 
        mensaje: '', 
        paymentMethodId: 'pm_test_' + Date.now() 
      });
      
      // Callback para actualizar dashboard
      if (onDonationSuccess) {
        onDonationSuccess(response.data.donacion);
      }
      
    } catch (error) {
      console.error('Error en donación:', error);
      toast.error(error.response?.data?.msg || 'Error al procesar la donación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-full mb-4">
          <span className="text-4xl text-white">💝</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Apoya a PoliExpo
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Tu donación ayuda a mantener la plataforma activa, mejorar funcionalidades 
          y apoyar a más estudiantes en sus proyectos académicos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Montos sugeridos */}
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
          
          {/* Monto personalizado */}
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
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Monto mínimo: $1.00 USD
          </p>
        </div>

        {/* Mensaje opcional */}
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

        {/* Información de pago simulada */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <span className="text-gray-700">💳</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Información de pago</h4>
              <p className="text-sm text-gray-600">
                Modo de prueba - No se realizarán cargos reales
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Tarjeta de prueba</p>
                <p className="font-mono bg-gray-100 p-2 rounded">4242 4242 4242 4242</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Fecha / CVC</p>
                <p className="font-mono bg-gray-100 p-2 rounded">12/34 | 123</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 Esta es una simulación. En producción se integraría con Stripe Elements.
            </p>
          </div>
        </div>

        {/* Beneficios */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-100">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <span>🌟</span> Beneficios de donar
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Apoyas el desarrollo de nuevos estudiantes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Mejoras la infraestructura de PoliExpo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Tu nombre aparecerá en la lista de donantes (opcional)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Contribuyes a una comunidad académica más fuerte
            </li>
          </ul>
        </div>

        {/* Botón de donación */}
        <button
          type="submit"
          disabled={loading || !formData.monto || parseFloat(formData.monto) <= 0}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
            loading || !formData.monto || parseFloat(formData.monto) <= 0
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

        {/* Información de seguridad */}
        <div className="text-center pt-4 border-t border-gray-200">
          <div className="flex justify-center items-center gap-4 mb-2">
            <span className="text-gray-500 text-sm">🔒</span>
            <span className="text-gray-500 text-sm">💳</span>
            <span className="text-gray-500 text-sm">🛡️</span>
          </div>
          <p className="text-xs text-gray-500">
            Tu donación es 100% segura. Utilizamos Stripe para procesamiento de pagos.
            No almacenamos información de tu tarjeta.
          </p>
        </div>
      </form>
    </div>
  );
};

export default DonacionForm;