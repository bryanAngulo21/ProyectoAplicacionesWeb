{/* Landing Page  de PoliExpo*/}
import logoPoliExpo from '../assets/logo-PoliExpo.webp'
import logoStudentsMain from '../assets/students-group.webp'
import AppStoreImage from '../assets/appstore.png'
import GooglePlayImage from '../assets/googleplay.png'
import developMan from '../assets/develop-man.webp'
import { Link } from 'react-router'

import { FaWhatsapp } from "react-icons/fa6";

import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

import { FaRegShareFromSquare } from "react-icons/fa6";
import { MdPublish } from "react-icons/md";
import { MdConnectWithoutContact } from "react-icons/md";
import { MdScreenSearchDesktop } from "react-icons/md";
import { MdOutlineRateReview } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaRegThumbsUp } from "react-icons/fa6";
import { SiQuicklook } from "react-icons/si";
import { MdGroups2 } from "react-icons/md";

import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

import { FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

//api
import { fetchQuote } from "../api/zenQuotes"; // Ajusta la ruta según tu estructura

export const Home = () => {
const [open, setOpen] = useState(false);

 // Estado para la cita del día
    const [quote, setQuote] = useState({ q: "", a: "" });

    // useEffect para obtener la cita
    useEffect(() => {
        const getQuote = async () => {
            const data = await fetchQuote();
            setQuote(data);
        };
        getQuote();
    }, []);

    return (
        <>
            <header className="container mx-auto px-4 py-4 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50 transition-all">

            <img src={logoPoliExpo} alt="logo" className="w-20 h-20" />

            <h1 className='text-2xl font-extrabold text-red-800'>
                Poli<span className='text-black'>Expo</span>
            </h1>

            {/* BOTÓN HAMBURGUESA (visible solo en móvil) */}
            <button 
                onClick={() => setOpen(!open)} 
                className="text-3xl md:hidden text-red-800"
            >
                {open ? <HiX /> : <HiMenu />}
            </button>

            {/* MENU */}
            <nav className={`absolute top-24 left-0 w-full bg-white shadow-md py-6 flex flex-col items-center gap-6 text-lg font-inter transition-all duration-300 
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



            <main className='text-center py-6 px-8 bg-red-50  md:text-center md:flex justify-between items-center gap-10 md:py-1'>
                <div className=''>
                    <h1 className='font-inter text-red-800 uppercase text-4xl my-4 md:text-6xl'>Muestra tu mejor trabajo</h1>

                <div>  
                    <p className='text-2xl my-6 font-sans'>Una exposición permanente del talento estudiantil</p>
                </div>

                </div>

                
                <div className='hidden md:block'>
                    <img src={logoStudentsMain} alt="hero" />
                </div>
                
            </main>


            <section className='container mx-auto px-4'>

                <div id="about" className='container mx-auto relative mt-6'>
                    <h2 className=' font-semibold text-3xl relative z-1 w-50 text-center mx-auto bg-white'>Nosotros</h2>
                    
                    <div className='text-red-900 border-2 absolute top-1/2 w-full z-0' />
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
                        <p className='my-4'>PoliExpo es el espacio en el que puedes compartir tus ideas, proyectos y talento con la comunidad estudiantil.</p>

                        <ul className='space-y-4'>
                                <li><MdPublish className='inline text-2xl mr-2' />Publica tus proyectos</li>
                                <li><MdConnectWithoutContact className='inline text-2xl mr-2' />Conéctate con otros estudiantes</li>
                                <li><FaMoneyBillTrendUp className='inline text-2xl mr-2' />Potencia y difunde tus ideas</li>
                                <li><MdScreenSearchDesktop className='inline text-2xl mr-2' />Explora nuevas publicaciones</li>
                                <li><MdOutlineRateReview className='inline text-2xl mr-2' />Comenta y retroalimenta</li>
                                <li><FaRegShareFromSquare className='inline text-2xl mr-2' />Comparte experiencias</li>
                                <li><FaRegThumbsUp className='inline text-2xl mr-2' />Construye comunidad</li>
                        </ul>
                        <p className='font-inter text-center my-4'>Haz crecer esta comunidad y descarga la aplicación</p>


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

            <section className='container mx-auto px-4 py-6 text-center bg-white rounded-lg shadow-md my-6'>
                <h3 className='text-xl font-semibold text-red-800 mb-2'>Cita del día</h3>
                <p className='text-lg italic'>"{quote.q}"</p>
                <p className='text-md font-bold mt-1'>- {quote.a}</p>
            </section>



            <section className='container mx-auto px-4'>

                <div id="services" className='container mx-auto relative mt-6'>
                    <h2 className='font-semibold text-3xl relative z-1 w-50 text-center mx-auto bg-white'>Servicios</h2>
                    <div className='text-red-900 border-2 absolute top-1/2 w-full z-0' />
                </div>

                <div className='my-10 flex justify-between flex-wrap gap-5'>

                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 sm:flex-1">
                        <MdPublish className='inline text-5xl' />
                        <h4>
                        <Link to="/login" className="text-xl font-inter py-4 text-red-700 hover:underline">Publicar</Link></h4>
                        <p className="my-4 px-2">Comparte tus proyectos académicos y extracurriculares para que otros puedan conocerlos.
                        </p>

                        <hr className="border-1 border-red-900 absolute w-full" />
                    </div>


                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 bg-red-50 sm:flex-1">
                        <SiQuicklook className='inline text-5xl' />
                        <h4>

                        <Link to="/login" className="text-xl font-inter py-4 text-red-700 hover:underline">Ver Proyectos</Link></h4>
                        <p className="my-4 px-2">Explora los proyectos académicos y extracurriculares realizados por estudiantes de diversos semestres.
                        </p>

                        <hr className="border-1 border-red-900 absolute w-full" />
                    </div>

                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 sm:flex-1">
                        <MdGroups2 className='inline text-5xl' />
                        <h4>
                            
                        <Link  to="/login" className="text-xl font-inter py-4 text-red-700 hover:underline">Miembros</Link></h4>
                        <p className="my-4 px-2">Conoce a los miembros y únete a esta comunidad para compartir experiencia, conocimiento y creatividad.</p>
                        <hr className="border-1 border-red-900 absolute w-full" />
                    </div>
                </div>
            </section>
            
                

            <footer className="bg-red-50 mt-20 rounded-tr-3xl rounded-tl-3xl py-10 px-6 text-center space-y-10">

                    {/* Título */}

                    <div id="footer" className='container mx-auto relative mt-6'> <h2 className='font-semibold text-3xl relative z-1 w-50 text-center mx-auto bg-red-50'>Contáctanos</h2>
                    <div className='text-red-900 border-2 absolute top-1/2 w-full z-0' /> </div>
                    

                    {/* Suscripción */}
                    <form className="max-w-lg mx-auto w-full px-4">
                        <fieldset className="border-2 border-red-900 rounded-md p-4">
                        <legend className="bg-red-900 text-white px-3 py-1 rounded-sm text-left">Suscríbete</legend>

                        <div className="flex flex-col sm:flex-row gap-4 mt-3">
                            <input 
                            type="email" 
                            placeholder="Ingresa tu correo electrónico" 
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                            />
                            <button className="bg-red-900 text-white px-6 py-2 rounded-md hover:bg-red-700 transition">
                            Enviar
                            </button>
                        </div>
                        </fieldset>
                    </form>

                    {/* Redes sociales */}
                    <div className="flex justify-center gap-6 text-3xl text-red-900">
                        <a href="https://www.facebook.com/"><FaFacebook /></a>
                        <a href="https://www.instagram.com/"><FaSquareInstagram /></a>
                        <a href="https://x.com/"><FaXTwitter /></a>
                        <a href="https://web.whatsapp.com/"><FaWhatsapp /></a>
                    </div>

                    {/* Info de contacto */}
                    <div className="text-center space-y-2">

                        <div className="flex justify-center items-center gap-2">
                            <IoMdMail className="text-xl" />
                            <p className="font-inter">admin@poliexpo.com</p>
                        </div>

                        <div className="flex justify-center items-center gap-2">
                            <FaPhone className="text-xl" />
                            <p className="font-inter">099 999 9999</p>
                        </div>

                    </div>

                    <hr className="border-red-800 w-full" />

                    <p className="font-inter font-semibold">
                        copyright © POLIEXPO 2025
                    </p>

            </footer>


        </>
    )
}

