import axios from "axios";
import FormData from "form-data";

export const uploadToImgbb = async (base64Image) => {
  try {
    const apiKey = process.env.IMGBB_API_KEY;
    const formData = new FormData();

    // quitar "data:image/jpeg;base64,"
    formData.append("image", base64Image.split(",")[1]);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      { headers: formData.getHeaders() }
    );

    return response.data.data.url;

  } catch (error) {
    console.error("Error subiendo a Imgbb:", error.message);
    throw new Error("No se pudo subir la imagen a Imgbb");
  }
};
