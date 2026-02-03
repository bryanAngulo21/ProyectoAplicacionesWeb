import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';
import { authService } from '../services/api';
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaCrown,
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaGraduationCap,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSyncAlt,
  FaSignInAlt,
  FaTrash,
  FaUsers,
  FaFileAlt,
  FaBolt,
  FaExclamationTriangle
} from 'react-icons/fa';

const DetalleUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuario();
  }, [id]);

  const cargarUsuario = async () => {
    try {
      setLoading(true);
      const response = await authService.getUserById(id);
      setUsuario(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar usuario');
      navigate('/dashboard/usuarios');
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async () => {
    if (!confirm(`¿Estás seguro de eliminar a ${usuario?.nombre}?`)) return;
    
    try {
      await authService.deleteUser(id);
      toast.success('Usuario eliminado');
      navigate('/dashboard/usuarios');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl mb-4 mx-auto text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Usuario no encontrado</h1>
          <p className="text-gray-600 mb-8">El usuario que buscas no existe o fue eliminado</p>
          <Link
            to="/dashboard/usuarios"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition inline-flex items-center gap-2"
          >
            <FaArrowLeft /> Volver a usuarios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/dashboard/usuarios')}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <FaArrowLeft /> Volver a usuarios
            </button>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">
              ID: {usuario._id.substring(0, 10)}...
            </span>
          </div>
          
          <h1 className="font-black text-3xl md:text-4xl text-gray-800 mb-2">
            {usuario.nombre} {usuario.apellido}
          </h1>
        </div>
        
        <button
          onClick={eliminarUsuario}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
        >
          <FaTrash /> Eliminar Usuario
        </button>
      </div>
      
      <hr className="border-gray-300 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información principal */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaFileAlt /> Información del Usuario
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <FaUser /> Nombre completo
                </p>
                <p className="text-lg font-medium text-gray-800">{usuario.nombre} {usuario.apellido}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <FaEnvelope /> Email
                </p>
                <p className="text-lg font-medium text-gray-800">{usuario.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Rol</p>
                <span className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${
                  usuario.rol === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {usuario.rol === 'admin' ? (
                    <>
                      <FaCrown /> Administrador
                    </>
                  ) : (
                    <>
                      <FaUserGraduate /> Estudiante
                    </>
                  )}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado de cuenta</p>
                <span className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${
                  usuario.status === true 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {usuario.status === true ? (
                    <>
                      <FaCheckCircle /> Activa
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> Inactiva
                    </>
                  )}
                </span>
              </div>
              
              {usuario.celular && (
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <FaPhone /> Celular
                  </p>
                  <p className="text-lg font-medium text-gray-800">{usuario.celular}</p>
                </div>
              )}
              
              {usuario.carrera && (
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <FaGraduationCap /> Carrera
                  </p>
                  <p className="text-lg font-medium text-gray-800">{usuario.carrera}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          {(usuario.direccion || usuario.cedula || usuario.nivel) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaFileAlt /> Información Adicional
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {usuario.cedula && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FaIdCard /> Cédula
                    </p>
                    <p className="text-lg font-medium text-gray-800">{usuario.cedula}</p>
                  </div>
                )}
                
                {usuario.nivel && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FaGraduationCap /> Nivel/Semestre
                    </p>
                    <p className="text-lg font-medium text-gray-800">Nivel {usuario.nivel}</p>
                  </div>
                )}
                
                {usuario.direccion && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FaMapMarkerAlt /> Dirección
                    </p>
                    <p className="text-lg font-medium text-gray-800">{usuario.direccion}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Fechas */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <FaCalendarAlt /> Fechas
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Fecha de registro</p>
                <p className="font-medium">{formatearFecha(usuario.createdAt)}</p>
              </div>
              
              {usuario.updatedAt && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaSyncAlt /> Última actualización
                  </p>
                  <p className="font-medium">{formatearFecha(usuario.updatedAt)}</p>
                </div>
              )}
              
              {usuario.lastLogin && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaSignInAlt /> Último inicio de sesión
                  </p>
                  <p className="font-medium">{formatearFecha(usuario.lastLogin)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <FaBolt /> Acciones
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/dashboard/usuarios`)}
                className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 px-4 py-3 rounded-lg text-left transition flex items-center gap-3"
              >
                <FaUsers className="text-gray-600" />
                <span>Ver todos los usuarios</span>
              </button>
              
              <button
                onClick={eliminarUsuario}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-center transition font-medium flex items-center justify-center gap-2"
              >
                <FaTrash /> Eliminar este usuario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleUsuario;