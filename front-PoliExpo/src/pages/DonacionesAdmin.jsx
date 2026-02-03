import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { donacionService } from '../services/api';
import {
  FaDonate,
  FaDollarSign,
  FaCheckCircle,
  FaSyncAlt,
  FaFileExport,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaChartBar,
  FaList,
  FaExclamationTriangle,
  FaUsers,
  FaFileAlt,
  FaSpinner
} from 'react-icons/fa';

const DonacionesAdmin = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    montoTotal: 0,
    exitosas: 0,
  });

  useEffect(() => {
    cargarDonaciones();
  }, []);

  const cargarDonaciones = async () => {
    try {
      setLoading(true);
      const response = await donacionService.getAllDonations();
      
      if (response.data.data) {
        const donacionesData = response.data.data.donaciones || [];
        const resumenData = response.data.data.resumen || {};
        
        setDonaciones(donacionesData);
        setStats({
          total: donacionesData.length,
          montoTotal: resumenData.totalDonado || 0,
          exitosas: donacionesData.filter(d => d.estado === 'exitosa').length,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.msg || 'Error al cargar donaciones');
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

  const exportToCSV = () => {
    const headers = ['ID', 'Donante', 'Email', 'Monto (USD)', 'Estado', 'Fecha', 'Mensaje'];
    const rows = donaciones.map(d => [
      d._id,
      d.donante ? `${d.donante.nombre} ${d.donante.apellido}` : 'Anónimo',
      d.donante?.email || 'N/A',
      d.monto,
      d.estado,
      formatFecha(d.createdAt),
      d.mensaje || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donaciones_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando donaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className='font-black text-3xl md:text-4xl text-gray-800 mb-2 flex items-center gap-2'>
        Reportes de Donaciones
      </h1>
      <div className="w-20 h-1 bg-red-600 mb-6"></div>
      <p className='mb-8 text-gray-600 flex items-center gap-2'>
        Vizualiza todas las donaciones recibidas en la plataforma
      </p>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaDonate /> Total Donaciones
          </h3>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm opacity-90 mt-2">Transacciones registradas</p>
        </div>

        <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaDollarSign /> Monto Total
          </h3>
          <p className="text-3xl font-bold">${stats.montoTotal.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-2">USD recaudados</p>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaCheckCircle /> Donaciones Exitosas
          </h3>
          <p className="text-3xl font-bold">{stats.exitosas}</p>
          <p className="text-sm opacity-90 mt-2">Transacciones completadas</p>
        </div>
      </div>

      {/* Lista de donaciones */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
              <FaDonate /> Todas las donaciones
            </h2>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <FaUsers /> {donaciones.length} donaciones registradas
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={cargarDonaciones}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              <FaSyncAlt /> Actualizar
            </button>
            

          </div>
        </div>

        {donaciones.length === 0 ? (
          <div className="p-12 text-center">
            <FaDonate className="text-gray-400 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No hay donaciones registradas</h3>
            <p className="text-gray-500">Aún no se han recibido donaciones en la plataforma.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaUser /> Donante
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaDollarSign /> Monto
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">Estado</th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> Fecha
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaFileAlt /> Mensaje
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {donaciones.map((donacion) => (
                  <tr key={donacion._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      {donacion.donante ? (
                        <div>
                          <p className="font-medium text-gray-800 flex items-center gap-2">
                            <FaUser /> {donacion.donante.nombre} {donacion.donante.apellido}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <FaEnvelope /> {donacion.donante.email}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic flex items-center gap-2">
                          <FaUser /> Anónimo
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-lg text-green-600 flex items-center gap-2">
                        <FaDollarSign /> {donacion.monto?.toFixed(2) || '0.00'}
                      </span>
                      <span className="text-xs text-gray-500 block">USD</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                        donacion.estado === 'exitosa' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {donacion.estado === 'exitosa' ? (
                          <>
                            <FaCheckCircle /> Exitosa
                          </>
                        ) : (
                          <>
                            <FaExclamationTriangle /> Fallida
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm flex items-center gap-2">
                      <FaCalendarAlt /> {formatFecha(donacion.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-600 max-w-xs truncate flex items-center gap-2" title={donacion.mensaje}>
                        <FaFileAlt /> {donacion.mensaje || '—'}
                      </p>
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