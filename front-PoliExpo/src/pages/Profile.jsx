import CardPassword from '../components/profile/CardPassword';
import { CardProfile } from '../components/profile/CardProfile';
import FormProfile from '../components/profile/FormProfile';

const Profile = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Perfil de Usuario</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8 text-gray-600'>
                Este módulo te permite gestionar la información de tu perfil de usuario.
            </p>

            {/* PERFIL SUPERIOR */}
            <div className="mb-8">
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <CardProfile />
                </div>
            </div>

            {/* DOS COLUMNAS: PERFIL Y CONTRASEÑA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* COLUMNA IZQUIERDA: INFORMACIÓN PERSONAL */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        📝 Información Personal
                    </h2>
                    <FormProfile />
                </div>

                {/* COLUMNA DERECHA: SEGURIDAD */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        🔒 Seguridad y Contraseña
                    </h2>
                    <CardPassword />
                </div>
            </div>

            {/* INFORMACIÓN ADICIONAL */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">
                    💡 Consejos para tu perfil
                </h3>
                <ul className="text-blue-700 space-y-2 text-sm">
                    <li>• Mantén tu información actualizada para una mejor experiencia</li>
                    <li>• Usa una foto de perfil clara y profesional</li>
                    <li>• Cambia tu contraseña regularmente por seguridad</li>
                    <li>• Verifica que tu correo electrónico sea correcto</li>
                </ul>
            </div>
        </div>
    );
};

export default Profile;