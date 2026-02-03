import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { proyectoService } from '../services/api';
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaFileAlt,
  FaTools,
  FaComments,
  FaEye,
  FaThumbsUp,
  FaChartBar,
  FaCalendarAlt,
  FaInfoCircle,
  FaGraduationCap,
  FaLink,
  FaGithub,
  FaRocket,
  FaUser,
  FaBook,
  FaStar,
  FaCalendar,
  FaUserTie,
  FaExternalLinkAlt
} from 'react-icons/fa';

const DetalleProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComentario, setLoadingComentario] = useState(false);
  
  // Obtener datos del usuario actual
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    cargarProyecto();
    // Obtener usuario actual del localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUsuarioActual(userData);
  }, [id]);

  const cargarProyecto = async () => {
    try {
      setLoading(true);
      const response = await proyectoService.getById(id);
      setProyecto(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el proyecto');
      navigate('/dashboard/explorar');
    } finally {
      setLoading(false);
    }
  };

  const handleDarLike = async () => {
    // Verificar si el usuario está autenticado
    if (!usuarioActual) {
      toast.error('Debes iniciar sesión para dar like');
      navigate('/login');
      return;
    }

    setLoadingLike(true);
    try {
      const response = await proyectoService.like(id);
      toast.success('¡Like agregado!');
      cargarProyecto(); // Recargar para obtener datos actualizados
    } catch (error) {
      console.error('Error al dar like:', error);
      toast.error('Error al dar like');
    } finally {
      setLoadingLike(false);
    }
  };

  const handleQuitarLike = async () => {
    if (!usuarioActual) {
      toast.error('Debes iniciar sesión para quitar like');
      navigate('/login');
      return;
    }

    setLoadingLike(true);
    try {
      const response = await proyectoService.unlike(id);
      toast.success('Like removido');
      cargarProyecto(); // Recargar para obtener datos actualizados
    } catch (error) {
      console.error('Error al quitar like:', error);
      toast.error('Error al quitar like');
    } finally {
      setLoadingLike(false);
    }
  };

  const handleAgregarComentario = async (e) => {
    e.preventDefault();
    
    if (!nuevoComentario.trim()) {
      toast.error('Escribe un comentario');
      return;
    }

    setLoadingComentario(true);
    try {
      await proyectoService.addComment(id, nuevoComentario);
      toast.success('Comentario agregado');
      setNuevoComentario('');
      cargarProyecto();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      toast.error('Error al agregar comentario');
    } finally {
      setLoadingComentario(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const yaDioLike = () => {
    if (!usuarioActual || !proyecto?.likes) {
      return false;
    }
    
    // Verificar si el usuario actual está en el array de likes
    // Dependiendo de cómo esté estructurado tu backend, podría ser:
    // 1. Un array de IDs de usuario
    // 2. Un array de objetos con _id
    // 3. Un array de strings con los IDs
    
    const userId = usuarioActual._id || usuarioActual.id;
    
    // Intentar diferentes formas de verificar
    if (Array.isArray(proyecto.likes)) {
      // Si likes es un array de IDs de usuario (strings)
      if (proyecto.likes.includes(userId)) {
        return true;
      }
      
      // Si likes es un array de objetos con propiedad _id
      const likeDelUsuario = proyecto.likes.find(like => {
        if (typeof like === 'object' && like !== null) {
          return like._id === userId || like.id === userId || like.usuario === userId;
        }
        return false;
      });
      
      return !!likeDelUsuario;
    }
    
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBook className="text-6xl mb-4 mx-auto text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Proyecto no encontrado</h1>
          <p className="text-gray-600 mb-8">El proyecto que buscas no existe o fue eliminado</p>
          <Link
            to="/dashboard/explorar"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition inline-flex items-center gap-2"
          >
            <FaArrowLeft /> Volver a explorar proyectos
          </Link>
        </div>
      </div>
    );
  }

  const usuarioDioLike = yaDioLike();

  return (
    <div>
      <ToastContainer />
      
      {/* CABECERA */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/dashboard/explorar')}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                <FaArrowLeft /> Volver
              </button>
            </div>
            
            <h1 className="font-black text-3xl md:text-4xl text-gray-800 mb-2">
              {proyecto.titulo}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600">
              <span>Por <strong>{proyecto.autor?.nombre} {proyecto.autor?.apellido}</strong></span>
              <span>•</span>
              <span>Publicado el {formatearFecha(proyecto.createdAt)}</span>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-2">
            {usuarioActual ? (
              <button
                onClick={usuarioDioLike ? handleQuitarLike : handleDarLike}
                disabled={loadingLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  usuarioDioLike 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {loadingLike ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
                ) : usuarioDioLike ? (
                  <>
                    <FaHeart /> Quitar like
                  </>
                ) : (
                  <>
                    <FaRegHeart /> Dar like
                  </>
                )}
                <span className="font-bold">({proyecto.likes?.length || 0})</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                <FaRegHeart /> Inicia sesión para dar like
              </Link>
            )}
          </div>
        </div>
        
        <hr className="border-gray-300" />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA - CONTENIDO PRINCIPAL */}
        <div className="lg:col-span-2">
          {/* DESCRIPCIÓN */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaFileAlt className="text-gray-600" /> Descripción del Proyecto
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {proyecto.descripcion}
              </p>
            </div>
          </div>

          {/* TECNOLOGÍAS */}
          {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaTools className="text-gray-600" /> Tecnologías Utilizadas
              </h2>
              <div className="flex flex-wrap gap-3">
                {proyecto.tecnologias.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* COMENTARIOS */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaComments className="text-gray-600" /> Comentarios ({proyecto.comentarios?.length || 0})
              </h2>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <FaEye /> {proyecto.vistas || 0} vistas
                </span>
                <span className="flex items-center gap-1">
                  <FaThumbsUp /> {proyecto.likes?.length || 0} likes
                </span>
              </div>
            </div>

            {/* FORMULARIO DE COMENTARIO */}
            {usuarioActual ? (
              <form onSubmit={handleAgregarComentario} className="mb-8">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Agregar un comentario
                  </label>
                  <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Comparte tu opinión sobre este proyecto..."
                    className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[100px]"
                    rows="3"
                    maxLength="500"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {nuevoComentario.length}/500 caracteres
                    </span>
                    <button
                      type="submit"
                      disabled={loadingComentario || !nuevoComentario.trim()}
                      className={`px-6 py-2 rounded-lg font-medium transition inline-flex items-center gap-2 ${
                        loadingComentario || !nuevoComentario.trim()
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gray-800 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {loadingComentario ? 'Publicando...' : (
                        <>
                          <FaComments /> Publicar comentario
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700">
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Inicia sesión
                  </Link> para poder comentar en este proyecto.
                </p>
              </div>
            )}

            {/* LISTA DE COMENTARIOS */}
            <div className="space-y-6">
              {proyecto.comentarios && proyecto.comentarios.length > 0 ? (
                proyecto.comentarios.map((comentario, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
                          <FaUser className="text-red-600 text-lg" />
                        </div>
                      </div>
                      
                      {/* Contenido del comentario */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {comentario.estudiante?.nombre || 'Usuario'} {comentario.estudiante?.apellido || ''}
                            </p>
                            {comentario.estudiante?.email && (
                              <p className="text-sm text-gray-500">{comentario.estudiante.email}</p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatearFecha(comentario.fecha || comentario.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mt-2">{comentario.texto}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaComments className="text-4xl mb-4 mx-auto text-gray-300" />
                  <p className="text-gray-500">No hay comentarios aún</p>
                  <p className="text-gray-400 text-sm mt-1">¡Sé el primero en comentar!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resto del código se mantiene igual... */}
        {/* COLUMNA DERECHA - INFORMACIÓN LATERAL */}
        <div className="space-y-6">
          {/* ESTADÍSTICAS */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <FaChartBar className="text-gray-600" /> Estadísticas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <FaEye className="text-gray-500" /> Vistas
                </span>
                <span className="font-bold text-lg">{proyecto.vistas || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <FaThumbsUp className="text-gray-500" /> Likes
                </span>
                <span className="font-bold text-lg">{proyecto.likes?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <FaComments className="text-gray-500" /> Comentarios
                </span>
                <span className="font-bold text-lg">{proyecto.comentarios?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500" /> Creado
                </span>
                <span className="font-semibold">{new Date(proyecto.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* INFORMACIÓN DEL PROYECTO */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <FaInfoCircle className="text-gray-600" /> Información del Proyecto
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  {proyecto.categoria === 'academico' ? (
                    <>
                      <FaBook className="text-gray-600" /> Académico
                    </>
                  ) : (
                    <>
                      <FaStar className="text-gray-600" /> Extracurricular
                    </>
                  )}
                </p>
              </div>
              
              {proyecto.carrera && (
                <div>
                  <p className="text-sm text-gray-500">Carrera</p>
                  <p className="font-medium flex items-center gap-2">
                    <FaGraduationCap className="text-gray-600" /> {proyecto.carrera}
                  </p>
                </div>
              )}
              
              {proyecto.nivel && (
                <div>
                  <p className="text-sm text-gray-500">Nivel</p>
                  <p className="font-medium">Nivel {proyecto.nivel}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                  proyecto.estado === 'publicado' 
                    ? 'bg-green-100 text-green-800'
                    : proyecto.estado === 'finalizado'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {proyecto.estado}
                </span>
              </div>
              
              {proyecto.fechaInicio && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de inicio</p>
                  <p className="font-medium flex items-center gap-2">
                    <FaCalendar className="text-gray-600" /> {new Date(proyecto.fechaInicio).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {proyecto.fechaFin && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de finalización</p>
                  <p className="font-medium flex items-center gap-2">
                    <FaCalendar className="text-gray-600" /> {new Date(proyecto.fechaFin).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* INFORMACIÓN DEL DOCENTE */}
          {proyecto.docente && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <FaUserTie className="text-gray-600" /> Docente
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{proyecto.docente.nombre}</p>
                </div>
                
                {proyecto.docente.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{proyecto.docente.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ENLACES EXTERNOS */}
          {(proyecto.repositorio || proyecto.enlaceDemo) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <FaLink className="text-gray-600" /> Enlaces
              </h3>
              <div className="space-y-3">
                {proyecto.repositorio && (
                  <a
                    href={proyecto.repositorio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition group"
                  >
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <FaGithub className="text-white text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-red-600">Repositorio</p>
                      <p className="text-xs text-gray-500 truncate">{proyecto.repositorio}</p>
                    </div>
                    <FaExternalLinkAlt className="text-gray-400 group-hover:text-gray-600" />
                  </a>
                )}
                
                {proyecto.enlaceDemo && (
                  <a
                    href={proyecto.enlaceDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition group"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <FaRocket className="text-white text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-red-600">Demo en vivo</p>
                      <p className="text-xs text-gray-500 truncate">{proyecto.enlaceDemo}</p>
                    </div>
                    <FaExternalLinkAlt className="text-gray-400 group-hover:text-gray-600" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleProyecto;