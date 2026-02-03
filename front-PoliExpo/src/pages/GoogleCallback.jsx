import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import storeAuth from '../context/storeAuth';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setToken, setRol } = storeAuth();

  useEffect(() => {
    const processHash = () => {
      const hash = window.location.hash;
      
      if (hash.startsWith('#google-auth-')) {
        try {
          const encodedData = hash.replace('#google-auth-', '');
          const decodedData = atob(encodedData);
          const userData = JSON.parse(decodedData);
          
          // Guardar datos
          setToken(userData.token);
          setRol(userData.rol);
          
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('auth-token', JSON.stringify({ 
            state: { token: userData.token, rol: userData.rol } 
          }));
          
          toast.success(`¡Bienvenido ${userData.nombre}!`);
          navigate('/dashboard');
          
        } catch (error) {
          console.error('Error procesando datos de Google:', error);
          toast.error('Error en autenticación');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };
    
    processHash();
  }, [navigate, setToken, setRol]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4">Procesando autenticación...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;