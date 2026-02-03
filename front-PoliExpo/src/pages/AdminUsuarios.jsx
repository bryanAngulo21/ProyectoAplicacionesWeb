import { useState, useEffect } from 'react';
import { Link } from 'react-router';  
import { toast } from 'react-toastify';
import { authService } from '../services/api';
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaCrown,
  FaUserGraduate,
  FaCalendar,
  FaEye,
  FaTrash,
  FaIdCard,
  FaChartBar,
  FaList,
} from 'react-icons/fa';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await authService.getAllUsers();
      setUsuarios(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return;
    
    try {
      await authService.deleteUser(id);
      toast.success('Usuario eliminado');
      cargarUsuarios(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className='font-black text-3xl md:text-4xl text-gray-800 mb-2 flex items-center gap-2'>
         Gestión de Usuarios
      </h1>
      <div className="w-20 h-1 bg-red-600 mb-6"></div>
      <p className='mb-8 text-gray-600 flex items-center gap-2'>
         Administra los usuarios de la plataforma ({usuarios.length} usuarios)
      </p>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
            <FaUsers /> Todos los usuarios
          </h2>
        </div>

        {usuarios.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="text-gray-400 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No hay usuarios registrados</h3>
            <p className="text-gray-500">Aún no se han registrado usuarios en la plataforma.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaUser /> Nombre
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaEnvelope /> Email
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">Rol</th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaCalendar /> Fecha registro
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-800 flex items-center gap-2">
                          <FaUser /> {usuario.nombre} {usuario.apellido}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FaIdCard /> ID: {usuario._id.substring(0, 8)}...
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 flex items-center gap-2">
                      <FaEnvelope /> {usuario.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                        usuario.rol === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.rol === 'admin' ? (
                          <>
                            <FaCrown /> Admin
                          </>
                        ) : (
                          <>
                            <FaUserGraduate /> Estudiante
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm flex items-center gap-2">
                      <FaCalendar /> {formatearFecha(usuario.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/usuario/${usuario._id}`}  
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                          title="Ver detalles del usuario"
                        >
                          <FaEye /> Ver
                        </Link>
                        <button
                          onClick={() => eliminarUsuario(usuario._id, usuario.nombre)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                          title="Eliminar usuario"
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
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

export default AdminUsuarios;