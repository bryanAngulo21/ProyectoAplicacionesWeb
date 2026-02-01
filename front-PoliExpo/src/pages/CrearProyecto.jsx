import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { proyectoService, iaService } from '../services/api';

const CrearProyecto = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generandoSugerencias, setGenerandoSugerencias] = useState(false);
  const [sugerenciasTitulos, setSugerenciasTitulos] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);
  const [nuevaTecnologia, setNuevaTecnologia] = useState('');
  const [mostrarIA, setMostrarIA] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
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

    setGenerandoSugerencias(true);
    try {
      const response = await iaService.suggestTitles({
        descripcion,
        tecnologias
      });
      
      setSugerenciasTitulos(response.data.titulos);
      setMostrarIA(true);
      toast.success('Sugerencias generadas');
    } catch (error) {
      console.error('Error generando sugerencias:', error);
      toast.error('Error al generar sugerencias');
    } finally {
      setGenerandoSugerencias(false);
    }
  };

  // Seleccionar sugerencia de IA
  const seleccionarSugerencia = (titulo) => {
    setValue('titulo', titulo);
    setMostrarIA(false);
    toast.success('Título seleccionado');
  };

  // Enviar formulario
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

      await proyectoService.create(proyectoData);
      toast.success('Proyecto creado exitosamente');
      
      setTimeout(() => {
        navigate('/dashboard/listar');
      }, 2000);
      
    } catch (error) {
      console.error('Error creando proyecto:', error);
      toast.error(error.response?.data?.msg || 'Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      
      <h1 className='font-black text-4xl text-gray-500'>Crear Nuevo Proyecto</h1>
      <hr className='my-4 border-t-2 border-gray-300' />
      <p className='mb-8'>Comparte tu trabajo académico o extracurricular con la comunidad</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📝 Información Básica</h2>
          
          {/* Título del proyecto */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Título del Proyecto *
              </label>
              <button
                type="button"
                onClick={() => setMostrarIA(!mostrarIA)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {mostrarIA ? 'Ocultar IA' : ' Sugerencias con IA'}
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Ej: Sistema de gestión académica basado en React y Node.js"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              {...register("titulo", { 
                required: "El título es obligatorio",
                minLength: { value: 5, message: "Mínimo 5 caracteres" }
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
                <h3 className="font-semibold text-blue-800">Sugerencias de IA</h3>
                <button
                  type="button"
                  onClick={generarSugerenciasIA}
                  disabled={generandoSugerencias}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {generandoSugerencias ? 'Generando...' : 'Generar sugerencias'}
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
                      <p className="text-xs text-blue-600 mt-1">Haz clic para usar este título</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-700 text-sm">
                  Escribe una descripción y haz clic en "Generar sugerencias"
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
                minLength: { value: 40, message: "Mínimo 40 caracteres" }
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
          <h2 className="text-xl font-bold text-gray-800 mb-6">🛠️ Tecnologías Utilizadas</h2>
          
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
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
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
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                Debes agregar al menos una tecnología utilizada en el proyecto
              </p>
            </div>
          )}
        </div>

        {/* SECCIÓN 3: INFORMACIÓN ACADÉMICA */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6"> Información Académica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Carrera *
              </label>
              <input
                type="text"
                placeholder="Ej: Ingeniería en Sistemas"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("carrera", { required: "La carrera es obligatoria" })}
              />
              {errors.carrera && (
                <p className="text-red-500 text-sm mt-1">{errors.carrera.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nivel / Semestre *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("nivel", { required: true })}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>Nivel {n}</option>
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
                placeholder="Ej: Desarrollo Web, Base de Datos"
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
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Información del Docente (opcional)</h3>
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
                  placeholder="correo@institucion.edu.ec"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                  {...register("docenteEmail")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: ENLACES Y VISIBILIDAD */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Enlaces y Visibilidad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Repositorio (opcional)
              </label>
              <input
                type="url"
                placeholder="https://github.com/usuario/proyecto"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                {...register("repositorio")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Demo en vivo (opcional)
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
                defaultChecked
              />
              <span className="text-gray-700">
                Hacer proyecto público (visible para todos los usuarios)
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
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-lg transition ${
              loading || tecnologias.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></span>
                Creando proyecto...
              </>
            ) : 'Crear Proyecto'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard/listar')}
            className="py-3 px-6 rounded-lg font-semibold text-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>

        {/* INFORMACIÓN ADICIONAL */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">💡 Consejos para un buen proyecto</h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• Sé claro y específico en el título y descripción</li>
            <li>• Incluye todas las tecnologías que utilizaste</li>
            <li>• Si es un proyecto académico, completa la información del docente</li>
            <li>• Agrega enlaces a repositorio y demo si están disponibles</li>
            <li>• Usa la IA para obtener sugerencias creativas de títulos</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default CrearProyecto;