import { useState, useEffect } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router"
import MotivationalImage from "../components/MotivationalImage"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify"
import { useFetch } from "../hooks/useFetch"
import 'react-toastify/dist/ReactToastify.css'

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const fetchDataBackend = useFetch()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const registerUser = async (dataForm) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
            const result = await fetchDataBackend(url, dataForm, "POST")

            if (result?.success) {
                toast.success("Usuario registrado correctamente")
                reset()
            } else {
                toast.error(result?.message || "Error al registrar el usuario")
            }
        } catch (error) {
            toast.error("Error al comunicarse con el servidor")
            console.error(error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gray-100">

            <ToastContainer />

            {/* Fondo */}
            <div className="absolute inset-0 bg-[url('/public/images/landscape_register.jpg')] bg-cover bg-center bg-fixed z-0"></div>

            <div className="relative z-20 flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* FORMULARIO */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

                    <h1 className="text-3xl font-semibold mb-2 text-center text-orange-700">Bienvenido</h1>
                    <small className="text-black-400 block mb-6 text-sm text-center">
                        Por favor ingresa tus datos
                    </small> 

                    <form className="space-y-4" onSubmit={handleSubmit(registerUser)}>

                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre"
                                className="w-full rounded-md border border-gray-300 py-2 px-3"
                                {...register("nombre", { required: "El nombre es obligatorio" })}
                            />
                            {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Apellido</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu apellido"
                                className="w-full rounded-md border border-gray-300 py-2 px-3"
                                {...register("apellido", { required: "El apellido es obligatorio" })}
                            />
                            {errors.apellido && <p className="text-red-800">{errors.apellido.message}</p>}
                        </div>

                        {/* Dirección */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Dirección</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu dirección"
                                className="w-full rounded-md border border-gray-300 py-2 px-3"
                                {...register("direccion", { required: "La dirección es obligatoria" })}
                            />
                            {errors.direccion && <p className="text-red-800">{errors.direccion.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Celular */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">Celular</label>
                                <input
                                    type="text"
                                    inputMode="tel"
                                    placeholder="Ingresa tu celular"
                                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                                    {...register("celular", { required: "El celular es obligatorio" })}
                                />
                                {errors.celular && <p className="text-red-800">{errors.celular.message}</p>}
                            </div>

                            {/* Correo */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
                                <input
                                    type="email"
                                    placeholder="Ingresa tu correo"
                                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                                    {...register("email", { required: "El correo es obligatorio" })}
                                />
                                {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 pr-10"
                                    {...register("password", { required: "La contraseña es obligatoria" })}
                                />
                                {errors.password && <p className="text-red-800">{errors.password.message}</p>}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <MdVisibilityOff size={20}/> : <MdVisibility size={20}/> }
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-3 mt-5 bg-orange-700 text-white rounded-xl hover:bg-gray-900 transition transform hover:scale-105"
                        >
                            Registrarse
                        </button>

                    </form>

                    {/* Login */}
                    <div className="mt-6 text-sm flex justify-between items-center">
                        <p className="text-gray-600">¿Ya posees una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-gray-600 text-white rounded-xl hover:bg-gray-900 transition">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>

                {/* Panel de imagen */}
                <MotivationalImage />
            </div>
        </div>
    )
}
