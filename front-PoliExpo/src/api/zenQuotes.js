import { translateText } from "./translateApi.js"; // Asegúrate de ajustar la ruta

export const fetchQuote = async () => {
  try {
    // Usamos AllOrigins como proxy CORS
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = "https://zenquotes.io/api/random";

    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    console.log("Status:", response.status);

    const text = await response.text();
    const result = JSON.parse(text);

    // La API de AllOrigins devuelve { contents: "..." }
    const data = JSON.parse(result.contents);

    if (Array.isArray(data) && data.length > 0) {
      const quote = data[0].q;
      const author = data[0].a;

      // 🔹 Traducir la cita al español
      const translatedQuote = await translateText(quote);

      return { q: translatedQuote, a: author };
    } else {
      return { q: "No se pudo cargar la cita", a: "" };
    }
  } catch (error) {
    console.error("Error fetching quote via proxy:", error);
    return { q: "No se pudo cargar la cita", a: "" };
  }
};
