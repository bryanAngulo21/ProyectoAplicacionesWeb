import { Link, Outlet, useLocation } from 'react-router'
import storeAuth from '../context/storeAuth'
import storeProfile from '../context/storeProfile'

const Dashboard = () => {
    const location = useLocation()
    const urlActual = location.pathname

    const { clearToken } = storeAuth()
    const { user } = storeProfile()

    return (
        <div className='md:flex md:min-h-screen bg-black text-white'>

                {/* Menú lateral */}
                <div className='md:w-1/5 bg-black px-5 py-6 shadow-lg'>

                    <h2 className='text-4xl font-black text-center text-white tracking-wide'>PoliExpo</h2>

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

                    {/* Links sin bordes rojos */}
                    <ul className="mt-5 space-y-2">

                        <li className="text-center">
                            <Link to='/dashboard'
                                className={`${urlActual === '/dashboard'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                                    block text-lg font-medium px-4 py-2 rounded-md transition`}
                            >
                                Dashboard
                            </Link>
                        </li>

                        <li className="text-center">
                            <Link to='/dashboard/profile'
                                className={`${urlActual === '/dashboard/profile'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                                    block text-lg font-medium px-4 py-2 rounded-md transition`}
                            >
                                Perfil
                            </Link>
                        </li>

                        <li className="text-center">
                            <Link to='/dashboard/facerecognition'
                                className={`${urlActual === '/dashboard/facerecognition'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                                    block text-lg font-medium px-4 py-2 rounded-md transition`}
                            >
                                Reconocimiento facial
                            </Link>
                        </li>

                        <li className="text-center">
                            <Link to='/dashboard/list'
                                className={`${urlActual === '/dashboard/list'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                                    block text-lg font-medium px-4 py-2 rounded-md transition`}
                            >
                                Lista de Publicaciones
                            </Link>
                        </li>

                        <li className="text-center">
                            <Link to='/dashboard/create'
                                className={`${urlActual === '/dashboard/create'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                                    block text-lg font-medium px-4 py-2 rounded-md transition`}
                            >
                                Publicar
                            </Link>
                        </li>

                        <li className="text-center">
                            <Link to='/dashboard/chat'
                                className={`${urlActual === '/dashboard/chat'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                                    block text-lg font-medium px-4 py-2 rounded-md transition`}
                            >
                                Contactar con otros usuarios
                            </Link>
                        </li>

                    </ul>

                </div>

                {/* Panel derecho */}
                <div className='flex-1 flex flex-col justify-between h-screen bg-white text-black'>

                    {/* Barra superior sin líneas rojas */}
                    <div className='bg-black py-3 flex items-center md:justify-end justify-center gap-5 px-6'>

                        <div className='text-md font-semibold text-white'>
                            Usuario - {user?.nombre}
                        </div>

                        <img 
                            src="https://cdn-icons-png.flaticon.com/128/863/863823.png" 
                            alt="img-client" 
                            className="border-2 border-gray-600 rounded-full" 
                            width={50} height={50} 
                        />

                        <Link
                            to='/'
                            onClick={() => clearToken()}
                            className="bg-red-700 hover:bg-red-900 px-4 py-1 text-white rounded-lg font-medium transition"
                        >
                            Salir
                        </Link>

                    </div>

                    {/* Contenido */}
                    <div className='overflow-y-scroll p-8'>
                        <Outlet />
                    </div>

                    {/* Footer */}
                    <div className='bg-black h-12'>
                        <p className='text-center text-white leading-[3rem] font-light'>
                            Todos los derechos reservados
                        </p>
                    </div>

                </div>

            </div>

    )
}

export default Dashboard
