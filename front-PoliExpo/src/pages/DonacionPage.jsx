import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import DonacionForm from '../components/donaciones/DonacionForm';

const DonacionPage = () => {
  const navigate = useNavigate();
  
  const handleDonationSuccess = (donacion) => {
    console.log('Donación exitosa:', donacion);
    toast.success(`¡Gracias por tu donación de $${donacion.monto || '0'}!`);
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className='font-black text-4xl text-gray-500'>
          Apoya a PoliExpo
        </h1>
        <hr className='my-4 border-t-2 border-gray-300' />
       

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
          {/* Formulario de donación */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Realizar Donación
              </h2>
              <DonacionForm 
                onDonationSuccess={handleDonationSuccess}
                onClose={handleClose}
              />
            </div>
          </div>

          
        </div>

        {/* Pie de página */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-400">
            PoliExpo es una plataforma sin fines de lucro. Todas las donaciones se destinan íntegramente al mantenimiento y mejora de la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonacionPage;