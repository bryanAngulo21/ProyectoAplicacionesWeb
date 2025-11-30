import { Link } from 'react-router'
import { useForm } from 'react-hook-form';
import { useFetch } from '../hooks/useFetch'
import { ToastContainer } from 'react-toastify'
import logoPoliExpo from '../assets/logo-PoliExpo3.png'


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
                className="absolute inset-0 bg-[url('/public/images/landscape_forgot.jpg')] bg-cover bg-center bg-fixed z-0 opacity-70"

            ></div>

            {/* Formulario centrado */}
            <div className="relative z-20 w-full max-w-md mx-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    <div className="flex flex-col items-center justify-center gap-4">
                        <img src={logoPoliExpo} alt="logo" className="w-20 h-20" />
                            <h1 className="text-3xl font-semibold text-red-600 text-center">
                                Recupera tu contraseña
                            </h1>
                    </div>
                                        
                    <small className="block my-3 text-sm text-center text-gray-500">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña

                    </small>
                    
                    <ToastContainer/>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit(sendMail)}>

                        {/* Campo correo electrónico */}
                        <div className="mb-6 relative">
                            <label className="block text-sm font-semibold mb-2 text-gray-900">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="Ingresa un correo electrónico válido"
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                {...register("email", { required: "El correo electrónico es obligatorio" })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                     {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Botón Enviar correo */}
                        <div className="mb-6">
                            <button 
                                className="bg-red-700 text-white py-3 w-full rounded-xl hover:bg-black duration-300 font-medium transition-all hover:scale-105"
                            >
                                Enviar correo de recuperación
                            </button>
                        </div>

                    </form>

                    {/* Separador */}
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Enlace para iniciar sesión */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-gray-900 text-sm">¿Ya posees una cuenta?</p>
                        <Link 
                            to="/login" 
                            className="py-2 px-6 bg-black text-white rounded-xl hover:bg-red-700 duration-300 font-medium transition-all hover:scale-105 text-center w-full sm:w-auto"
                        >
                            Iniciar sesión
                        </Link>
                    </div>

                    {/* Enlace adicional para volver al inicio */}
                    <div className="mt-5 text-center">
                        <Link 
                            to="/" 
                            className="text-black-300 hover:text-red-600 transition duration-200"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>

                   
                </div>
            </div>
        </div>
    )
}
