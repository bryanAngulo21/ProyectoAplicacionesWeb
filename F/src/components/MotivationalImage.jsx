import { useEffect, useState } from "react";

const MotivationalImage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/random-image");
        const data = await response.json();
        setImageUrl(data.imageUrl || "");
      } catch (error) {
        console.error("Error fetching motivational image:", error);
      }
    };

    fetchImage();
  }, []); // Se ejecuta SOLO cuando cargue la página → cambia en cada F5

  return (
    <div className="w-full md:w-1/2 relative">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Inspiracional"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export default MotivationalImage;
