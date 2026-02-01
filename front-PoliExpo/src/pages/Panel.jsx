import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import storeAuth from '../context/storeAuth';
import storeProfile from '../context/storeProfile';

// Importamos los servicios
import { dashboardService, proyectoService } from '../services/api';

const Panel = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  
  const { rol } = storeAuth();
  const { user } = storeProfile();

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      
      // Cargar datos del dashboard según el rol
      let dashboardResponse;
      if (rol === 'admin') {
        dashboardResponse = await dashboardService.getAdminDashboard();
      } else {
        dashboardResponse = await dashboardService.getStudentDashboard();
      }
      
      setStats(dashboardResponse.data.data);
      
      // Cargar algunos proyectos
      const proyectosResponse = await proyectoService.getAll();
      setProyectos(proyectosResponse.data.slice(0, 4));
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      toast.error('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
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

  const isAdmin = rol === 'admin';

  return (
    <div>
      {/* ENCABEZADO */}
      <div className="mb-8">
        <h1 className='font-black text-4xl text-gray-500'>
          Dashboard {isAdmin ? 'Administrador' : 'Estudiante'}
        </h1>
        <hr className='my-4 border-t-2 border-gray-300' />
        
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Bienvenido</p>
            <p className="font-semibold">{user?.nombre} {user?.apellido}</p>
          </div>
          
          <div className={`px-4 py-2 rounded-lg ${isAdmin ? 'bg-red-100' : 'bg-blue-100'}`}>
            <p className="text-sm">Rol:</p>
            <p className={`font-semibold ${isAdmin ? 'text-red-800' : 'text-blue-800'}`}>
              {rol}
            </p>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS PRINCIPALES */}
      <div className="mb-10">
        <h2 className='font-bold text-2xl text-gray-700 mb-4'>Resumen</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tarjeta 1 - Proyectos */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {isAdmin ? 'Total Proyectos' : 'Mis Proyectos'}
              </h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {isAdmin 
                ? stats?.resumen?.totalProyectos || 0
                : stats?.resumen?.totalProyectos || 0
              }
            </p>
            {isAdmin && (
              <p className="text-sm text-gray-500 mt-2">
                Publicados: {stats?.resumen?.proyectosPublicados || 0}
              </p>
            )}
          </div>

          {/* Tarjeta 2 - Estudiantes o Vistas */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {isAdmin ? 'Estudiantes' : 'Vistas'}
              </h3>
              <span className="text-2xl">{isAdmin ? '👥' : '👁️'}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {isAdmin 
                ? stats?.resumen?.totalEstudiantes || 0
                : stats?.resumen?.totalVistas || 0
              }
            </p>
          </div>

          {/* Tarjeta 3 - Donaciones */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {isAdmin ? 'Donaciones' : 'Likes'}
              </h3>
              <span className="text-2xl">{isAdmin ? '💰' : '👍'}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {isAdmin 
                ? stats?.resumen?.totalDonaciones || 0
                : stats?.resumen?.totalLikes || 0
              }
            </p>
            {isAdmin && (
              <p className="text-sm text-gray-500 mt-2">
                Total: ${stats?.resumen?.montoTotalDonaciones?.toFixed(2) || '0.00'}
              </p>
            )}
          </div>

          {/* Tarjeta 4 - Específica por rol */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {isAdmin ? 'Categorías' : 'Mis Donaciones'}
              </h3>
              <span className="text-2xl">{isAdmin ? '🏷️' : '💝'}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {isAdmin 
                ? stats?.categorias?.length || 0
                : stats?.resumen?.totalDonacionesPropias || 0
              }
            </p>
            {!isAdmin && (
              <p className="text-sm text-gray-500 mt-2">
                ${stats?.resumen?.montoTotalDonado?.toFixed(2) || '0.00'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ACCIONES RÁPIDAS */}
      <div className="mb-10">
        <h2 className='font-bold text-2xl text-gray-700 mb-4'>Acciones Rápidas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Crear Proyecto - Para todos */}
          <Link
            to="/dashboard/create"
            className="bg-gray-800 border border-gray-700 p-6 rounded-lg hover:bg-gray-700 transition text-center"
          >
            <div className="text-white">
              <span className="text-3xl block mb-3">📝</span>
              <h3 className="font-semibold text-lg mb-2">Crear Proyecto</h3>
              <p className="text-gray-300 text-sm">Comparte tu trabajo académico</p>
            </div>
          </Link>

          {/* Mis Publicaciones - Para todos */}
          <Link
            to="/dashboard/list"
            className="bg-gray-800 border border-gray-700 p-6 rounded-lg hover:bg-gray-700 transition text-center"
          >
            <div className="text-white">
              <span className="text-3xl block mb-3">📋</span>
              <h3 className="font-semibold text-lg mb-2">Mis Publicaciones</h3>
              <p className="text-gray-300 text-sm">Gestiona tus proyectos</p>
            </div>
          </Link>

          {/* Acción específica por rol */}
          {isAdmin ? (
            <Link
              to="#"
              className="bg-red-800 border border-red-700 p-6 rounded-lg hover:bg-red-700 transition text-center"
              onClick={() => toast.info('Funcionalidad de administrador')}
            >
              <div className="text-white">
                <span className="text-3xl block mb-3">⚙️</span>
                <h3 className="font-semibold text-lg mb-2">Panel Admin</h3>
                <p className="text-red-200 text-sm">Gestionar sistema</p>
              </div>
            </Link>
          ) : (
            <Link
              to="#"
              className="bg-blue-800 border border-blue-700 p-6 rounded-lg hover:bg-blue-700 transition text-center"
              onClick={() => toast.info('Funcionalidad de estudiante')}
            >
              <div className="text-white">
                <span className="text-3xl block mb-3">🔍</span>
                <h3 className="font-semibold text-lg mb-2">Explorar</h3>
                <p className="text-blue-200 text-sm">Ver proyectos</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* PROYECTOS RECIENTES */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className='font-bold text-2xl text-gray-700'>
            {isAdmin ? 'Proyectos Recientes' : 'Proyectos Destacados'}
          </h2>
          <Link 
            to={isAdmin ? "#" : "/dashboard/explorar"} 
            className="text-gray-600 hover:text-gray-800"
          >
            Ver todos →
          </Link>
        </div>

        {proyectos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proyectos.map((proyecto) => (
              <div key={proyecto._id} className="bg-white border border-gray-200 p-5 rounded-lg hover:shadow-md transition">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{proyecto.titulo}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{proyecto.descripcion}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded">
                      {proyecto.categoria}
                    </span>
                    {isAdmin && proyecto.autor && (
                      <p className="text-xs text-gray-500 mt-1">
                        Por: {proyecto.autor.nombre}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <span className="text-gray-500 text-sm">👍 {proyecto.likes?.length || 0}</span>
                    <span className="text-gray-500 text-sm">👁️ {proyecto.vistas || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
            <p className="text-gray-500">No hay proyectos disponibles</p>
            {!isAdmin && (
              <Link 
                to="/dashboard/create" 
                className="text-gray-600 hover:text-gray-800 underline mt-2 inline-block"
              >
                Crear primer proyecto
              </Link>
            )}
          </div>
        )}
      </div>

      {/* SECCIÓN ESPECÍFICA PARA ADMIN */}
      {isAdmin && stats?.ultimasDonaciones?.length > 0 && (
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h2 className='font-bold text-xl text-gray-700 mb-4'>Donaciones Recientes</h2>
          
          <div className="space-y-4">
            {stats.ultimasDonaciones.slice(0, 3).map((donacion) => (
              <div key={donacion._id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {donacion.donante?.nombre} {donacion.donante?.apellido}
                    </p>
                    {donacion.mensaje && (
                      <p className="text-sm text-gray-500 mt-1">"{donacion.mensaje}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${donacion.monto.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(donacion.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Panel;