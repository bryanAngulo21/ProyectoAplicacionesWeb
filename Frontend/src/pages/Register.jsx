import { useState, useEffect } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router"
import MotivationalImage from "../components/MotivationalImage";


export const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [backgroundImage, setBackgroundImage] = useState(null)
    const [loaded, setLoaded] = useState(false) // Para fade-in

    // Solo se ejecuta una vez al montar el componente
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const url = await getRandomImage("motivational")
                setBackgroundImage(url)
            } catch (error) {
                console.error("Error cargando la imagen:", error)
            }
        }
        fetchImage()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gray-100">
            {/* Fondo estático detrás de todo */}
            <div 
                className="absolute inset-0 bg-[url('/public/images/landscape_register.jpg')] bg-cover bg-center bg-fixed z-0"
            ></div>

            {/* Contenedor principal */}
            <div className="relative z-20 flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                
                {/* Formulario a la izquierda */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                    <h1 className="text-3xl font-semibold mb-2 text-center text-orange-700">Bienvenido</h1>
                    <small className="text-black-400 block mb-6 text-sm text-center">
                        Por favor ingresa tus datos
                    </small> 

                    <form className="space-y-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Nombre</label>
                            <input type="text" placeholder="Ingresa tu nombre" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Apellido</label>
                            <input type="text" placeholder="Ingresa tu apellido" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                        </div>

                        {/* Dirección */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Dirección</label>
                            <input type="text" placeholder="Ingresa tu dirección" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Celular */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">Celular</label>
                                <input type="text" inputMode="tel" placeholder="Ingresa tu celular" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                            </div>

                            {/* Correo */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
                                <input type="email" placeholder="Ingresa tu correo" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Contraseña</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="************" 
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                                >
                                    {showPassword ? <MdVisibilityOff size={20}/> : <MdVisibility size={20}/>}
                                </button>
                            </div>
                        </div>

                        {/* Botón */}
                        <button type="button" className="w-full py-3 mt-5 bg-orange-700 text-white rounded-xl hover:bg-gray-900 transition transform hover:scale-105">Registrarse</button>
                    </form>

                    {/* Enlace para login */}
                    <div className="mt-6 text-sm flex justify-between items-center">
                        <p className="text-gray-600">¿Ya posees una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-gray-600 text-white rounded-xl hover:bg-gray-900 transition">Iniciar sesión</Link>
                    </div>
                </div>

                {/* Panel de imagen a la derecha */}
                <MotivationalImage />

                

            </div>
        </div>
    )
}
