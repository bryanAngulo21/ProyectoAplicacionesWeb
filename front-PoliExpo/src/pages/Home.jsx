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
import { FaMoneyBillTrendUp, FaRegThumbsUp } from "react-icons/fa6";
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


export const Home = () => {

    const [open, setOpen] = useState(false);

    // Estado para la cita
    const [quote, setQuote] = useState({ q: "", a: "" });

    useEffect(() => {
        const getQuote = async () => {
            const data = await fetchQuote();
            setQuote(data);
        };
        getQuote();
    }, []);

    useEffect(() => {
        AOS.init({
            once: true, // 
            duration: 1000, // duración del efecto
            delay: 10000 // retraso en ms
        });
    }, []);

    //EFECTOS:  slider imagenes
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
    // //Creamos una referencia que apuntará al elemento span
          const lema= useRef(null);
        
          useEffect(() => {
            // Opciones de configuración para la animación
            const typedOptions = {
              strings: [
                            'Expón tu talento',
                            'Comparte tu trabajo',
                            'Conecta con el mundo'
                        ], // Texto que se escribirá
              typeSpeed: 50,   // Velocidad de escritura
              backSpeed: 30,   // Velocidad de borrado
              loop: true,      // Repetir la animación
              cursorChar: ' ', // Caracter del cursor
            };
        
            // Creamos la instancia de Typed.js cuando el componente se monta
            const typed = new Typed(lema.current, typedOptions);
        
            // Función de limpieza: se ejecuta cuando el componente se desmonta
            return () => {
              typed.destroy();
            };
          }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez
        
        
    return (
        <>
            {/* HEADER */}
            <header className="container mx-auto px-4 py-4 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50 transition-all">

                <img src={logoPoliExpo} alt="logo" className="w-20 h-20" />

                <h1 className='text-2xl font-extrabold text-red-800'>
                    Poli<span className='text-black'>Expo</span>
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
                    <a href="#footer" className="hover:text-red-700 hover:scale-105 transition duration-200">Contáctanos</a>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Link to="/login" className="bg-red-800 px-4 py-1 text-white rounded-lg hover:bg-red-700 text-center">Iniciar Sesión</Link>
                        <Link to="/register" className="bg-red-800 px-4 py-1 text-white rounded-lg hover:bg-red-700 text-center">Registrarse</Link>
                    </div>
                </nav>
            </header>


            {/* HERO */}
            <main className='text-center py-6 px-8 bg-red-50 md:text-center md:flex justify-between items-center gap-10 md:py-1 animate-fadeUp'>

                <div>
                    <h1 className='text-4xl font-extrabold text-red-800'>
                        Poli<span className='text-black'>Expo</span>
                    </h1>
                    <h1 className='font-inter text-red-800 uppercase text-2xl my-4 md:text-6xl'>
                        Muestra tu mejor trabajo
                    </h1>

                    <p className='text-2xl my-6 font-sans' ref={lema}></p>

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


                {/* PUBLICAIONES */}
            <section className='container mx-auto px-4 animate-fadeUp'>
                    <div id="publish" className='container mx-auto relative mt-6'>
                    <h2 className='font-semibold text-3xl relative z-10 w-fit text-center mx-auto bg-white px-6 py-2'>
                        Publicaciones destacadas
                    </h2>
                    <div className='text-red-900 border-2 absolute top-1/2 w-full left-0 z-0'></div>
                </div>
                <div id="services" className='container mx-auto relative mt-6'>
                </div>

                <div className='my-10 flex justify-between flex-wrap gap-5'>

                   

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
                            <li><a className="hover:text-red-600" href="#about">Servicios</a></li>
                            <li><a className="hover:text-red-600" href="#about">Nosotros</a></li>
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
