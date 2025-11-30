import { useEffect } from "react"
import storeProfile from "../../context/storeProfile"
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'

const FormularioPerfil = () => {

    const { user, updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const updateUser = (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarperfil/${user._id}`
        updateProfile(url, dataForm)
    }

    useEffect(() => {
        if (user) {
            reset({
                nombre: user?.nombre,
                apellido: user?.apellido,
                direccion: user?.direccion,
                celular: user?.celular,
                email: user?.email,
            })
        }
    }, [user])

    const inputStyle = `
        w-full rounded-xl border border-gray-300 px-3 py-2 
        text-gray-700 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-gray-400 
        transition-all duration-200
    `

    return (
        <form onSubmit={handleSubmit(updateUser)}>

            <div className="mt-5">
                <h1 className="font-black text-3xl text-gray-700 mt-16 tracking-tight">
                    Actualizar perfil
                </h1>
                <hr className="my-4 border-gray-300" />
            </div>

            <ToastContainer />

            {/* Nombre */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Nombre
                </label>
                <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    className={inputStyle}
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                />
                {errors.nombre && (
                    <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
                )}
            </div>

            {/* Apellido */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Apellido
                </label>
                <input
                    type="text"
                    placeholder="Ingresa tu apellido"
                    className={inputStyle}
                    {...register("apellido", { required: "El apellido es obligatorio" })}
                />
                {errors.apellido && (
                    <p className="text-red-600 text-sm mt-1">{errors.apellido.message}</p>
                )}
            </div>

            {/* Dirección */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Dirección
                </label>
                <input
                    type="text"
                    placeholder="Ingresa tu dirección"
                    className={inputStyle}
                    {...register("direccion", { required: "La dirección es obligatoria" })}
                />
                {errors.direccion && (
                    <p className="text-red-600 text-sm mt-1">{errors.direccion.message}</p>
                )}
            </div>

            {/* Celular */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Celular
                </label>
                <input
                    type="text"
                    inputMode="tel"
                    placeholder="Ingresa tu teléfono"
                    className={inputStyle}
                    {...register("celular", { 
                        required: "El celular es obligatorio",
                        pattern: {
                            value: /^\d{10}$/,
                            message: "Ingresa un número de 10 dígitos"
                        }
                    })}
                />
                {errors.celular && (
                    <p className="text-red-600 text-sm mt-1">{errors.celular.message}</p>
                )}
            </div>

            {/* Correo */}
            <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        placeholder="Ingresa tu correo"
                        className={inputStyle}
                        {...register("email", { 
                            required: "El correo es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Ingresa un correo válido"
                            }
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

            {/* Botón */}
            <button
                type="submit"
                className="
                    w-full bg-gray-800 text-slate-200 font-bold uppercase
                    py-3 rounded-xl shadow-md mt-3
                    hover:bg-gray-700 transition-all duration-200
                    active:scale-[0.98]
                "
            >
                Actualizar
            </button>

        </form>
    )
}

export default FormularioPerfil
