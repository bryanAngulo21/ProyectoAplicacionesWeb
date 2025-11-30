import { Link, Outlet, useLocation } from 'react-router'
import storeAuth from '../context/storeAuth'
import storeProfile from '../context/storeProfile'

import logoPoliExpo from '../assets/logo-PoliExpo3.png'
import { MdOutlineDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

import { MdOutlinePublish } from "react-icons/md";
import { MdPublishedWithChanges } from "react-icons/md";
import { VscOpenPreview } from "react-icons/vsc";
import { FaRegComment } from "react-icons/fa";
import { MdLogout } from 'react-icons/md';

const Dashboard = () => {
    const location = useLocation()
    const urlActual = location.pathname

    const { clearToken } = storeAuth()
    const { user } = storeProfile()

    return (
        <div className='md:flex md:min-h-screen bg-black text-white'>

                {/* Menú lateral */}

                <div className='md:w-1/5 bg-black px-5 py-6 shadow-lg'>
                    <div className="flex items-center gap-4">
                        <img src={logoPoliExpo} alt="logo" className="w-20 h-20" />
                        <h1 className="text-2xl font-extrabold text-red-800">
                            Poli<span className="text-white">Expo</span>
                        </h1>
                    </div>


                <img 
                    src="https://cdn-icons-png.flaticon.com/128/1688/1688400.png" 
                    alt="img-client" 
                    className="m-auto mt-8 p-1 border-2 border-gray-600 rounded-full shadow-lg" 
                    width={120} height={120}
                />

                {/* Bienvenida */}
                <p className='text-gray-300 text-center my-4 text-sm'>
                    <span className='bg-green-600 w-3 h-3 inline-block rounded-full mr-1'></span>
                    Bienvenido - {user?.nombre}
                </p>

                <p className='text-gray-300 text-center my-2 text-sm'>
                    Rol - {user?.rol}
                </p>

                <hr className="mt-5 border-gray-700" />

                {/* Links */}
                <ul className="mt-5 space-y-2">

                    <li>
                        <Link
                            to='/dashboard'
                            className={`flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-md transition
                            ${urlActual === '/dashboard'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                            `}
                        >
                            <MdOutlineDashboard /> 
                            Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link 
                            to='/dashboard/profile'
                            className={`flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-md transition
                            ${urlActual === '/dashboard/profile'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                            `}
                        >
                            <CgProfile />
                            Perfil
                        </Link>
                    </li>

                    <li>
                        <Link 
                            to='/dashboard/facerecognition'
                            className={`flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-md transition
                            ${urlActual === '/dashboard/facerecognition'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                            `}
                        >
                            <MdPublishedWithChanges />
                            Mis Publicaciones
                        </Link>
                    </li>

                    <li>
                        <Link 
                            to='/dashboard/list'
                            className={`flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-md transition
                            ${urlActual === '/dashboard/list'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                            `}
                        >
                            <VscOpenPreview />
                            Otras Publicaciones
                        </Link>
                    </li>

                    <li>
                        <Link 
                            to='/dashboard/create'
                            className={`flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-md transition
                            ${urlActual === '/dashboard/create'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                            `}
                        >
                            <MdOutlinePublish />
                            Publicar
                        </Link>
                    </li>

                    <li>
                        <Link 
                            to='/dashboard/chat'
                            className={`flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-md transition
                            ${urlActual === '/dashboard/chat'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                            `}
                        >
                            <FaRegComment />
                            Contactar 
                        </Link>
                    </li>

                </ul>


                </div>


                {/* Panel derecho */}
                <div className='flex-1 flex flex-col justify-between h-screen bg-white text-black'>

                    {/* Barra superior */}
                        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 backdrop-blur-md py-3 px-6 flex items-center justify-center md:justify-end gap-6 shadow-md">

                        {/* Nombre del usuario */}
                        <div className="text-white text-md font-semibold hover:text-gray-300 cursor-pointer transition-colors">
                            Usuario - <span className="text-gray-300">{user?.nombre}</span>
                        </div>

                        {/* Separador vertical */}
                        <div className="border-l border-gray-600 h-6"></div>

                        {/* Imagen del usuario */}
                        <img 
                            src="https://cdn-icons-png.flaticon.com/128/863/863823.png" 
                            alt="img-client" 
                            className="w-12 h-12 rounded-full border-2 border-gray-500 object-cover hover:scale-105 transition-transform cursor-pointer" 
                        />

                        {/* Separador vertical */}
                        <div className="border-l border-gray-600 h-6"></div>

                        {/* Botón Salir con ícono */}
                        <Link
                            to="/"
                            onClick={() => clearToken()}
                            className="flex items-center gap-2 bg-red-800 hover:bg-red-600 px-4 py-1 rounded-lg font-medium text-white transition-shadow shadow-sm"
                        >
                            <MdLogout size={20} /> Salir
                        </Link>

                        </div>

                    {/* Contenido */}
                    <div className='overflow-y-scroll p-8'>
                        <Outlet />
                    </div>

                    {/* Footer */}
                    <div className='bg-black h-12'>
                        <p className='text-center text-white leading-[3rem] font-light'>
                            PoliEXPO - Todos los derechos reservados
                        </p>
                    </div>

                </div>

            </div>

    )
}

export default Dashboard
