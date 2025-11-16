// src/services/unsplashService.js

const ACCESS_KEY = "zg_pu9zJi6hfxDeVLzpJZIC1sZFJ868kcrmORsBQ3jE"

/**
 * Obtiene una imagen aleatoria de Unsplash según la query
 * @param {string} query - Palabra clave para buscar la imagen
 * @returns {Promise<string>} URL de la imagen
 */
export const getRandomImage = async (query = "motivational") => {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${ACCESS_KEY}`
        )
        const data = await response.json()
        return data.urls.full
    } catch (error) {
        console.error("Error obteniendo la imagen de Unsplash:", error)
        return "" // fallback en caso de error
    }
}
