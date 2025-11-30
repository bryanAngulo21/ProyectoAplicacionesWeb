import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import storeProfile from "../../context/storeProfile"
import storeAuth from "../../context/storeAuth"

const CardPassword = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { user, updatePasswordProfile } = storeProfile()
    const { clearToken } = storeAuth()

    const [showActual, setShowActual] = useState(false)
    const [showNueva, setShowNueva] = useState(false)

    const updatePassword = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarpassword/${user._id}`
        const response = await updatePasswordProfile(url, dataForm)
        if (response) {
            clearToken()
        }
    }

    const inputBase = `
        w-full rounded-xl border border-gray-300 px-3 py-2 pr-12
        text-gray-700 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-gray-400 
        transition-all duration-200
    `

    return (
        <>
            <div className='mt-5'>
                <h1 className='font-black text-3xl text-gray-700 mt-16 tracking-tight'>
                    Actualizar contraseña
                </h1>
                <hr className='my-4 border-gray-300' />
            </div>

            <form onSubmit={handleSubmit(updatePassword)}>

                {/* Contraseña actual */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Contraseña actual
                    </label>

                    <div className="relative">
                        <input
                            type={showActual ? "text" : "password"}
                            placeholder="Ingresa tu contraseña actual"
                            className={inputBase}
                            {...register("passwordactual", {
                                required: "La contraseña actual es obligatoria"
                            })}
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 
                                       text-gray-600 hover:text-gray-800 transition"
                            onClick={() => setShowActual(!showActual)}
                        >
                            {showActual ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {errors.passwordactual && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.passwordactual.message}
                        </p>
                    )}
                </div>

                {/* Nueva contraseña */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Nueva contraseña
                    </label>

                    <div className="relative">
                        <input
                            type={showNueva ? "text" : "password"}
                            placeholder="Ingresa la nueva contraseña"
                            className={inputBase}
                            {...register("passwordnuevo", {
                                required: "La nueva contraseña es obligatoria"
                            })}
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 
                                       text-gray-600 hover:text-gray-800 transition"
                            onClick={() => setShowNueva(!showNueva)}
                        >
                            {showNueva ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {errors.passwordnuevo && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.passwordnuevo.message}
                        </p>
                    )}
                </div>

                {/* Botón submit */}
                <button
                    type="submit"
                    className="
                        w-full bg-gray-800 text-slate-200 font-bold uppercase
                        py-3 rounded-xl shadow-md
                        hover:bg-gray-700 transition-all duration-200
                        active:scale-[0.98]
                    "
                >
                    Cambiar
                </button>

            </form>
        </>
    )
}

export default CardPassword
