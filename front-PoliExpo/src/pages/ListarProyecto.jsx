import { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router'
import { toast } from "react-toastify"
import { proyectoService } from '../services/api'

const ListarProyecto = () => {
    const navigate = useNavigate()
    const [proyectos, setProyectos] = useState([])
    const [loading, setLoading] = useState(true)

    const listarProyectos = async () => {
        try {
            setLoading(true)
            // Obtener proyectos del usuario actual
            const response = await proyectoService.getAll()
            // Filtrar proyectos del usuario actual (esto es temporal, idealmente backend debe tener endpoint)
            const proyectosUsuario = response.data.filter(p => 
                p.autor && p.autor._id === JSON.parse(localStorage.getItem('userData'))?._id
            )
            setProyectos(proyectosUsuario)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al cargar proyectos')
        } finally {
            setLoading(false)
        }
    }

    const eliminarProyecto = async (id) => {
        const confirmDelete = confirm("¿Estás seguro de eliminar este proyecto?")
        if (confirmDelete) {
            try {
                await proyectoService.delete(id)
                toast.success('Proyecto eliminado')
                setProyectos(prev => prev.filter(proyecto => proyecto._id !== id))
            } catch (error) {
                console.error('Error:', error)
                toast.error('Error al eliminar proyecto')
            }
        }
    }

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES')
    }

    useEffect(() => {
        listarProyectos()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        )
    }

    if (proyectos.length === 0) {
        return (
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Mis Proyectos</h1>
                <hr className='my-4 border-t-2 border-gray-300' />
                <p className='mb-8'>Este módulo te permite gestionar tus proyectos</p>
                
                <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
                    <span className="text-4xl mb-4 block">📭</span>
                    <p className="text-gray-500 mb-4">No tienes proyectos creados</p>
                    <Link 
                        to="/dashboard/create" 
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        ¡Crea tu primer proyecto!
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Mis Proyectos</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Este módulo te permite gestionar tus proyectos</p>

            <div className="overflow-x-auto">
                <table className="w-full mt-5 table-auto shadow-lg bg-white">
                    {/* Encabezado */}
                    <thead className="bg-gray-800 text-slate-400">
                        <tr>
                            {["N°", "Título", "Categoría", "Estado", "Fecha", "Acciones"].map((header) => (
                                <th key={header} className="p-3 text-left">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    
                    {/* Cuerpo de la tabla */}
                    <tbody>
                        {proyectos.map((proyecto, index) => (
                            <tr className="hover:bg-gray-50 border-b" key={proyecto._id}>
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">
                                    <div>
                                        <p className="font-medium text-gray-800">{proyecto.titulo}</p>
                                        <p className="text-sm text-gray-500 line-clamp-1">{proyecto.descripcion}</p>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded">
                                        {proyecto.categoria}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        proyecto.estado === 'publicado' 
                                            ? 'bg-green-100 text-green-800'
                                            : proyecto.estado === 'finalizado'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {proyecto.estado}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-600">{formatFecha(proyecto.createdAt)}</td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/dashboard/proyecto/${proyecto._id}`)}
                                            className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded text-sm"
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => navigate(`/dashboard/update/${proyecto._id}`)}
                                            className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 px-3 py-1 rounded text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarProyecto(proyecto._id)}
                                            className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Resumen */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                    Total de proyectos: <span className="font-bold">{proyectos.length}</span> | 
                    Publicados: <span className="font-bold text-green-600">
                        {proyectos.filter(p => p.estado === 'publicado').length}
                    </span> | 
                    En proceso: <span className="font-bold text-yellow-600">
                        {proyectos.filter(p => p.estado === 'en_proceso').length}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default ListarProyecto