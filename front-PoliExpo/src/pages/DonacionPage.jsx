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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className='font-black text-4xl md:text-5xl text-gray-800 mb-4'>
            Apoya a PoliExpo
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mb-6"></div>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto mb-8'>
            Tu donación ayuda a mantener y mejorar la plataforma para todos los estudiantes, 
            permitiéndonos agregar nuevas funcionalidades y mantener los servidores activos.
          </p>
          

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de donación */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
              <DonacionForm 
                onDonationSuccess={handleDonationSuccess}
                onClose={handleClose}
              />
            </div>
          </div>

          
        </div>

        {/* Pie de página */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          
          <p className="text-xs text-gray-400 mt-2">
            PoliExpo es una plataforma sin fines de lucro. Todas las donaciones se destinan íntegramente al mantenimiento y mejora de la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonacionPage;