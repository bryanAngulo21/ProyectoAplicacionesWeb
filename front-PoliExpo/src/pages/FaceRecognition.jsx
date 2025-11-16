import React, { useRef, useState } from "react";
import axios from "axios";
import "./FacerRecognition.css";

function FacerRecognition() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Encender / apagar cámara
  const toggleCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setStream(null);
      setImageSrc(null);
      setResultado(null);
      return;
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = newStream;
      setStream(newStream);
      setImageSrc(null);
      setResultado(null);
    } catch (error) {
      alert("No se pudo acceder a la cámara. Revisa permisos.");
    }
  };

  // Tomar foto
  const takePhoto = () => {
    if (!videoRef.current) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setImageSrc(dataUrl);
    return dataUrl;
  };

  // Enviar foto al backend
  const enviarFoto = async () => {
    if (!stream) return alert("Primero enciende la cámara");

    const image = takePhoto();
    if (!image) return;

    // Apagar cámara después de capturar
    stream.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);

    setLoading(true);
    setResultado(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reconocer`, { image });
      setResultado(res.data);
    } catch (err) {
      alert("Error enviando foto al servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar atributos y emociones
  const mostrarAtributos = () => {
    if (!resultado?.photos?.[0]?.tags?.[0]) return null;

    const face = resultado.photos[0].tags[0];
    const attr = face.attributes;

    const emociones = {
      "😠 Enfado": attr.anger?.value,
      "😐 Neutral": attr.neutral?.value,
      "😊 Felicidad": attr.happiness?.value,
      "😰 Miedo": attr.fear?.value,
      "😲 Sorpresa": attr.surprise?.value,
      "😔 Tristeza": attr.sadness?.value,
      "😒 Disgusto": attr.disgust?.value,
    };

    const emocionesFiltradas = Object.entries(emociones).filter(([_, v]) => v !== undefined);

    return (
      <div className="resultado">
        <h2>🧠 Resultado del análisis</h2>

        <p><strong>👤 Género:</strong> {attr.gender.value}</p>
        <p><strong>🎂 Edad:</strong> {attr.age_est.value} años</p>
        <p><strong>😊 Sonrisa:</strong> {attr.smiling.value}%</p>

        {emocionesFiltradas.length > 0 && (
          <>
            <h3>💬 Emociones:</h3>
            <ul>
              {emocionesFiltradas.map(([emo, val]) => (
                <li key={emo}><strong>{emo}:</strong> {val}%</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="facer-container">
      <div className="app">
        <h1>Reconocimiento Facial con SkyBiometry</h1>

        <div className="video-container">
          <video ref={videoRef} autoPlay style={{ display: imageSrc ? "none" : "block" }} />
          {imageSrc && <img src={imageSrc} alt="captura" />}
        </div>

        <div className="botones">
          <button onClick={toggleCamera}>
            {stream ? "🛑 Apagar Cámara" : "📸 Iniciar Cámara"}
          </button>

          <button onClick={enviarFoto} disabled={!stream}>
            🔍 Capturar y Analizar
          </button>
        </div>

        {resultado && mostrarAtributos()}

        {loading && (
          <div className="overlay">
            <div className="toast">
              <div className="loader"></div>
              Procesando...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacerRecognition;
