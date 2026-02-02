import { useState } from "react"
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc"; // Icono de Google más moderno

import { Link, useNavigate } from "react-router"
import { useFetch } from '../hooks/useFetch'
import { ToastContainer } from 'react-toastify'
import { useForm } from 'react-hook-form'

// Importamos el servicio de autenticación
import { authService } from "../services/api"

//proteccion de rutas
import storeAuth from "../context/storeAuth"

import logoPoliExpo from '../assets/logo-PoliExpo3.png'


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const fetchDataBackend = useFetch()

    const { setToken, setRol } = storeAuth()

    // Login tradicional
     const loginUser = async (dataForm) => {
        setLoading(true);
        
        // Usar tu hook useFetch (ya tienes declarado fetchDataBackend arriba)
        const url = `${import.meta.env.VITE_BACKEND_URL}/login`;
        const response = await fetchDataBackend(url, dataForm, 'POST');
        
        if (response) {
            // Almacenar token y rol
            setToken(response.token);
            setRol(response.rol);
            
            // Guardar datos adicionales en localStorage si es necesario
            localStorage.setItem('userData', JSON.stringify({
                nombre: response.nombre,
                apellido: response.apellido,
                email: response.email,
                rol: response.rol,
                fotoPerfil: response.fotoPerfil,
                _id: response._id
            }));
            
            // Redirigir al dashboard
            navigate('/dashboard');
        }
        
        setLoading(false);
    }

    // Login con Google
    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        authService.googleAuth();
        // La redirección se maneja automáticamente
    }

    return (
        <div className="font-inter min-h-screen flex justify-center items-center relative bg-black">
            <ToastContainer />

            {/* Imagen de fondo */}
            <div 
                className="absolute inset-0 bg-[url('/public/images/landscape_login.webp')] bg-cover bg-center opacity-40"
            ></div>

            {/* Formulario */}
            <div className="relative z-20 w-full max-w-md mx-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 ">

                    <div className="flex flex-col items-center justify-center gap-4">
                        <img src={logoPoliExpo} alt="logo" className="w-20 h-20" />
                        <h1 className="text-3xl font-semibold text-red-600 text-center">
                            Bienvenido
                        </h1>
                    </div>
                    

                    <p className="text-gray-500 text-center my-4">
                        Por favor ingresa tus datos
                    </p>


                <form onSubmit={handleSubmit(loginUser)}>

                    {/* Campo Correo */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-semibold mb-2 text-gray-900">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 flex items-center h-full text-gray-400">
                                <MdEmail size={20} />
                            </span>
                            <input
                                type="email"
                                placeholder="Ingresa tu correo"
                                className="w-full rounded-lg border border-gray-300 py-2 px-3 pl-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                {...register("email", { 
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Ingresa un correo válido"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                 {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Campo Contraseña */}
                    <div className="mb-6 relative">
                        <label className="block text-sm font-semibold mb-2 text-gray-900">
                            Contraseña
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 flex items-center h-full text-gray-400">
                                <MdLock size={20} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="************"
                                className="w-full rounded-lg border border-gray-300 py-2 px-3 pl-10 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                {...register("password", { 
                                    required: "La contraseña es obligatoria",
                                    
                                })}
                            />

                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                     {errors.password.message}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-red-500 transition-colors duration-200"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Botón Login */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-red-700 text-white py-3 w-full rounded-xl mt-5 hover:bg-black duration-300 hover:scale-105 transition-all flex items-center justify-center gap-2 ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Procesando...
                            </>
                        ) : 'Iniciar sesión'}
                    </button>
                </form>

                    {/* Separador */}
                    <div className="mt-6 flex items-center text-gray-500">
                        <hr className="flex-1 border-gray-300" />
                        <span className="px-3 text-sm text-gray-500">O continúa con</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>

                    {/* Botón Google - Actualizado */}
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className={`w-full mt-4 flex items-center justify-center border border-gray-300 py-3 rounded-xl text-sm hover:bg-gray-50 transition font-medium text-gray-700 ${
                            googleLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {googleLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
                                Redirigiendo a Google...
                            </>
                        ) : (
                            <>
                                <FcGoogle className="text-xl mr-2" />
                                Iniciar sesión con Google
                            </>
                        )}
                    </button>

                    {/* Enlace olvidar contraseña */}
                    <div className="mt-5 text-center border-t pt-4 border-gray-200">
                        <Link to="/forgot/id" className="text-sm text-red-600 hover:text-red-800 transition">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Enlaces inferior */}
                    <div className="mt-4 flex justify-between items-center text-sm">
                        <Link to="/" className="text-gray-600 hover:text-red-600 transition">
                             ← Volver al inicio
                        </Link>

                        <Link
                            to="/register"
                            className="py-2 px-5 bg-black text-white rounded-xl hover:bg-red-600 transition hover:scale-105"
                        >
                            Registrarse
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;