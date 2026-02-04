/* Landing Page de PoliExpo */
import logoPoliExpo from '../assets/logo-PoliExpo3.png'
import logoStudentsMain from '../assets/students-group.webp'
import logoEsfotMain from '../assets/esfot.webp'
import logoStudents2Main from '../assets/students-group2.webp'

import AppStoreImage from '../assets/appstore.png'
import GooglePlayImage from '../assets/googleplay.png'
import developMan from '../assets/develop-man.webp'
import { Link } from 'react-router'

import { FaWhatsapp } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

import { FaRegShareFromSquare } from "react-icons/fa6";
import { MdPublish, MdConnectWithoutContact, MdScreenSearchDesktop, MdOutlineRateReview } from "react-icons/md";
import { FaMoneyBillTrendUp, FaRegThumbsUp, FaEye, FaHeart, FaCode, FaUser } from "react-icons/fa6";
import { SiQuicklook } from "react-icons/si";
import { MdGroups2 } from "react-icons/md";

import { useState, useEffect, useCallback, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";

import { FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

// API
import { fetchQuote } from "../api/zenQuotes"; // Ajusta la ruta si cambia
import AOS from "aos";
import "aos/dist/aos.css";
import Typed from "typed.js";

import "./Home.css";

// Importamos el servicio de proyectos
import { proyectoService } from "../services/api";

export const Home = () => {
    const [open, setOpen] = useState(false);

    // Estado para la cita
    const [quote, setQuote] = useState({ q: "", a: "" });

    // Estado para proyectos
    const [proyectos, setProyectos] = useState([]);
    const [loadingProyectos, setLoadingProyectos] = useState(true);

    useEffect(() => {
        const getQuote = async () => {
            const data = await fetchQuote();
            setQuote(data);
        };
        getQuote();

        // Cargar proyectos públicos
        cargarProyectosPublicos();
    }, []);

    // Función para cargar proyectos públicos
    const cargarProyectosPublicos = async () => {
        try {
            setLoadingProyectos(true);
            // Solo obtenemos proyectos públicos y limitamos a 6 para la vista inicial
            const response = await proyectoService.getAll();
            
            // Filtrar solo proyectos públicos (si es que tienes ese campo)
            // Si no tienes campo publico, puedes mostrar todos
            const proyectosPublicos = response.data?.slice(0, 6) || [];
            
            setProyectos(proyectosPublicos);
        } catch (error) {
            console.error("Error cargando proyectos:", error);
        } finally {
            setLoadingProyectos(false);
        }
    };

    useEffect(() => {
        AOS.init({
            once: true,
            duration: 1000,
            delay: 10000
        });
    }, []);

    // EFECTOS: slider imagenes
    const slideImages = [logoStudentsMain, logoEsfotMain, logoStudents2Main];
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === slideImages.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slideImages.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const timer = setTimeout(goToNext, 4000);
        return () => clearTimeout(timer);
    }, [goToNext]);

    // EFECTOS: Letras moviles
    const lema = useRef(null);

    useEffect(() => {
        const typedOptions = {
            strings: [
                'Expón tu talento',
                'Comparte tu trabajo',
                'Conecta con el mundo'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            cursorChar: ' ',
        };

        const typed = new Typed(lema.current, typedOptions);

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <>
            {/* HEADER */}
            <header className="w-full px-25 py-4 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50 transition-all">
                {/* Logo */}
                <img src={logoPoliExpo} alt="logo" className="w-20 h-20" />

                {/* Nombre */}
                <h1 className="text-2xl font-extrabold text-red-800">
                    Poli<span className="text-black">Expo</span>
                </h1>

                {/* Menú hamburguesa */}
                <button 
                    onClick={() => setOpen(!open)} 
                    className="text-3xl md:hidden text-red-800"
                >
                    {open ? <HiX /> : <HiMenu />}
                </button>

                {/* MENU */}
                <nav 
                    className={`absolute top-24 left-0 w-full bg-white shadow-md py-6 flex flex-col items-center gap-6 text-lg font-inter transition-all duration-300 
                    ${open ? "opacity-100 visible" : "opacity-0 invisible"}
                    md:static md:flex md:flex-row md:w-auto md:gap-6 md:bg-transparent md:shadow-none md:opacity-100 md:visible`}
                >
                    <a href="#" className="hover:text-red-700 hover:scale-105 transition duration-200">Inicio</a>
                    <a href="#about" className="hover:text-red-700 hover:scale-105 transition duration-200">Nosotros</a>
                    <a href="#services" className="hover:text-red-700 hover:scale-105 transition duration-200">Servicios</a>
                    <a href="#projects" className="hover:text-red-700 hover:scale-105 transition duration-200">Proyectos</a>
                    <a href="#footer" className="hover:text-red-700 hover:scale-105 transition duration-200">Contáctanos</a>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Link to="/login" className="bg-red-800 px-4 py-1 text-white rounded-lg hover:bg-red-700 text-center">Iniciar Sesión</Link>
                        <Link to="/register" className="bg-red-800 px-4 py-1 text-white rounded-lg hover:bg-red-700 text-center">Registrarse</Link>
                    </div>
                </nav>
            </header>

            {/* HERO */}
            <main className='text-center py-6 px-8 bg-red-50 md:text-center md:flex justify-between items-center gap-10 md:py-1 animate-fadeUp'>
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-red-800">
                        Poli<span className="text-black">Expo</span>
                    </h1>

                    <h2 className="text-2xl md:text-4xl lg:text-6xl font-inter text-red-800 uppercase my-4">
                        Muestra tu mejor trabajo
                    </h2>

                    <p
                        className="text-xl md:text-2xl lg:text-3xl font-inter my-4"
                        ref={lema}
                    ></p>
                </div>

                <div className="main__gallery">
                    <div className="slider">
                        <button onClick={goToPrevious} className="slider__arrow slider__arrow--left">
                            ❮
                        </button>
                        <img
                            key={currentIndex} 
                            src={slideImages[currentIndex]}
                            alt="Main_images"
                            className="slider__image"
                        />
                        <button onClick={goToNext} className="slider__arrow slider__arrow--right">
                            ❯
                        </button>
                    </div>
                </div>
            </main>

            {/* NOSOTROS */}
            <section className='container mx-auto px-4 animate-fadeUp'>
                <div id="about" className='container mx-auto relative mt-6'>
                    <h2 className='font-semibold text-3xl relative z-10 w-fit text-center mx-auto bg-white px-4'>
                        Nosotros
                    </h2>
                    <div className='text-red-900 border-2 absolute top-1/2 w-full left-0 z-0'></div>
                </div>

                <div className='my-10 flex flex-col gap-10 items-center sm:flex-row sm:justify-around sm:items-center'>
                    <div className='sm:w-1/2 flex justify-center items-center'>
                        <img 
                            src={developMan} 
                            alt="AboutUs" 
                            className='max-w-sm w-full h-auto object-contain'
                        />
                    </div>

                    <div className='px-10 sm:w-1/2'>
                        <p className='my-4'>
                            PoliExpo es el espacio donde puedes compartir tus ideas, proyectos y talento con la comunidad estudiantil.
                        </p>

                        <ul className='space-y-4'>
                            <li><MdPublish className='inline text-2xl mr-2' />Publica tus proyectos</li>
                            <li><MdConnectWithoutContact className='inline text-2xl mr-2' />Conéctate con otros estudiantes</li>
                            <li><FaMoneyBillTrendUp className='inline text-2xl mr-2' />Potencia tus ideas</li>
                            <li><MdScreenSearchDesktop className='inline text-2xl mr-2' />Explora publicaciones</li>
                            <li><MdOutlineRateReview className='inline text-2xl mr-2' />Retroalimenta</li>
                            <li><FaRegShareFromSquare className='inline text-2xl mr-2' />Comparte experiencias</li>
                            <li><FaRegThumbsUp className='inline text-2xl mr-2' />Construye comunidad</li>
                        </ul>

                        <p className='font-inter text-center my-4'>Descarga la aplicación</p>

                        <div className="flex justify-center gap-4">
                            <a href="https://www.apple.com/la/app-store/">
                                <img src={AppStoreImage} alt="App Store" />
                            </a>
                            <a href="https://play.google.com/">
                                <img src={GooglePlayImage} alt="Google Play" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CITA DEL DÍA */}
            <section className='container mx-auto px-4 py-6 text-center bg-white rounded-lg shadow-md my-6 animate-fadeUp'>
                <h3 className='text-xl font-semibold text-red-800 mb-2'>Cita del día</h3>
                <p className='text-lg italic'>"{quote.q}"</p>
                <p className='text-md font-bold mt-1'>- {quote.a}</p>
            </section>

            {/* PROYECTOS DESTACADOS */}
            <section id="projects" className='container mx-auto px-4 animate-fadeUp'>
                <div className='container mx-auto relative mt-6'>
                    <h2 className='font-semibold text-3xl relative z-10 w-fit text-center mx-auto bg-white px-6 py-2'>
                        Proyectos Destacados
                    </h2>
                    <div className='text-red-900 border-2 absolute top-1/2 w-full left-0 z-0'></div>
                </div>

                <p className='text-gray-600 text-center my-6'>
                    Explora algunos de los mejores proyectos creados por estudiantes
                </p>

                {loadingProyectos ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando proyectos...</p>
                        </div>
                    </div>
                ) : proyectos.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
                        <p className="text-gray-500">No hay proyectos disponibles para mostrar</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                        {proyectos.map((proyecto) => (
                            <div key={proyecto._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition">
                                {/* Encabezado del proyecto */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                                        {proyecto.titulo}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded">
                                            {proyecto.categoria}
                                        </span>
                                        {proyecto.carrera && (
                                            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded">
                                                {proyecto.carrera}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {proyecto.descripcion}
                                    </p>
                                </div>

                                {/* Tecnologías */}
                                {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                            <FaCode /> Tecnologías:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {proyecto.tecnologias.slice(0, 3).map((tech, index) => (
                                                <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                    {tech}
                                                </span>
                                            ))}
                                            {proyecto.tecnologias.length > 3 && (
                                                <span className="text-gray-500 text-xs">+{proyecto.tecnologias.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Estadísticas */}
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <FaHeart className="text-gray-500 text-sm" />
                                            <span className="text-xs">{proyecto.likes?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaEye className="text-gray-500 text-sm" />
                                            <span className="text-xs">{proyecto.vistas || 0}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        {proyecto.autor && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <FaUser /> Por: {proyecto.autor.nombre}
                                            </p>
                                        )}
                                        <Link
                                            to="/login"
                                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                                        >
                                            Ver más
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Botón para ver más proyectos */}
                <div className="text-center mt-8">
                    <Link
                        to="/login"
                        className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Inicia sesión para ver más proyectos
                    </Link>
                </div>
            </section>

            {/* SERVICIOS */}
            <section className='container mx-auto px-4 animate-fadeUp'>
                <div id="services" className='container mx-auto relative mt-6'>
                    <h2 className='font-semibold text-3xl relative z-10 w-fit text-center mx-auto bg-white px-4'>
                        Servicios
                    </h2>
                    <div className='text-red-900 border-2 absolute top-1/2 w-full left-0 z-0'></div>
                </div>

                <div className='my-10 flex justify-between flex-wrap gap-5'>
                    {/* Publicar */}
                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 sm:flex-1">
                        <MdPublish className='inline text-5xl' />
                        <h4>
                            <Link to="/login" className="text-xl font-inter py-4 text-red-700 hover:underline">Publicar</Link>
                        </h4>
                        <p className="my-4 px-2">Comparte tus proyectos académicos y extracurriculares.</p>
                        <hr className="border-1 border-red-900 absolute w-full" />
                    </div>

                    {/* Ver proyectos */}
                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 bg-red-50 sm:flex-1">
                        <SiQuicklook className='inline text-5xl' />
                        <h4>
                            <Link to="/login" className="text-xl font-inter py-4 text-red-700 hover:underline">Ver Proyectos</Link>
                        </h4>
                        <p className="my-4 px-2">Explora proyectos de estudiantes de diferentes semestres.</p>
                        <hr className="border-1 border-red-900 absolute w-full" />
                    </div>

                    {/* Miembros */}
                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 sm:flex-1">
                        <MdGroups2 className='inline text-5xl' />
                        <h4>
                            <Link to="/login" className="text-xl font-inter py-4 text-red-700 hover:underline">Miembros</Link>
                        </h4>
                        <p className="my-4 px-2">Conoce a otros estudiantes y forma parte de la comunidad.</p>
                        <hr className="border-1 border-red-900 absolute w-full" />
                    </div>
                </div>
            </section>

            {/* COMENTARIOS */}
            <section className='container mx-auto px-4 animate-fadeUp'>
                <div id="comments" className='container mx-auto relative mt-6'>
                    <h2 className='font-semibold text-3xl relative z-10 w-fit text-center mx-auto bg-white px-6 py-2'>
                        Comentarios 
                    </h2>
                    <div className='text-red-900 border-2 absolute top-1/2 w-full left-0 z-0'></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 place-items-center mt-6">
                    <div className="p-6 shadow-md bg-white rounded-xl text-center max-w-md mx-auto hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300">
                        <p className="italic">"PoliExpo me ayudó a mostrar mi proyecto y recibir retroalimentación."</p>
                        <h4 className="mt-4 font-bold text-red-800">— Andrea</h4>
                    </div>

                    <div className="p-6 shadow-md bg-white rounded-xl text-center max-w-md mx-auto hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300">
                        <p className="italic">"Conocí estudiantes de otros semestres que me inspiraron."</p>
                        <h4 className="mt-4 font-bold text-red-800">— Diego</h4>
                    </div>

                    <div className="p-6 shadow-md bg-white rounded-xl text-center max-w-md mx-auto hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300">
                        <p className="italic">"Ver los proyectos me motivó a mejorar los míos."</p>
                        <h4 className="mt-4 font-bold text-red-800">— Sofía</h4>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="footer" className="bg-red-50 mt-20 rounded-t-3xl py-14 px-6" data-aos="fade-up">
                <div className="container mx-auto grid md:grid-cols-3 gap-10 text-center md:text-left">
                    {/* Marca */}
                    <div className="space-y-3 text-center">
                        <img src={logoPoliExpo} alt="logo" className="w-20 h-20 mx-auto" />
                        <h1 className="text-2xl font-extrabold text-red-800">
                            Poli<span className="text-black">Expo</span>
                        </h1>
                        <p className="text-sm text-red-700">
                            Comparte tu trabajo y conecta con el mundo
                        </p>
                    </div>

                    {/* Enlaces */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-xl text-red-900">Enlaces</h3>
                        <ul className="space-y-2 text-red-800">
                            <li><a className="hover:text-red-600" href="#">Inicio</a></li>
                            <li><a className="hover:text-red-600" href="#services">Servicios</a></li>
                            <li><a className="hover:text-red-600" href="#about">Nosotros</a></li>
                            <li><a className="hover:text-red-600" href="#projects">Proyectos</a></li>
                            <li><a className="hover:text-red-600" href="#contact">Contacto</a></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-xl text-red-900">Contáctanos</h3>

                        <div className="flex justify-center md:justify-start items-center gap-2">
                            <IoMdMail className="text-xl" />
                            <p>admin@poliexpo.com</p>
                        </div>

                        <div className="flex justify-center md:justify-start items-center gap-2">
                            <FaPhone className="text-xl" />
                            <p>099 999 9999</p>
                        </div>

                        <div className="flex justify-center md:justify-start gap-4 text-3xl text-red-900">
                            <a href="https://www.facebook.com/"><FaFacebook /></a>
                            <a href="https://www.instagram.com/"><FaSquareInstagram /></a>
                            <a href="https://x.com/"><FaXTwitter /></a>
                            <a href="https://web.whatsapp.com/"><FaWhatsapp /></a>
                        </div>
                    </div>
                </div>

                <hr className="border-red-300 my-8" />

                <p className="text-center text-red-800 font-semibold text-sm">
                    © 2025 POLIEXPO – Todos los derechos reservados
                </p>
            </footer>
        </>
    );
};