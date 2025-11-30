export default function Panel() {

  const inputCls =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* MÉTRICAS GENERALES */}
      <div className="mb-8">
        <h1 className="font-black text-3xl text-black tracking-wide">Métricas generales</h1>
        <hr className="border-gray-300 mt-2" />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Trabajos académicos</p>
          <p className="text-3xl font-semibold text-gray-800">32</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Proyectos extracurriculares</p>
          <p className="text-3xl font-semibold text-gray-800">8</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Horas dedicadas</p>
          <p className="text-3xl font-semibold text-gray-800">124</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Reconocimientos</p>
          <p className="text-3xl font-semibold text-gray-800">5</p>
        </div>
      </section>

      {/* GESTIÓN */}
      <div className="mb-8">
        <h1 className="font-black text-3xl text-black tracking-wide">
          Gestión de Trabajos y Proyectos
        </h1>
        <hr className="border-gray-300 mt-2" />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

        {/* FORMULARIO */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Registrar nuevo trabajo o proyecto
          </h2>
          <hr className="mb-4 border-gray-300" />

          <form className="space-y-4">

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <textarea id="descripcion" className={inputCls} rows="3" placeholder="Breve descripción..." />
            </div>

            <button
              type="button"
              className="w-full bg-gray-800 text-white rounded-md py-2 hover:bg-gray-700"
            >
              Guardar trabajo
            </button>

          </form>
        </div>

        {/* LISTADO */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Trabajos recientes</h2>
            <button className="bg-gray-800 text-white rounded-md py-2 px-4 hover:bg-gray-700 w-full sm:w-auto">
              Actualizar
            </button>
          </div>

          <hr className="mb-4 border-gray-300" />

          <ul className="divide-y">
            <li className="py-4 flex justify-between">
              <div>
                <p className="font-medium text-gray-800">Proyecto Arduino</p>
                <p className="text-sm text-gray-600">Categoría: Académico</p>
                <p className="text-sm text-gray-600">Estado: En progreso</p>
              </div>
              <span className="text-xs bg-gray-300 font-bold px-2 py-1 rounded self-center">
                2025-10-11
              </span>
            </li>

            <li className="py-4 flex justify-between">
              <div>
                <p className="font-medium text-gray-800">Mini dron – Club de Innovación</p>
                <p className="text-sm text-gray-600">Categoría: Extracurricular</p>
                <p className="text-sm text-gray-600">Estado: Finalizado</p>
              </div>
              <span className="text-xs bg-gray-300 font-bold px-2 py-1 rounded self-center">
                2025-08-28
              </span>
            </li>
          </ul>

        </div>
      </section>


     
    </div>
  );
}
