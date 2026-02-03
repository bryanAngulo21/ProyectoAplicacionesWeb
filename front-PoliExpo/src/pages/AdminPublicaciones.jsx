import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { proyectoService } from '../services/api';
import {
  FaFileAlt,
  FaFolder,
  FaEye,
  FaTrash,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaSearch
} from 'react-icons/fa';

const AdminPublicaciones = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      const response = await proyectoService.getAll();
      setProyectos(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const eliminarProyecto = async (id, titulo) => {
    if (!confirm(`¿Estás seguro de eliminar el proyecto "${titulo}"?`)) return;
    
    try {
      await proyectoService.delete(id);
      toast.success('Proyecto eliminado');
      // Actualizar la lista localmente en lugar de recargar todo
      setProyectos(proyectos.filter(proyecto => proyecto._id !== id));
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 403) {
        toast.error('No tienes permisos para eliminar este proyecto');
      } else if (error.response?.status === 404) {
        toast.error('El proyecto no existe');
      } else {
        toast.error('Error al eliminar proyecto');
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className='font-black text-3xl md:text-4xl text-gray-800 mb-2 flex items-center gap-2'>
         Gestión de Proyectos
      </h1>
      <div className="w-20 h-1 bg-red-600 mb-6"></div>
      <p className='mb-8 text-gray-600 flex items-center gap-2'>
         Administra todos los proyectos de la plataforma ({proyectos.length} proyectos)
      </p>

      {/* Tabla de proyectos */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
             Todos los proyectos
          </h2>
        </div>

        {proyectos.length === 0 ? (
          <div className="p-12 text-center">
            <FaFolder className="text-gray-400 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No hay proyectos</h3>
            <p className="text-gray-500">Aún no se han creado proyectos en la plataforma.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaFileAlt /> Título
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaUser /> Autor
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">Estado</th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FaCalendar /> Fecha
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.map((proyecto) => (
                  <tr key={proyecto._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-800">{proyecto.titulo}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {proyecto.descripcion}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {proyecto.autor ? (
                        <div>
                          <p className="text-gray-800 flex items-center gap-2">
                            <FaUser /> {proyecto.autor.nombre}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <FaEnvelope /> {proyecto.autor.email}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 flex items-center gap-2">
                          <FaSearch /> —
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${
                        proyecto.estado === 'publicado' 
                          ? 'bg-green-100 text-green-800'
                          : proyecto.estado === 'finalizado'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {proyecto.estado === 'publicado' ? (
                          <>
                             Publicado
                          </>
                        ) : proyecto.estado === 'finalizado' ? (
                          <>
                             Finalizado
                          </>
                        ) : (
                          <>
                             En proceso
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm flex items-center gap-2">
                      <FaCalendar /> {formatearFecha(proyecto.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/proyecto/${proyecto._id}`}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded text-sm font-medium transition flex items-center gap-2"
                          title="Ver proyecto"
                        >
                          <FaEye /> Ver
                        </Link>
                        <button
                          onClick={() => eliminarProyecto(proyecto._id, proyecto.titulo)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded text-sm font-medium transition flex items-center gap-2"
                          title="Eliminar proyecto"
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

export default AdminPublicaciones;