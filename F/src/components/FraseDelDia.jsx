import { useEffect, useState } from "react";

export default function FraseDelDia() {
  const [quote, setQuote] = useState({ q: "", a: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/frases");
        const data = await response.json();
        setQuote(data);
      } catch (error) {
        console.error("Error cargando la frase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) {
    return (
      <section className='container mx-auto px-4 py-6 text-center bg-white rounded-lg shadow-md my-6'>
        <h3 className='text-xl font-semibold text-red-800 mb-2'>Cita del día</h3>
        <p className='text-lg italic'>Cargando frase...</p>
      </section>
    );
  }

  return (
    <section className='container mx-auto px-4 py-6 text-center bg-white rounded-lg shadow-md my-6'>
      <h3 className='text-xl font-semibold text-red-800 mb-2'>Cita del día</h3>
      <p className='text-lg italic'>"{quote.q}"</p>
      <p className='text-md font-bold mt-1'>- {quote.a}</p>
    </section>
  );
}
