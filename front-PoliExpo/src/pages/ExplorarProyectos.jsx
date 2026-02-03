import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { proyectoService } from '../services/api';
import {
  FaSearch,
  FaStar,
  FaThumbsUp,
  FaEye,
  FaLightbulb,
  FaGraduationCap,
  FaCode,
  FaUser,
  FaArrowRight,
  FaFilter,
  FaTimes
} from 'react-icons/fa';

const ExplorarProyectos = () => {
  const [loading, setLoading] = useState(true);
  const [proyectos, setProyectos] = useState([]);
  const [proyectosDestacados, setProyectosDestacados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [carreraFiltro, setCarreraFiltro] = useState('todas');

  // Categorías y carreras disponibles (puedes obtenerlas de tu backend)
  const categorias = [
    { id: 'todas', nombre: 'Todas las categorías' },
    { id: 'academico', nombre: 'Académico' },
    { id: 'extracurricular', nombre: 'Extracurricular' }
  ];

  const carreras = [
    { id: 'todas', nombre: 'Todas las carreras' },
    { id: 'software', nombre: 'Tecnología Superior en Desarrollo de Software' },
    { id: 'madera', nombre: 'Tecnología Superior en Procesamiento Industrial de la Madera' },
    { id: 'agua', nombre: 'Tecnología Superior en Agua y Saneamiento Ambiental' },
    { id: 'redes', nombre: 'Tecnología Superior en Redes y Telecomunicaciones ' },
    { id: 'electromecanica', nombre: 'Tecnología Superior en Electromecánica' }
  ];

  useEffect(() => {
    cargarProyectos();
    cargarDestacados();
  }, []);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      const response = await proyectoService.getAll();
      setProyectos(response.data);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      toast.error('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const cargarDestacados = async () => {
    try {
      const response = await proyectoService.destacados();
      setProyectosDestacados(response.data);
    } catch (error) {
      console.error('Error cargando destacados:', error);
    }
  };

  const buscarProyectos = async () => {
    if (!busqueda.trim()) {
      cargarProyectos();
      return;
    }

    try {
      setLoading(true);
      const response = await proyectoService.search(busqueda);
      setProyectos(response.data);
    } catch (error) {
      console.error('Error buscando:', error);
      toast.error('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const filtrarProyectos = async (categoria) => {
    try {
      setLoading(true);
      setCategoriaFiltro(categoria);
      
      if (categoria === 'todas') {
        cargarProyectos();
      } else {
        const response = await proyectoService.porCategoria(categoria);
        setProyectos(response.data);
      }
    } catch (error) {
      console.error('Error filtrando:', error);
      toast.error('Error al filtrar');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorCarrera = async (carrera) => {
    try {
      setLoading(true);
      setCarreraFiltro(carrera);
      
      if (carrera === 'todas') {
        cargarProyectos();
      } else {
        const response = await proyectoService.porCarrera(carrera);
        setProyectos(response.data);
      }
    } catch (error) {
      console.error('Error filtrando por carrera:', error);
      toast.error('Error al filtrar');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    buscarProyectos();
  };

const handleDarLike = async (proyectoId) => {
  try {
    const response = await proyectoService.like(proyectoId);
    toast.success('Like agregado');
    
    // Recargar proyectos para obtener datos actualizados
    cargarProyectos();
  } catch (error) {
    toast.error('Error al dar like');
  }
};

  if (loading && proyectos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='font-black text-4xl text-gray-500'>Explorar Proyectos</h1>
      <hr className='my-4 border-t-2 border-gray-300' />
      <p className='mb-8'>Descubre proyectos creados por otros estudiantes</p>

      {/* BÚSQUEDA Y FILTROS */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mb-8">
        <form onSubmit={handleBuscar} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar proyectos por título, descripción o tecnología..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda('');
                    cargarProyectos();
                  }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
            >
              <FaSearch /> Buscar
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaFilter /> Categoría
            </label>
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => filtrarProyectos(cat.id)}
                  className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
                    categoriaFiltro === cat.id
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {cat.id === 'academico' ? <FaGraduationCap /> : 
                   cat.id === 'extracurricular' ? <FaStar /> : 
                   <FaFilter />}
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por carrera */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Carrera
            </label>
            <select
              value={carreraFiltro}
              onChange={(e) => filtrarPorCarrera(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PROYECTOS DESTACADOS */}
      {proyectosDestacados.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
             Proyectos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectosDestacados.slice(0, 3).map((proyecto) => (
              <div key={proyecto._id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{proyecto.titulo}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{proyecto.descripcion}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                    {proyecto.categoria}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <FaThumbsUp /> {proyecto.likes?.length || 0}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <FaEye /> {proyecto.vistas || 0}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    to={`/dashboard/details/${proyecto._id}`}
                    className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1"
                  >
                    Ver detalles <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODOS LOS PROYECTOS */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {busqueda ? `Resultados de "${busqueda}"` : 'Todos los Proyectos'}
          </h2>
          <p className="text-gray-600">
            {proyectos.length} {proyectos.length === 1 ? 'proyecto' : 'proyectos'} encontrados
          </p>
        </div>

        {proyectos.length === 0 ? (
          <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
            <FaSearch className="text-4xl mb-4 mx-auto text-gray-400" />
            <p className="text-gray-500 mb-4">No se encontraron proyectos</p>
            <button
              onClick={() => {
                setBusqueda('');
                setCategoriaFiltro('todas');
                setCarreraFiltro('todas');
                cargarProyectos();
              }}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Ver todos los proyectos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectos.map((proyecto) => (
              <div key={proyecto._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                {/* Encabezado del proyecto */}
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                        {proyecto.titulo}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded">
                          {proyecto.categoria}
                        </span>
                        {proyecto.carrera && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded">
                            {proyecto.carrera}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDarLike(proyecto._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Dar like"
                    >
                      <FaThumbsUp className="text-xl" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {proyecto.descripcion}
                  </p>
                </div>

                {/* Tecnologías */}
                {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                      <FaCode /> Tecnologías:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {proyecto.tecnologias.slice(0, 3).map((tech, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                      {proyecto.tecnologias.length > 3 && (
                        <span className="text-gray-500 text-xs">+{proyecto.tecnologias.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Estadísticas y autor */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FaThumbsUp className="text-gray-500" />
                      <span className="text-sm">{proyecto.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaEye className="text-gray-500" />
                      <span className="text-sm">{proyecto.vistas || 0}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {proyecto.autor && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaUser /> Por: {proyecto.autor.nombre}
                      </p>
                    )}
                    <Link
                      to={`/dashboard/proyecto/${proyecto._id}`}
                      className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1"
                    >
                      Ver proyecto <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INFORMACIÓN */}
      <div className="mt-10 bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" /> ¿Cómo funciona la exploración?
        </h3>
        <ul className="text-blue-700 space-y-2">
          <li className="flex items-center gap-2">• Puedes buscar proyectos por palabras clave</li>
          <li className="flex items-center gap-2">• Filtra por categoría (académico/extracurricular)</li>
          <li className="flex items-center gap-2">• Filtra por carrera del autor</li>
          <li className="flex items-center gap-2">• Dale like a los proyectos que te gusten</li>
          <li className="flex items-center gap-2">• Haz clic en "Ver proyecto" para ver todos los detalles</li>
        </ul>
      </div>
    </div>
  );
};

export default ExplorarProyectos;