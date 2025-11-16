import { useState, useEffect } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { ToastContainer } from "react-toastify"
import { useFetch } from "../hooks/useFetch"
import { getRandomImage } from "../api/imagenFondo" // Api de imagen


export const Register = () => {

    const [showPassword, setShowPassword] = useState(false)
    const fetchDataBackend = useFetch()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
        await fetchDataBackend(url, dataForm, "POST")
    }

    // Imagen dinámica API
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
        <div className="min-h-screen flex justify-center items-center relative">

            {/* Fondo fijo */}
            <div
                className="absolute inset-0 bg-[url('/images/landscape_register.jpg')] bg-cover bg-center bg-fixed z-0"
            ></div>

            {/* Contenedor principal lado a lado */}
            <div className="relative z-20 w-full max-w-5xl mx-4 flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">

                {/* FORMULARIO */}
                <div className="w-full md:w-1/2 bg-white p-8">

                    <h1 className="text-3xl font-semibold mb-2 text-center text-orange-700">
                        Bienvenido
                    </h1>

                    <small className="text-black-400 block my-3 text-sm text-center">
                        Por favor ingresa tus datos
                    </small>

                    <ToastContainer />

                    <form onSubmit={handleSubmit(registerUser)}>

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-3">
                                <label className="text-sm font-semibold">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu nombre"
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 focus:ring-2 focus:ring-blue-500"
                                    {...register("nombre", { required: "El nombre es obligatorio" })}
                                />
                                {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
                            </div>

                            <div className="mb-3">
                                <label className="text-sm font-semibold">Apellido</label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu apellido"
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 focus:ring-2 focus:ring-blue-500"
                                    {...register("apellido", { required: "El apellido es obligatorio" })}
                                />
                                {errors.apellido && <p className="text-red-800">{errors.apellido.message}</p>}
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="mb-3">
                            <label className="text-sm font-semibold">Dirección</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu dirección de domicilio"
                                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 focus:ring-2 focus:ring-blue-500"
                                {...register("direccion", { required: "La dirección es obligatoria" })}
                            />
                            {errors.direccion && <p className="text-red-800">{errors.direccion.message}</p>}
                        </div>

                        {/* Celular y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-3">
                                <label className="text-sm font-semibold">Celular</label>
                                <input
                                    type="text"
                                    inputMode="tel"
                                    placeholder="Ingresa tu celular"
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 focus:ring-2 focus:ring-blue-500"
                                    {...register("celular", { required: "El celular es obligatorio" })}
                                />
                                {errors.celular && <p className="text-red-800">{errors.celular.message}</p>}
                            </div>

                            <div className="mb-3">
                                <label className="text-sm font-semibold">Correo electrónico</label>
                                <input
                                    type="email"
                                    placeholder="Ingresa tu correo electrónico"
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 focus:ring-2 focus:ring-blue-500"
                                    {...register("email", { required: "El correo es obligatorio" })}
                                />
                                {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3">
                            <label className="text-sm font-semibold">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 pr-10 focus:ring-2 focus:ring-blue-500 text-gray-600"
                                    {...register("password", { required: "La contraseña es obligatoria" })}
                                />
                                {errors.password && <p className="text-red-800">{errors.password.message}</p>}

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="bg-orange-700 text-white py-3 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900"
                        >
                            Registrarse
                        </button>
                    </form>

                    {/* Redirección */}
                    <div className="mt-6 text-sm flex justify-between items-center">
                        <p className="text-gray-600">¿Ya tienes una cuenta?</p>
                        <Link
                            to="/login"
                            className="py-2 px-5 bg-gray-600 text-white rounded-xl hover:scale-110 hover:bg-gray-900 duration-300"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>


                {/* PANEL DE IMAGEN DERECHA */}
                <div className="w-full md:w-1/2 relative">
                    {backgroundImage && (
                        <img
                            src={backgroundImage}
                            alt="Inspiracional"
                            onLoad={() => setLoaded(true)}
                            className={`w-full h-full object-cover transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
                        />
                    )}
                </div>

            </div>

        </div>
    )
}
