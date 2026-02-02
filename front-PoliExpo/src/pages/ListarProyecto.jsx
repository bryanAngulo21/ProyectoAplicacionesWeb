import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from 'react-router'
import { toast } from "react-toastify"
import { proyectoService } from '../services/api'
import storeProyectos from '../context/storeProyectos'

const ListarProyecto = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [proyectos, setProyectos] = useState([])
    const [loading, setLoading] = useState(true)
    const [filtro, setFiltro] = useState('todos')

    // Usar store de Zustand
    const proyectosStore = storeProyectos((state) => state.proyectos)
    const setProyectosStore = storeProyectos((state) => state.setProyectos)

    // Función para cargar proyectos
    const listarProyectos = async () => {
        try {
            setLoading(true)
            const response = await proyectoService.getAll()
            const todosProyectos = response.data || []
            
            // Obtener ID del usuario actual
            const userData = JSON.parse(localStorage.getItem('userData'))
            const userId = userData?._id
            
            if (!userId) {
                toast.error('Usuario no autenticado')
                navigate('/login')
                return
            }
            
            // Filtrar proyectos del usuario actual
            const proyectosUsuario = todosProyectos.filter(p => 
                p.autor && (p.autor._id === userId || p.autor === userId)
            )
            
            setProyectos(proyectosUsuario)
            
            // Actualizar store con todos los proyectos
            setProyectosStore(todosProyectos)
            
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al cargar proyectos')
        } finally {
            setLoading(false)
        }
    }

    // Cargar proyectos cuando el componente se monta
    useEffect(() => {
        listarProyectos()
    }, [location.key]) // Recargar cuando cambie la navegación

    const eliminarProyecto = async (id) => {
        const confirmDelete = confirm("¿Estás seguro de eliminar este proyecto?")
        if (confirmDelete) {
            try {
                await proyectoService.delete(id)
                toast.success('Proyecto eliminado')
                
                // Actualizar lista localmente
                setProyectos(prev => prev.filter(proyecto => proyecto._id !== id))
                
                // Actualizar store
                setProyectosStore(prev => prev.filter(proyecto => proyecto._id !== id))
                
            } catch (error) {
                console.error('Error:', error)
                toast.error('Error al eliminar proyecto')
            }
        }
    }

    const filtrarProyectos = () => {
        switch(filtro) {
            case 'publicados':
                return proyectos.filter(p => p.estado === 'publicado')
            case 'en_proceso':
                return proyectos.filter(p => p.estado === 'en_proceso')
            case 'finalizados':
                return proyectos.filter(p => p.estado === 'finalizado')
            default:
                return proyectos
        }
    }

    const proyectosFiltrados = filtrarProyectos()
    
    const formatFecha = (fecha) => {
        try {
            return new Date(fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        } catch {
            return 'Fecha no disponible'
        }
    }

    if (loading && proyectos.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    <p className="mt-4 text-gray-600">Cargando proyectos...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className='font-black text-4xl text-gray-500'>Mis Proyectos</h1>
                    <p className='text-gray-600 mt-2'>Gestiona todos tus proyectos académicos</p>
                </div>
                <Link
                    to="/dashboard/crear"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                    + Nuevo Proyecto
                </Link>
            </div>
            
            <hr className='my-4 border-t-2 border-gray-300' />

            {/* Filtros y estadísticas */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFiltro('todos')}
                            className={`px-4 py-2 rounded-lg transition ${filtro === 'todos' 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Todos ({proyectos.length})
                        </button>
                        <button
                            onClick={() => setFiltro('publicados')}
                            className={`px-4 py-2 rounded-lg transition ${filtro === 'publicados' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Publicados ({proyectos.filter(p => p.estado === 'publicado').length})
                        </button>
                        <button
                            onClick={() => setFiltro('en_proceso')}
                            className={`px-4 py-2 rounded-lg transition ${filtro === 'en_proceso' 
                                ? 'bg-yellow-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            En proceso ({proyectos.filter(p => p.estado === 'en_proceso').length})
                        </button>
                        <button
                            onClick={() => setFiltro('finalizados')}
                            className={`px-4 py-2 rounded-lg transition ${filtro === 'finalizados' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Finalizados ({proyectos.filter(p => p.estado === 'finalizado').length})
                        </button>
                    </div>
                    
                    <button
                        onClick={listarProyectos}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <span>🔄</span>
                        Actualizar lista
                    </button>
                </div>
            </div>

            {proyectosFiltrados.length === 0 ? (
                <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
                    <span className="text-4xl mb-4 block">📭</span>
                    <p className="text-gray-500 mb-4">
                        {filtro === 'todos' 
                            ? 'No tienes proyectos creados' 
                            : `No tienes proyectos ${filtro === 'publicados' ? 'publicados' : filtro === 'en_proceso' ? 'en proceso' : 'finalizados'}`
                        }
                    </p>
                    {filtro === 'todos' && (
                        <Link 
                            to="/dashboard/crear" 
                            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
                        >
                            ¡Crea tu primer proyecto!
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Título</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Categoría</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {proyectosFiltrados.map((proyecto) => (
                                    <tr key={proyecto._id} className="hover:bg-gray-50 transition">
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-medium text-gray-800">{proyecto.titulo}</p>
                                                <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                                    {proyecto.descripcion}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded">
                                                {proyecto.categoria === 'academico' ? 'Académico' : 'Extracurricular'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                proyecto.estado === 'publicado' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : proyecto.estado === 'finalizado'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {proyecto.estado === 'en_proceso' ? 'En proceso' : 
                                                 proyecto.estado === 'finalizado' ? 'Finalizado' : 
                                                 'Publicado'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 text-sm">
                                            {formatFecha(proyecto.createdAt)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/dashboard/proyecto/${proyecto._id}`)}
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded text-sm flex items-center gap-1 transition"
                                                    title="Ver detalles"
                                                >
                                                    👁️ Ver
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/dashboard/actualizar/${proyecto._id}`)}
                                                    className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-3 py-2 rounded text-sm flex items-center gap-1 transition"
                                                    title="Editar"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => eliminarProyecto(proyecto._id)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded text-sm flex items-center gap-1 transition"
                                                    title="Eliminar"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Resumen */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-800">{proyectos.length}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Publicados</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {proyectos.filter(p => p.estado === 'publicado').length}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">En proceso</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {proyectos.filter(p => p.estado === 'en_proceso').length}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Finalizados</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {proyectos.filter(p => p.estado === 'finalizado').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ListarProyecto