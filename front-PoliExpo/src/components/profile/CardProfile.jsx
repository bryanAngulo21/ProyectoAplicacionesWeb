import storeProfile from "../../context/storeProfile";

export const CardProfile = () => {
    const { user } = storeProfile();

    return (
        <div className="bg-white border border-gray-200 p-8 shadow-lg rounded-2xl">

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

                {/* COLUMNA 1 — FOTO */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                            alt="Perfil"
                            className="rounded-full border-2 border-gray-300 shadow-sm w-32 h-32 object-cover"
                        />
{/*
                        <label
                            className="absolute bottom-1 right-1 bg-blue-500 text-white 
                                       rounded-full p-2 cursor-pointer hover:bg-blue-600 
                                       shadow-md transition-all"
                        >
                            📷
                            <input type="file" accept="image/*" className="hidden" />
                        </label>
                        */}
                    </div>
                </div>

                {/* COLUMNA 2 — Nombre / Apellido */}
                <div className="space-y-5">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400">Nombre</span>
                        <p className="text-gray-700 font-medium text-base">{user?.nombre}</p>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400">Apellido</span>
                        <p className="text-gray-700 font-medium text-base">{user?.apellido}</p>
                    </div>
                </div>

                {/* COLUMNA 3 — Dirección / Celular */}
                <div className="space-y-5">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400">Dirección</span>
                        <p className="text-gray-700 font-medium text-base">{user?.direccion}</p>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400">Celular</span>
                        <p className="text-gray-700 font-medium text-base">{user?.celular}</p>
                    </div>
                </div>

                {/* COLUMNA 4 — Correo */}
                <div className="space-y-5">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400">Correo Electrónico</span>
                        <p className="text-gray-700 font-medium text-base">{user?.email}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};
