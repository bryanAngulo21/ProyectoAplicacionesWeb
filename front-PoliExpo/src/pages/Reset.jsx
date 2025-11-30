import personHand from '../assets/person-hand.webp';
import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useNavigate, useParams } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import logoPoliExpo from '../assets/logo-PoliExpo3.png';

const Reset = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const fetchDataBackend = useFetch();
    const [tokenback, setTokenBack] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const changePassword = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/nuevopassword/${token}`;
        await fetchDataBackend(url, dataForm, 'POST');
        setTimeout(() => {
            if (dataForm.password === dataForm.confirmpassword) {
                navigate('/login');
            }
        }, 2000);
    };

    useEffect(() => {
        const verifyToken = async () => {
            const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword/${token}`;
            await fetchDataBackend(url, 'GET');
            setTokenBack(true);
        };
        verifyToken();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-600 to-black p-4">
            <ToastContainer />
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <img src={logoPoliExpo} alt="logo" className="w-30 h-30" />
                    <h1 className="text-4xl font-bold text-gray-800 text-center">Bienvenido</h1>
                </div>

                <h1 className="text-2xl font-semibold mb-2 text-center text-gray-500">
                    Restablece tu contraseña
                </h1>
                <small className="text-gray-400 block my-4 text-sm text-center">
                    Por favor, ingrese los siguientes datos
                </small>
                <img
                    className="object-cover h-40 w-40 rounded-full border-4 border-solid border-slate-600 mb-6"
                    src={personHand}
                    alt="image description"
                />

                {tokenback && (
                    <form className="w-full" onSubmit={handleSubmit(changePassword)}>
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
                            <input
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                                {...register("password", { required: "La contraseña es obligatoria" })}
                            />
                            {errors.password && <p className="text-red-600 mt-1">{errors.password.message}</p>}

                            <label className="mb-2 block mt-2 text-sm font-semibold">Confirmar contraseña</label>
                            <input
                                type="password"
                                placeholder="Repite tu contraseña"
                                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                                {...register("confirmpassword", { required: "La contraseña es obligatoria" })}
                            />
                            {errors.confirmpassword && <p className="text-red-800 mt-1">{errors.confirmpassword.message}</p>}
                        </div>

                        <div className="mb-3">
                            <button
                                className="bg-black -600 text-slate-300 w-full py-2 rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-red-700 hover:text-white"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Reset;
