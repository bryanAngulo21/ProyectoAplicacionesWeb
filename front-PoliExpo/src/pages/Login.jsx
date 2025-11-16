import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link, useNavigate } from "react-router"
import {useFetch} from '../hooks/useFetch'
import { ToastContainer } from 'react-toastify'
import { useForm } from 'react-hook-form'


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const  fetchDataBackend = useFetch()

    const loginUser = async(dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/login`
        const response = await fetchDataBackend(url, dataForm,'POST')
        if(response){
            navigate('/dashboard')
        }
    }

    return (
        <div className="font-inter min-h-screen flex justify-center items-center relative">
             <ToastContainer />

            {/* Imagen de fondo */}
            <div 
                className="absolute inset-0 bg-[url('/public/images/landscape_login.jpg')] bg-cover bg-center bg-fixed z-0"
                
            ></div>
                       
            {/* Formulario centrado */}
            <div className="relative z-20 w-full max-w-md mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    
                    <h1 className="text-3xl font-semibold text-center text-blue-500">Bienvenido</h1>
                
                    <p className="text-gray-600 text-center my-4">Por favor ingresa tus datos</p>

                    {/* Formulario */}
                     <form onSubmit={handleSubmit(loginUser)}>

                        {/* Campo Correo */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="Ingresa tu correo"
                                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition duration-200"
                            {...register("email", { required: "El correo es obligatorio" })}
                            />
                                {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                        </div>

                        {/* Campo Contraseña */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                 {...register("password", { required: "La contraseña es obligatoria" })}
                                />
                                    {errors.password && <p className="text-red-800">{errors.password.message}</p>}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Botón login 
                        <Link to="/dashboard" className="block w-full py-3 text-center bg-blue-500 text-white rounded-xl hover:bg-blue-600 duration-300 font-medium">
                            Iniciar sesión
                        </Link>*/}

                   {/* Botón login */}
                            <button className="block w-full py-3 text-center bg-blue-500 text-white rounded-xl hover:bg-blue-600 duration-300 font-medium"
                            >Iniciar sesión</button>

                    </form>


                    {/* Separador */}
                    <div className="mt-6 flex items-center text-gray-400">
                        <hr className="flex-1" />
                        <span className="px-3 text-sm">O</span>
                        <hr className="flex-1" />
                    </div>

                    {/* Botón Google */}
                    <button className="w-full mt-5 flex items-center justify-center border border-gray-300 py-3 rounded-xl text-sm hover:bg-gray-50 transition duration-200 font-medium">
                        <img className="w-5 mr-2" src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
                        Iniciar sesión con Google
                    </button>

                    {/* Enlace para olvidaste tu contraseña */}
                    <div className="mt-5 text-center border-t pt-4">
                        <Link to="/forgot/id" className="text-sm text-blue-500 hover:text-blue-700 transition duration-200">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Enlaces para volver o registrarse */}
                    <div className="mt-4 flex justify-between items-center text-sm">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 transition duration-200">Regresar</Link>
                        <Link to="/register" className="py-2 px-5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition duration-200">Registrarse</Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;