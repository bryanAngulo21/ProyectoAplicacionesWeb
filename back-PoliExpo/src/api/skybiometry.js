import axios from "axios";

export const analizarRostro = async (imageUrl) => {
  try {
    const response = await axios.get(
      "https://api.skybiometry.com/fc/faces/detect.json",
      {
        params: {
          api_key: process.env.SKYBIOMETRY_API_KEY,
          api_secret: process.env.SKYBIOMETRY_API_SECRET,
          urls: imageUrl,
          attributes: "all",
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error en SkyBiometry:", error.response?.data);
    throw new Error("No se pudo analizar la imagen");
  }
};
