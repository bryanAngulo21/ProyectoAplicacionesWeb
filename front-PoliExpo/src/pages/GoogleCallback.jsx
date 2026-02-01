import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import storeAuth from '../context/storeAuth';
import logoPoliExpo from '../assets/logo-PoliExpo3.png';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setToken, setRol } = storeAuth();

  useEffect(() => {
    // Esta función se ejecutaría cuando Google redireccione de vuelta
    // Necesitarías un endpoint en tu backend que maneje esto
    const handleGoogleCallback = async () => {
      try {
        // En un caso real, tu backend manejaría el callback y devolvería los datos
        // Por ahora, simulamos una redirección exitosa
        toast.success('Autenticación con Google exitosa');
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        
      } catch (error) {
        toast.error('Error en autenticación con Google');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleGoogleCallback();
  }, [navigate, setToken, setRol]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-600 to-black p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-10 max-w-md w-full">
        <img src={logoPoliExpo} alt="logo" className="w-32 h-32" />
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Procesando autenticación...
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Estamos conectando con Google. Por favor espera...
          </p>
        </div>
        
        <ToastContainer />
      </div>
    </div>
  );
};

export default GoogleCallback;