import { useState } from "react";
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { useFetch } from '../hooks/useFetch';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import storeAuth from "../context/storeAuth";

const Login = () => {
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
const { register, handleSubmit, formState: { errors } } = useForm();
const fetchDataBackend = useFetch();
const { setToken, setRol } = storeAuth();

const loginUser = async (dataForm) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/login`;
    const response = await fetchDataBackend(url, dataForm, 'POST');
    setToken(response.token);
    setRol(response.rol);
    if (response) navigate('/dashboard');
}

return (
    <div className="font-inter min-h-screen flex justify-center items-center relative bg-black">
        <ToastContainer />
        <div className="absolute inset-0 bg-[url('/public/images/landscape_login.jpg')] bg-cover bg-center opacity-30"></div>

        <div className="relative z-20 w-full max-w-md mx-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-semibold text-center text-red-600">Bienvenido</h1>
                <p className="text-gray-900 text-center my-4">Por favor ingresa tus datos</p>

                <form onSubmit={handleSubmit(loginUser)}>

                    {/* Campo Correo */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-semibold mb-2 text-gray-900">Correo electrónico</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <MdEmail size={20} />
                            </span>
                            <input
                                type="email"
                                placeholder="Ingresa tu correo"
                                className="w-full rounded-lg border border-gray-300 hover:ring-2 hover:ring-red-400 focus:ring-2 focus:ring-red-600 focus:border-red-600 pl-10 px-4 py-3 transition"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                        </div>
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Campo Contraseña */}
                    <div className="mb-6 relative">
                        <label className="block text-sm font-semibold mb-2 text-gray-900">Contraseña</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <MdLock size={20} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="************"
                                className="w-full rounded-lg border border-gray-300 hover:ring-2 hover:ring-red-400 focus:ring-2 focus:ring-red-600 focus:border-red-600 pl-10 px-4 py-3 pr-12 transition"
                                {...register("password", { required: "La contraseña es obligatoria" })}
                            />

                            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-black hover:text-red-600 transition"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                            </button>
                        </div>
                    </div>

                    <button className="block w-full py-3 text-center bg-red-600 text-white rounded-xl hover:bg-red-700 duration-300 font-medium">Iniciar sesión</button>
                </form>
            </div>
        </div>
    </div>
);

};

export default Login;