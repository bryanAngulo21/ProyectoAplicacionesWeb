import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router"

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen flex justify-center items-center relative">
            
            {/* Imagen de fondo */}
            <div 
                className="absolute inset-0 bg-[url('/public/images/landscape_register.jpg')] bg-cover bg-center bg-fixed z-0"
            ></div>
            
            
            
            {/* Formulario centrado */}
            <div className="relative z-20 w-full max-w-2xl mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    
                    <h1 className="text-3xl font-semibold mb-2 text-center text-orange-700">Bienvenido</h1>

                    <small className="text-black-400 block my-3 text-sm text-center">Por favor ingresa tus datos</small> 
                    
                    {/* Formulario */}
                    <form>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Campo nombre */}
                            <div className="mb-3">
                                <label className="mb-2 block text-sm font-semibold">Nombre</label>
                                <input 
                                    type="text" 
                                    placeholder="Ingresa tu nombre" 
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                />
                            </div>

                            {/* Campo apellido */}
                            <div className="mb-3">
                                <label className="mb-2 block text-sm font-semibold">Apellido</label>
                                <input 
                                    type="text" 
                                    placeholder="Ingresa tu apellido" 
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                />
                            </div>
                        </div>

                        {/* Campo dirección */}
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Dirección</label>
                            <input 
                                type="text" 
                                placeholder="Ingresa tu dirección de domicilio" 
                                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Campo celular */}
                            <div className="mb-3">
                                <label className="mb-2 block text-sm font-semibold">Celular</label>
                                <input 
                                    type="text" 
                                    inputMode="tel" 
                                    placeholder="Ingresa tu celular" 
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                                />
                            </div>

                            {/* Campo correo electrónico */}
                            <div className="mb-3">
                                <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                                <input 
                                    type="email" 
                                    placeholder="Ingresa tu correo electrónico" 
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                                />
                            </div>
                        </div>

                        {/* Campo Contraseña */}
                        <div className="mb-3">
                            <label className="block text-sm font-semibold mb-2">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                />
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

                        {/* Botón Register */}
                        <div className="mb-3">
                            <button 
                                type="button"
                                className="bg-orange-700 text-white border py-3 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 font-medium"
                            >
                                Registrarse
                            </button>
                        </div>

                    </form>

                    {/* Enlace para iniciar sesión si ya tiene una cuenta */}
                    <div className="mt-6 text-sm flex justify-between items-center">
                        <p className="text-gray-600">¿Ya posees una cuenta?</p>
                        <Link 
                            to="/login" 
                            className="py-2 px-5 bg-gray-600 text-white border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 font-medium"
                        >
                            Iniciar sesión
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}