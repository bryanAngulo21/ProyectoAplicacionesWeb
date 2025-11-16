export default function Panel() {

  const inputCls = "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* MÉTRICAS GENERALES */}
      <h1 className='font-black text-2xl text-gray-500'>Métricas generales</h1>
      <hr className='my-4 border-t-2 border-gray-300' />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Trabajos académicos</p>
          <p className="text-3xl font-semibold text-gray-800">32</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Proyectos extracurriculares</p>
          <p className="text-3xl font-semibold text-gray-800">8</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Horas dedicadas</p>
          <p className="text-3xl font-semibold text-gray-800">124</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Reconocimientos</p>
          <p className="text-3xl font-semibold text-gray-800">5</p>
        </div>
      </section>


      {/* GESTIÓN */}
      <h1 className='font-black text-2xl text-gray-500'>Gestión de Trabajos y Proyectos</h1>
      <hr className='my-4 border-t-2 border-gray-300' />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORMULARIO */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Registrar nuevo trabajo o proyecto</h2>
          <hr className="mb-4" />

          <form className="space-y-3">

            <div>
              <label className="text-sm text-gray-600" htmlFor="titulo">Título</label>
              <input id="titulo" className={inputCls} placeholder="Ej: Proyecto de robótica" />
            </div>

            <div>
              <label className="text-sm text-gray-600" htmlFor="categoria">Categoría</label>
              <select id="categoria" className={inputCls}>
                <option>Seleccionar...</option>
                <option>Académico</option>
                <option>Extracurricular</option>
                <option>Investigación</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600" htmlFor="inicio">Fecha de inicio</label>
                <input type="date" id="inicio" className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-gray-600" htmlFor="entrega">Fecha de entrega</label>
                <input type="date" id="entrega" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600" htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" className={inputCls} rows="3" placeholder="Breve descripción del trabajo..."></textarea>
            </div>

            <button type="button" className="w-full bg-gray-800 text-white rounded-md py-2 hover:bg-gray-700">
              Guardar trabajo
            </button>

          </form>
        </div>

        {/* LISTADO */}
        <div className="bg-white rounded-lg shadow p-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h2 className="text-xl font-semibold text-gray-700">Trabajos recientes</h2>
            <button type="button" className="bg-gray-800 text-white rounded-md py-2 px-4 hover:bg-gray-700 w-full sm:w-auto">
              Actualizar
            </button>
          </div>

          <hr className="mb-4" />

          <ul className="divide-y">
            <li className="py-3 flex justify-between">
              <div>
                <p className="font-medium text-gray-800">Proyecto Arduino</p>
                <p className="text-sm text-gray-600">Categoría: Académico</p>
                <p className="text-sm text-gray-600">Estado: En progreso</p>
              </div>
              <span className="text-xs bg-gray-300 font-bold px-2 py-1 rounded self-center">2025-10-11</span>
            </li>

            <li className="py-3 flex justify-between">
              <div>
                <p className="font-medium text-gray-800">Club de Innovación - Mini dron</p>
                <p className="text-sm text-gray-600">Categoría: Extracurricular</p>
                <p className="text-sm text-gray-600">Estado: Finalizado</p>
              </div>
              <span className="text-xs bg-gray-300 font-bold px-2 py-1 rounded self-center">2025-08-28</span>
            </li>
          </ul>

        </div>

      </section>


      {/* RECONOCIMIENTO FACIAL */}
      <h1 className='font-black text-2xl text-gray-500 mt-12'>Reconocimiento Facial</h1>
      <hr className='my-4 border-t-2 border-gray-300' />

      <section className="bg-white rounded-lg shadow p-4 mb-12">

        <h2 className="text-xl font-semibold text-gray-700 mb-3">Validación de identidad</h2>
        <p className="text-sm text-gray-600 mb-4">Utiliza esta herramienta para registrar o validar tu rostro dentro del sistema.</p>

        <div className="flex flex-col md:flex-row gap-6 items-center">

          {/* Vista previa */}
          <div className="w-full md:w-1/2 bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
            Vista previa de cámara
          </div>

          {/* Botones */}
          <div className="w-full md:w-1/2 space-y-3">
            <button className="w-full bg-gray-800 text-white rounded-md py-2 hover:bg-gray-700">Iniciar cámara</button>
            <button className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-500">Capturar rostro</button>
            <button className="w-full bg-green-600 text-white rounded-md py-2 hover:bg-green-500">Validar identidad</button>
          </div>

        </div>
      </section>

    </div>
  );
}
