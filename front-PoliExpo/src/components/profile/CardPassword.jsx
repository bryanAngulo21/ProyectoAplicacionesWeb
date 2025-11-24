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

    return (
        <>
            <div className='mt-5'>
                <h1 className='font-black text-2xl text-gray-500 mt-16'>Actualizar contraseña</h1>
                <hr className='my-4 border-t-2 border-gray-300' />
            </div>

            <form onSubmit={handleSubmit(updatePassword)}>

                {/* Contraseña actual */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Contraseña actual</label>

                    <div className="relative mb-5">
                        <input
                            type={showActual ? "text" : "password"}
                            placeholder="Ingresa tu contraseña actual"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 pr-12 text-gray-500"
                            {...register("passwordactual", { required: "La contraseña actual es obligatoria" })}
                        />

                        {/* Icono dentro del input */}
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                            onClick={() => setShowActual(!showActual)}
                        >
                            {showActual ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {errors.passwordactual && (
                        <p className="text-red-800">{errors.passwordactual.message}</p>
                    )}
                </div>

                {/* Nueva contraseña */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>

                    <div className="relative mb-5">
                        <input
                            type={showNueva ? "text" : "password"}
                            placeholder="Ingresa la nueva contraseña"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 pr-12 text-gray-500"
                            {...register("passwordnuevo", { required: "La nueva contraseña es obligatoria" })}
                        />

                        {/* Icono dentro del input */}
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                            onClick={() => setShowNueva(!showNueva)}
                        >
                            {showNueva ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {errors.passwordnuevo && (
                        <p className="text-red-800">{errors.passwordnuevo.message}</p>
                    )}
                </div>

                {/* Botón submit */}
                <input
                    type="submit"
                    className='bg-gray-800 w-full p-2 text-slate-300 uppercase 
                    font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all'
                    value='Cambiar'
                />

            </form>
        </>
    )
}

export default CardPassword
