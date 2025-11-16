import {Link} from 'react-router'
import { useForm } from 'react-hook-form';
import { useFetch } from '../hooks/useFetch'

import { ToastContainer} from 'react-toastify'

export const Forgot = () => {
    const fetchDataBackend = useFetch()

    const { register, handleSubmit, formState: { errors } } = useForm()

    const sendMail = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`
        await fetchDataBackend(url, dataForm,'POST')
    }
    return (
        <div className="min-h-screen flex justify-center items-center relative">

            {/* Imagen de fondo */}
            <div 
                className="absolute inset-0 bg-[url('/public/images/landscape_forgot.jpg')] bg-cover bg-center bg-fixed z-0"
            ></div>
            
            
            
            {/* Formulario centrado */}
            <div className="relative z-20 w-full max-w-md mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    
                    <h1 className="text-3xl font-semibold mb-2 text-center text-gray-700">Recupera tu contraseña</h1>
                    
                    <p className="text-gray-600 text-center mb-6 text-sm">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                    </p>
                 <ToastContainer/>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit(sendMail)}>

                        {/* Campo correo electrónico */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Correo electrónico</label>
                            <input type="email" placeholder="Ingresa un correo electrónico válido" className="block w-full rounded-md border border-gray-300 py-1 px-1.5 text-gray-500"
                            {...register("email", { required: "El correo electrónico es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                        </div>

                        {/* Botón Enviar correo */}
                        <div className="mb-6">
                            <button 
                                className="bg-gray-700 text-white py-3 w-full rounded-xl hover:bg-gray-900 duration-300 font-medium transition-all hover:scale-105"
                            >
                                Enviar correo de recuperación
                            </button>
                        </div>

                    </form>

                    {/* Separador */}
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Enlace para iniciar sesión */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm">¿Ya posees una cuenta?</p>
                        <Link 
                            to="/login" 
                            className="py-2 px-6 bg-gray-600 text-white rounded-xl hover:bg-gray-900 duration-300 font-medium transition-all hover:scale-105 text-center w-full sm:w-auto"
                        >
                            Iniciar sesión
                        </Link>
                    </div>

                    {/* Enlace adicional para volver al inicio */}
                    <div className="mt-6 text-center">
                        <Link 
                            to="/" 
                            className="text-gray-500 hover:text-gray-700 text-sm transition duration-200"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}