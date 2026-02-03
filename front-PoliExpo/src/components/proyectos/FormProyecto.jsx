import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { proyectoService, iaService } from '../../services/api';
import storeProyectos from '../../context/storeProyectos';
import {
  FaFileAlt,
  FaLightbulb,
  FaRobot,
  FaTools,
  FaGraduationCap,
  FaUserTie,
  FaCalendarAlt,
  FaLink,
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowLeft,
  FaGithub,
  FaRocket,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const FormProyecto = ({ modo = 'crear' }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const actualizarProyectoStore = storeProyectos(
    (state) => state.actualizarProyecto
  );

  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(modo === 'editar');
  const [generandoSugerencias, setGenerandoSugerencias] = useState(false);
  const [sugerenciasTitulos, setSugerenciasTitulos] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);
  const [nuevaTecnologia, setNuevaTecnologia] = useState('');
  const [mostrarIA, setMostrarIA] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      titulo: '',
      descripcion: '',
      categoria: 'academico',
      carrera: '',
      nivel: 1,
      fechaInicio: new Date().toISOString().split('T')[0],
      estado: 'en_proceso',
      publico: true,
      docenteNombre: '',
      docenteEmail: '',
      asignatura: '',
      repositorio: '',
      enlaceDemo: ''
    }
  });

  // =============================
  // CARGAR PROYECTO PARA EDITAR
  // =============================
  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarProyectoParaEditar();
    }
  }, [id, modo]);

  const cargarProyectoParaEditar = async () => {
    try {
      setCargandoDatos(true);
      const { data: proyecto } = await proyectoService.getById(id);

      if (!proyecto) throw new Error('Proyecto no encontrado');

      setTecnologias(proyecto.tecnologias || []);
      
      // Preparar datos para el formulario
      reset({
        titulo: proyecto.titulo || '',
        descripcion: proyecto.descripcion || '',
        categoria: proyecto.categoria || 'academico',
        carrera: proyecto.carrera || '',
        nivel: proyecto.nivel || 1,
        fechaInicio: proyecto.fechaInicio
          ? new Date(proyecto.fechaInicio).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        estado: proyecto.estado || 'en_proceso',
        publico: proyecto.publico !== false,
        docenteNombre: proyecto.docente?.nombre || '',
        docenteEmail: proyecto.docente?.email || '',
        asignatura: proyecto.asignatura || '',
        repositorio: proyecto.repositorio || '',
        enlaceDemo: proyecto.enlaceDemo || ''
      });
      
      
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar el proyecto');
      navigate('/dashboard/listar');
    } finally {
      setCargandoDatos(false);
    }
  };

  // Agregar tecnología
  const agregarTecnologia = () => {
    if (nuevaTecnologia.trim() && !tecnologias.includes(nuevaTecnologia.trim())) {
      setTecnologias([...tecnologias, nuevaTecnologia.trim()]);
      setNuevaTecnologia('');
    }
  };

  // Eliminar tecnología
  const eliminarTecnologia = (index) => {
    const nuevasTecnologias = [...tecnologias];
    nuevasTecnologias.splice(index, 1);
    setTecnologias(nuevasTecnologias);
  };

  // Generar sugerencias de IA
  const generarSugerenciasIA = async () => {
    const descripcion = watch('descripcion');
    
    if (!descripcion.trim()) {
      toast.error('Escribe una descripción para generar sugerencias');
      return;
    }

    try {
      setGenerandoSugerencias(true);
      const response = await iaService.suggestTitles({
        descripcion,
        tecnologias
      });
      setSugerenciasTitulos(response.data.titulos);
      setMostrarIA(true);
    } catch (error) {
      toast.error('Error generando sugerencias');
    } finally {
      setGenerandoSugerencias(false);
    }
  };

  // Seleccionar sugerencia de IA
  const seleccionarSugerencia = (titulo) => {
    setValue('titulo', titulo);
    toast.info('Título actualizado');
  };

  // Enviar formulario - VERSIÓN SIMPLIFICADA Y FUNCIONAL
  const onSubmit = async (data) => {
    if (tecnologias.length === 0) {
      toast.error('Agrega al menos una tecnología');
      return;
    }

    setLoading(true);
    try {
      const proyectoData = {
        ...data,
        tecnologias,
        nivel: parseInt(data.nivel),
        fechaInicio: new Date(data.fechaInicio).toISOString(),
        docente: data.docenteNombre ? {
          nombre: data.docenteNombre,
          email: data.docenteEmail
        } : undefined
      };

      if (modo === 'crear') {
        const response = await proyectoService.create(proyectoData);
        toast.success('Proyecto creado exitosamente');
        navigate('/dashboard/listar');
      } else {
        const response = await proyectoService.update(id, proyectoData);

        // CLAVE: sincronizar store con lo que devuelve el backend
        actualizarProyectoStore(response.data);

        toast.success('Proyecto actualizado exitosamente');
        navigate('/dashboard/listar');
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.msg ||
        `Error al ${modo === 'crear' ? 'crear' : 'actualizar'} el proyecto`
      );
    } finally {
      setLoading(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  const tituloActual = watch('titulo');

  return (
    <div>
      <ToastContainer />
      
      <h1 className='font-black text-4xl text-gray-500 flex items-center gap-2'>
        
        {modo === 'crear' ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
      </h1>
      <hr className='my-4 border-t-2 border-gray-300' />
      <p className='mb-8'>
        {modo === 'crear' 
          ? 'Comparte tu trabajo académico o extracurricular con la comunidad'
          : `Editando: ${tituloActual || 'Proyecto'}`
        }
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaFileAlt /> Información Básica
          </h2>
          
          {/* Título del proyecto */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Título del Proyecto *
              </label>
              <button
                type="button"
                onClick={() => setMostrarIA(!mostrarIA)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {mostrarIA ? (
                  <>
                    <FaTimesCircle /> Ocultar IA
                  </>
                ) : (
                  <>
                    <FaLightbulb /> Sugerencias con IA
                  </>
                )}
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Ej: Sistema de gestión académica basado en React y Node.js"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              {...register("titulo", { 
                required: "El título es obligatorio",
                minLength: { value: 10, message: "Mínimo 10 caracteres" }
              })}
            />
            {errors.titulo && (
              <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
            )}
          </div>

          {/* Sugerencias de IA */}
          {mostrarIA && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <FaRobot /> Sugerencias de IA
                </h3>
                <button
                  type="button"
                  onClick={generarSugerenciasIA}
                  disabled={generandoSugerencias}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                >
                  {generandoSugerencias ? (
                    <>
                      <FaSpinner className="animate-spin" /> Generando...
                    </>
                  ) : (
                    'Generar sugerencias'
                  )}
                </button>
              </div>
              
              {sugerenciasTitulos.length > 0 ? (
                <div className="space-y-2">
                  {sugerenciasTitulos.map((titulo, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white border border-blue-100 rounded hover:bg-blue-50 cursor-pointer transition"
                      onClick={() => seleccionarSugerencia(titulo)}
                    >
                      <p className="text-gray-800">{titulo}</p>
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle /> Haz clic para usar este título
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-blue-700 text-sm flex items-center gap-2">
                  <FaInfoCircle /> Escribe una descripción y haz clic en "Generar sugerencias"
                </p>
              )}
            </div>
          )}

          {/* Descripción */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción Detallada *
            </label>
            <textarea
              placeholder="Describe tu proyecto: objetivos, metodología, resultados esperados..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 h-40"
              {...register("descripcion", { 
                required: "La descripción es obligatoria",
                minLength: { value: 50, message: "Mínimo 50 caracteres" }
              })}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Categoría y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("categoria", { required: true })}
              >
                <option value="academico">Académico</option>
                <option value="extracurricular">Extracurricular</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado del Proyecto *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("estado", { required: true })}
              >
                <option value="en_proceso">En proceso</option>
                <option value="finalizado">Finalizado</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: TECNOLOGÍAS */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaTools /> Tecnologías Utilizadas
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Agregar Tecnologías *
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={nuevaTecnologia}
                onChange={(e) => setNuevaTecnologia(e.target.value)}
                placeholder="Ej: React, Node.js, MongoDB, Python"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarTecnologia())}
              />
              <button
                type="button"
                onClick={agregarTecnologia}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Lista de tecnologías */}
          {tecnologias.length > 0 ? (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Tecnologías agregadas:</p>
              <div className="flex flex-wrap gap-2">
                {tecnologias.map((tech, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg flex items-center gap-2"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => eliminarTecnologia(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm flex items-center gap-2">
                <FaExclamationTriangle /> Debes agregar al menos una tecnología utilizada en el proyecto
              </p>
            </div>
          )}
        </div>

        {/* SECCIÓN 3: INFORMACIÓN ACADÉMICA */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaGraduationCap /> Información Académica
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Carrera *
              </label>
              <input
                type="text"
                placeholder="Ej: Desarrollo de Software"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("carrera", { required: "La carrera es obligatoria" })}
              />
              {errors.carrera && (
                <p className="text-red-500 text-sm mt-1">{errors.carrera.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Semestre *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("nivel", { required: true })}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}> {n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Asignatura (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: Aplicaciones Web, Base de Datos"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("asignatura")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("fechaInicio", { required: true })}
              />
            </div>
          </div>

          {/* Información del docente */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaUserTie /> Información del Docente (opcional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Nombre del docente</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                  {...register("docenteNombre")}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email del docente</label>
                <input
                  type="email"
                  placeholder="correo@epn.edu.ec"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                  {...register("docenteEmail")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: ENLACES Y VISIBILIDAD */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaLink /> Enlaces y Visibilidad
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaGithub /> Repositorio (opcional)
              </label>
              <input
                type="url"
                placeholder="https://github.com/usuario/proyecto"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("repositorio")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaRocket /> Demo en vivo (opcional)
              </label>
              <input
                type="url"
                placeholder="https://midemo.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("enlaceDemo")}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 text-red-600 rounded focus:ring-red-400"
                {...register("publico")}
              />
              <span className="text-gray-700 flex items-center gap-2">
                <FaGlobe /> Hacer proyecto público (visible para todos los usuarios)
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Si desmarcas esta opción, solo tú podrás ver el proyecto
            </p>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || tecnologias.length === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 ${
              loading || tecnologias.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                {modo === 'crear' ? 'Creando proyecto...' : 'Actualizando proyecto...'}
              </>
            ) : (
              <>
                <FaCheckCircle />
                {modo === 'crear' ? 'Crear Proyecto' : 'Actualizar Proyecto'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard/listar')}
            className="py-3 px-6 rounded-lg font-semibold text-lg border border-gray-300 hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FaArrowLeft /> Cancelar
          </button>
        </div>

        {/* INFORMACIÓN ADICIONAL */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500" />
            {modo === 'crear' ? 'Consejos para un buen proyecto' : 'Consejos para editar tu proyecto'}
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li className="flex items-center gap-2">• Sé claro y específico en el título y descripción</li>
            <li className="flex items-center gap-2">• Incluye todas las tecnologías que utilizaste</li>
            <li className="flex items-center gap-2">• Si es un proyecto académico, completa la información del docente</li>
            <li className="flex items-center gap-2">• Agrega enlaces a repositorio y demo si están disponibles</li>
            {modo === 'crear' && <li className="flex items-center gap-2">• Usa la IA para obtener sugerencias creativas de títulos</li>}
            {modo === 'editar' && <li className="flex items-center gap-2">• Actualiza el estado del proyecto según su progreso actual</li>}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default FormProyecto;