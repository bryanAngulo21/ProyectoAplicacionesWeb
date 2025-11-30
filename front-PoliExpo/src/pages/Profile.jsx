import CardPassword from '../components/profile/CardPassword';
import { CardProfile } from '../components/profile/CardProfile';
import FormProfile from '../components/profile/FormProfile';

const Profile = () => {

    const cardStyles =
        "bg-white p-8 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md";

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* ENCABEZADO */}
            <header className="mb-10 w-full">
                <h1 className="font-black text-4xl text-black tracking-wide">
                    Perfil de Usuario
                </h1>
                <hr className="border-gray-300 mt-3" />
            </header>

            {/* DESCRIPCIÓN */}
            <p className="text-gray-600 mb-12 max-w-2xl">
                Este módulo te permite gestionar la información de tu perfil de usuario.
            </p>

            {/* CARD PERFIL (centrado arriba) */}
            <div className="flex justify-center mb-14">
                <section className={cardStyles }>
                    <CardProfile />
                </section>
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex justify-center gap-10 flex-wrap md:flex-nowrap">

                {/* COLUMNA IZQUIERDA */}
                <div className="w-full md:w-1/2 max-w-[550px] space-y-8">
                    <section className={cardStyles}>
                        <FormProfile />
                    </section>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="w-full md:w-1/2 max-w-[550px] space-y-8">
                    <section className={cardStyles}>
                        <CardPassword />
                    </section>
                </div>

            </div>
        </div>
    );
};

export default Profile;
