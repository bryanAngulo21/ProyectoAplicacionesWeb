import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { donacionService } from '../services/api';

const DonacionesAdmin = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDonaciones();
  }, []);

  const cargarDonaciones = async () => {
    try {
      const response = await donacionService.getAllDonations();
      setDonaciones(response.data.data.donaciones);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar donaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='font-black text-4xl text-gray-500'>Gestión de Donaciones</h1>
      <hr className='my-4 border-t-2 border-gray-300' />
      <p className='mb-8'>Administra todas las donaciones de la plataforma</p>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Donaciones</h3>
          <p className="text-3xl font-bold text-gray-800">{donaciones.length}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Monto Total</h3>
          <p className="text-3xl font-bold text-green-600">
            ${donaciones.reduce((sum, d) => sum + (d.monto || 0), 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Donaciones Exitosas</h3>
          <p className="text-3xl font-bold text-blue-600">
            {donaciones.filter(d => d.estado === 'exitosa').length}
          </p>
        </div>
      </div>

      {/* Lista de donaciones */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-800">Todas las donaciones</h2>
            <button
              onClick={cargarDonaciones}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Actualizar
            </button>
          </div>
        </div>

        {donaciones.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay donaciones registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Donante</th>
                  <th className="py-3 px-4 text-left">Monto</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {donaciones.map((donacion) => (
                  <tr key={donacion._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {donacion.donante ? (
                        <div>
                          <p className="font-medium">{donacion.donante.nombre} {donacion.donante.apellido}</p>
                          <p className="text-sm text-gray-500">{donacion.donante.email}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Anónimo</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-green-600">${donacion.monto.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        donacion.estado === 'exitosa' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {donacion.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatFecha(donacion.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonacionesAdmin;