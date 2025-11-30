import personHand from '../assets/person-hand.webp';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useFetch } from '../hooks/useFetch';
import logoPoliExpo from '../assets/logo-PoliExpo3.png'

export const Confirm = () => {
  const fetchDataBackend = useFetch();
  const { token } = useParams();

  const verifyToken = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`;
    await fetchDataBackend(url);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-600 to-black p-8">
      
      {/* Contenedor blanco principal */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-10 max-w-md w-full">
        
        {/* Logo y Bienvenida */}
        <div className="flex flex-col items-center gap-4">
          <img src={logoPoliExpo} alt="logo" className="w-32 h-32" />
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            Bienvenido
          </h1>
        </div>

        {/* Imagen principal */}
        <div className="flex flex-col items-center gap-8">
          <ToastContainer />
          <img
            className="object-cover h-40 w-40 rounded-full border-4 border-solid border-gray-300"
            src={personHand}
            alt="image description"
          />

          {/* Mensaje y botón */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-2xl md:text-3xl text-gray-800 text-center">
              Gracias por confirmar tu correo
            </p>
            <p className="text-lg md:text-xl text-gray-600 text-center">
              Ya puedes usar PoliExpo
            </p>
            <Link
              to="/login"
              className="px-6 py-3 mt-4 bg-red-600 text-white rounded-xl hover:scale-105 transition-transform duration-300 hover:bg-red-700"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
