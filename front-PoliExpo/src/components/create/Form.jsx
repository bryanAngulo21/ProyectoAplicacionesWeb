/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { useFetch } from "../../hooks/useFetch"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { generateAvatar, convertBlobToBase64 } from "../../helpers/consultarIA"
import { toast, ToastContainer } from "react-toastify"
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/2138/2138440.png";


export const Form = ({publication}) => {

    const [avatar, setAvatar] = useState({
        image: DEFAULT_AVATAR,
        prompt: "",
        loading: false
    })

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm()
    const fetchDataBackend = useFetch()


    const selectedOption = watch("imageOption")


    const handleGenerateImage = async () => {

        setAvatar(prev => ({ ...prev, loading: true }))

        const blob = await generateAvatar(avatar.prompt)

        if (blob.type === "image/jpeg") {
            // blob:http://localhost/ea27cc7d-
            const imageUrl = URL.createObjectURL(blob)
            // data:image/png;base64,iVBORw0KGg
            const base64Image = await convertBlobToBase64(blob)
            setAvatar(prev => ({ ...prev, image: imageUrl, loading: false }))
            setValue("imagenPublicacionIA", base64Image)
        }
        else {
            toast.error("Error al generar la imagen, vuelve a intentarlo dentro de 1 minuto");
            setAvatar(prev => ({ ...prev, image: DEFAULT_AVATAR, loading: false }))
            setValue("imagenPublicacionIA", avatar.image)
        }
    }



    const registerPublication = async (dataForm) => {
        /*
        const dataForm = {
            nombre: "Firulais",
            edad: "2",
            imagen: [File]  // un array con 1 imagen cargada por el usuario
        }
        */
        // clase de JavaScript para enviar datos como texto + imágenes al servidor
        const formData = new FormData()
        // Recorre todos los elementos del formulario
        Object.keys(dataForm).forEach((key) => {
            if (key === "imagen") {
                formData.append("imagen", dataForm.imagen[0]) // se guarda el archivo real
            } else {
                formData.append(key, dataForm[key]) // se guardan nombre y edad
            }
        })
        let url = `${import.meta.env.VITE_BACKEND_URL}/publicacion/registro`
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        const headers = {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${storedUser.state.token}`
        }
        let response
        if (publication?._id) {
            url = `${import.meta.env.VITE_BACKEND_URL}/publicacion/actualizar/${publication._id}`
            response = await fetchDataBackend(url, formData, "PUT", headers)
        }
        else{
            response = await fetchDataBackend(url, formData, "POST", headers)
        }
        if (response) {
            setTimeout(() => {
                navigate("/dashboard/list")
            }, 2000)
        }
    }


    useEffect(() => {
        if (publication) {
            reset({
                cedulaAutor: publication?.cedulaAutor,
                nombreAutor: publication?.nombreAutor,
                emailAutor: publication?.emailAutor,
                celularAutor: publication?.celularAutor,
                nombrePublicacion: publication?.nombrePublicacion,
                tipoPublicacion: publication?.tipoPublicacion,
                fechaCreacionPublicacion: new Date( publication?.fechaCreacionPublicacion).toLocaleDateString('en-CA', {timeZone: 'UTC'}),
                detallePublicacion: publication?.detallePublicacion
            })
        }
    }, [publication, reset])
    
    
    return (

        <form onSubmit={handleSubmit(registerPublication)}>

            <ToastContainer />

            {/* Información del autor */}
            <fieldset className="border-2 border-gray-500 p-6 rounded-lg shadow-lg">

                <legend className="text-xl font-bold text-gray-700 bg-gray-200 px-4 py-1 rounded-md">
                    Información del autor
                </legend>

                {/* Cédula */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Cédula</label>
                    <div className="flex items-center gap-10 mb-5">
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="Ingresa la cédula"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                            {...register("cedulaAutor", { required: "La cédula es obligatoria" })}
                        />

                        <button className="py-1 px-8 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 
                        duration-300 hover:bg-gray-900 hover:text-white sm:w-80"
                        disabled={publication}
                        >
                            Consultar
                        </button>
                    </div>
                    {errors.cedulaAutor && <p className="text-red-800">{errors.cedulaAutor.message}</p>}
                </div>



                {/* Campo nombres completos */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Nombres completos</label>
                    <input
                        type="text"
                        placeholder="Ingresa nombre y apellido"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("nombreAutor", { required: "El nombre completo es obligatorio" })}
                    />
                    {errors.nombreAutor && <p className="text-red-800">{errors.nombreAutor.message}</p>}
                </div>


                {/* Campo correo electrónico */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                    <input
                        type="email"
                        placeholder="Ingresa el correo electrónico"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("emailAutor", { required: "El correo electrónico es obligatorio" })}
                    />
                    {errors.emailAutor && <p className="text-red-800">{errors.emailAutor.message}</p>}
                </div>


                {/* Campo celular */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Celular</label>
                    <input
                        type="text"
                        inputMode="tel"
                        placeholder="Ingresa el celular"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("celularAutor", { required: "El celular es obligatorio" })}
                    />
                    {errors.celularAutor && <p className="text-red-800">{errors.celularAutor.message}</p>}
                </div>

            </fieldset>



            {/* Información del proyecto*/}

            <fieldset className="border-2 border-gray-500 p-6 rounded-lg shadow-lg mt-10">

                <legend className="text-xl font-bold text-gray-700 bg-gray-200 px-4 py-1 rounded-md">
                    Información del proyecto
                </legend>


                {/* Campo nombre del proyecto */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Nombre del proyecto</label>
                    <input
                        type="text"
                        placeholder="Ingresar nombre"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("nombrePublicacion", { required: "El nombre del Proyecto es obligatorio" })}
                    />
                    {errors.nombrePublicacion && <p className="text-red-800">{errors.nombrePublicacion.message}</p>}
                </div>


                 {/* Campo imagen del proyecto*/}
                <label className="mb-2 block text-sm font-semibold">Imagen del proyecto</label>

                <div className="flex gap-4 mb-2">
                    {/* Opción: Imagen con IA */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="ia"
                            {...register("imageOption", { required: "La imagen del proyecto es obligatorio" })}
                            disabled={publication}
                        />
                        Generar con IA
                    </label>

                    {/* Opción: Subir Imagen */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="upload"
                            {...register("imageOption", { required: "Seleccione una opción para cargar la imagen" })}
                        />
                        Subir Imagen
                    </label>
                </div>
                {errors.imageOption && <p className="text-red-800">{errors.imageOption.message}</p>}



                {/* Campo imagen con IA */}
                {selectedOption === "ia" && (
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">Imagen con IA</label>
                        <div className="flex items-center gap-10 mb-5">
                            <input
                                type="text"
                                placeholder="Ingresa el prompt"
                                className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                                value={setAvatar.prompt}
                                onChange={(e) => setAvatar(prev => ({ ...prev, prompt: e.target.value }))}
                            />
                            <button
                                type="button"
                                className="py-1 px-8 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white sm:w-80"
                                onClick={handleGenerateImage}
                                disabled={setAvatar.loading}
                            >
                                {avatar.loading ? "Generando..." : "Generar con IA"}
                            </button>
                        </div>
                        {avatar.image && (
                            <img src={avatar.image} alt="Avatar IA" width={100} height={100} />
                        )}
                    </div>
                )}


                {/* Campo subir imagen */}
                {selectedOption === "upload" && (
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">Subir Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                            {...register("imagen")}
                        />
                    </div>
                )}



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Campo tipo de publicacion*/}
                    <div>
                        <label htmlFor="tipo" className="mb-2 block text-sm font-semibold">Tipo</label>
                        <select
                            id="tipo"
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                            defaultValue=""
                            {...register("tipoPublicacion", { required: "El tipo del proyecto es obligatorio" })}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="acdemico">Académico</option>
                            <option value="estracurricular">Extracurricular</option>
                            <option value="otro">Otro</option>
                        </select>
                        {errors.tipoPublicacion && <p className="text-red-800">{errors.tipoPublicacion.message}</p>}
                    </div>

                    {/* Campo fecha de creacion */}
                    <div>
                        <label htmlFor="fechaCreacion" className="mb-2 block text-sm font-semibold">Fecha de creación</label>
                        <input
                            id="fechaCreacion"
                            type="date"
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                            {...register("fechaCreacionPublicacion", { required: "La Fecha de creación del proyecto es obligatorio" })}
                        />
                            {errors.fechaCreacionPublicacion && <p className="text-red-800">{errors.fechaCreacionPublicacion.message}</p>}
                    </div>
                </div>


                {/* Campo observación*/}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Observación</label>
                    <textarea
                        placeholder="Ingrese una descripcion del proyecto"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("detallePublicacion", { required: "La descripcion es obligatorio" })}
                    />
                    {errors.detallePublicacion && <p className="text-red-800">{errors.detallePublicacion.message}</p>}
                </div>

            </fieldset>


            {/* Botón de registro */}
            <input
                type="submit"
                className="bg-gray-800 w-full p-2 mt-5 text-slate-300 uppercase font-bold rounded-lg 
                hover:bg-gray-600 cursor-pointer transition-all"
                value={publication? "Actualizar":"Registrar"}
            />

        </form>

    )
}