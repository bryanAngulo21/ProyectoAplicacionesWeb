import { MdDeleteForever, MdInfo,MdPublishedWithChanges } from "react-icons/md"
import {useFetch} from "../../hooks/useFetch"
import { useEffect, useState } from "react"

import { useNavigate } from 'react-router'

import { ToastContainer } from "react-toastify"


const Table = () => {

    const navigate = useNavigate()

    const fetchDataBackend = useFetch()
    const [publications, setPublications] = useState([])

    
    const listPublications = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/publicaciones`
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        const headers= {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser.state.token}`,
        }
        const response = await fetchDataBackend(url, null, "GET", headers)
        setPublications(response)
    }



    useEffect(() => {
        listPublications()
    }, [])

    
    const deletePublication = async(id) => {
    const confirmDelete = confirm("Vas a registrar la eliminacion del proyecto, ¿Estás seguro?")
        if(confirmDelete){
            const url = `${import.meta.env.VITE_BACKEND_URL}/publicacion/eliminar/${id}`
            const storedUser = JSON.parse(localStorage.getItem("auth-token"))
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedUser.state.token}`,
                }
            }
            const data ={
                finPublicacion:new Date().toString()
            }
            await fetchDataBackend(url, data, "DELETE", options.headers)
            setPublications((prevPublications) => prevPublications.filter(publication => publication._id !== id))
        }
    }

    if (publications.length === 0) {

        return (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50
            dark:bg-gray-800 dark:text-red-400" role="alert">
            <span className="font-medium">No existen registros</span>
            </div>
        )
    }

    return (
            
    <><ToastContainer/>
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
            {/* Encabezado */}
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Nombre publicacion", "Nombre propietario", "Email", "Celular", "Estado", "Acciones"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>
            

            {/* Cuerpo de la tabla */}
            <tbody>

                {
                    publications.map((publication, index) => (

                        <tr className="hover:bg-gray-300 text-center" key={publication._id}>


                            <td>{index + 1}</td>
                            <td>{publication.nombrePublicacion}</td>
                            <td>{publication.nombreAutor}</td>
                            <td>{publication.emailAutor}</td>
                            <td>{publication.celularAutor}</td>

                            <td>
                                <span className="bg-blue-100 text-green-500 text-xs 
                                font-medium mr-2 px-2.5 py-0.5 rounded
                                dark:bg-blue-900 dark:text-blue-300">
                                {publication.estadoPublicacion && "activo"}</span>
                            </td>



                            <td className='py-2 text-center'>
                                <MdPublishedWithChanges
                                    title="Actualizar"
                                    className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2
                                    hover:text-blue-600"
                                    onClick={() => navigate(`/dashboard/update/${publication._id}`)}
                                />

                                <MdInfo
                                    title="Más información"
                                    className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2
                                    hover:text-green-600"
                                    onClick={() => navigate(`/dashboard/details/${publication._id}`)}
                                />

                                <MdDeleteForever
                                    title="Eliminar"
                                    className="h-7 w-7 text-red-900 cursor-pointer inline-block
                                    hover:text-red-600"
                                    onClick={()=>{deletePublication(publication._id)}}
                                />
                            </td>
                        </tr>
                    ))
                }
            
            </tbody>
        
        </table>
        </>
    )
}

export default Table
