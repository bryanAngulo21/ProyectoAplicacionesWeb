import { useState, useEffect } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { ToastContainer } from "react-toastify"
import { useFetch } from "../hooks/useFetch"
import { getRandomImage } from "../api/imagenFondo"
import logoPoliExpo from '../assets/logo-PoliExpo3.png'



export const Register = () => {

    const [showPassword, setShowPassword] = useState(false)
    const fetchDataBackend = useFetch()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
        await fetchDataBackend(url, dataForm, "POST")
    }

    const [backgroundImage, setBackgroundImage] = useState(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const url = await getRandomImage("motivational")
                setBackgroundImage(url)
            } catch (error) {
                console.error("Error cargando la imagen dinámica:", error)
            }
        }
        fetchImage()
    }, [])

    return (
        <div className="min-h-screen flex justify-center items-center relative bg-black">

            {/* Fondo principal */}
            <div
                className="absolute inset-0 bg-[url('/images/landscape_register.jpg')] bg-cover bg-center opacity-40"
            ></div>

            {/* Contenedor general */}
            <div className="relative z-20 w-full max-w-5xl mx-4 flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl ">

                {/* FORMULARIO */}
                <div className="w-full md:w-1/2 bg-white p-8">

                    <div className="flex flex-col items-center justify-center gap-4">
                        <img src={logoPoliExpo} alt="logo" className="w-20 h-20" />
                        <h1 className="text-3xl font-semibold text-red-600 text-center">
                            Crea un cuenta en PoliExpo
                        </h1>
                    </div>
                    

                    <small className="block my-3 text-sm text-center text-gray-900">
                        Por favor ingresa tus datos
                    </small>

                    <ToastContainer />

                    <form onSubmit={handleSubmit(registerUser)}>

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-900">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu nombre"
                                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                    {...register("nombre", { required: "El nombre es obligatorio" })}
                                />
                                {errors.nombre && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                         {errors.nombre.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-900">Apellido</label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu apellido"
                                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                    {...register("apellido", { required: "El apellido es obligatorio" })}
                                />
                                {errors.apellido && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                         {errors.apellido.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="mt-3">
                            <label className="text-sm font-semibold text-gray-900">Dirección</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu dirección de domicilio"
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                {...register("direccion", { required: "La dirección es obligatoria" })}
                            />
                            {errors.direccion && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                     {errors.direccion.message}
                                </p>
                            )}
                        </div>

                        {/* Celular y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-900">Celular</label>
                                <input
                                    type="text"
                                    inputMode="tel"
                                    placeholder="Ingresa tu celular"
                                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                    {...register("celular", { required: "El celular es obligatorio" })}
                                />
                                {errors.celular && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                         {errors.celular.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-900">Correo electrónico</label>
                                <input
                                    type="email"
                                    placeholder="Ingresa tu correo electrónico"
                                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                    {...register("email", { required: "El correo es obligatorio" })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                         {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3 mt-3">
                            <label className="text-sm font-semibold text-gray-900">Contraseña</label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full rounded-lg border border-gray-300 py-2 px-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                                    {...register("password", { required: "La contraseña es obligatoria" })}
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
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="bg-red-700 text-white py-3 w-full rounded-xl mt-5 hover:bg-black duration-300 hover:scale-105 transition-all"
                        >
                            Registrarse
                        </button>
                    </form>

                    {/* Redirección */}
                    <div className="mt-6 text-sm flex justify-between items-center">
                        <p className="text-gray-900">¿Ya tienes una cuenta?</p>
                        <Link
                            to="/login"
                            className="py-2 px-5 bg-black text-white rounded-xl hover:bg-red-700 duration-300 hover:scale-110 transition-all"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>

                {/* PANEL DE IMAGEN */}
                <div className="w-full md:w-1/2 relative">
                    {backgroundImage && (
                        <>
                            {/* Fondo desenfocado y ampliado para "rellenar" bordes */}
                            <div
                                aria-hidden="true"
                                className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
                                style={{
                                    backgroundImage: `url(${backgroundImage})`,
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    filter: "blur(12px) brightness(0.55)",
                                    transform: "scale(1.05)",
                                }}
                            />

                            {/* Imagen principal, centrada y sin recortarse */}
                            <div className="relative w-full h-96 md:h-full flex items-center justify-center">
                                <img
                                    src={backgroundImage}
                                    alt="Inspiracional"
                                    onLoad={() => setLoaded(true)}
                                    className={`max-w-full max-h-full object-contain transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
                                />
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}
