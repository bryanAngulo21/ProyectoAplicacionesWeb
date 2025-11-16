import { uploadToImgbb } from "../api/imgbb.js";
import { analizarRostro } from "../api/skybiometry.js";

export const reconocerRostro = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image)
      return res.status(400).json({ message: "No se envió imagen" });

    // 1. Subir imagen a imgbb
    const imageUrl = await uploadToImgbb(image);

    // 2. Enviar URL a SkyBiometry
    const resultado = await analizarRostro(imageUrl);

    return res.json(resultado);

  } catch (error) {
    console.error("Error en reconocerRostro:", error.message);
    return res.status(500).json({ message: "Error al procesar la imagen" });
  }
};
