import fetch from 'node-fetch';

export const sugerirTitulos = async (req, res) => {
  try {
    const { descripcion, tecnologias } = req.body;

    if (!descripcion) {
      return res.status(400).json({ msg: "La descripción es requerida" });
    }

    // Si tienes API de Hugging Face
    if (process.env.HF_API_TOKEN) {
      try {
        const response = await fetch(
          'https://api-inference.huggingface.co/models/google/flan-t5-base',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: `Sugiere 3 títulos creativos para un proyecto académico sobre: ${descripcion}. Tecnologías: ${Array.isArray(tecnologias) ? tecnologias.join(', ') : 'varias tecnologías'}. Los títulos deben ser en español.`,
              parameters: { 
                max_new_tokens: 150,
                temperature: 0.8,
                do_sample: true
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          let titulos = data[0]?.generated_text || '';
          
          // Procesar los títulos
          titulos = titulos.split('\n')
            .map(t => t.replace(/^\d+[\.\)\-\s]+/, '').trim())
            .filter(t => t.length > 5 && t.length < 100)
            .slice(0, 3);

          if (titulos.length > 0) {
            return res.status(200).json({
              msg: "Sugerencias generadas con IA",
              titulos
            });
          }
        }
      } catch (hfError) {
        console.log("⚠️ IA no disponible, usando lógica local:", hfError.message);
      }
    }

    // Lógica local si no hay IA o falla
    const palabras = descripcion.toLowerCase()
      .split(/[\s,.]+/)
      .filter(palabra => palabra.length > 3)
      .slice(0, 5);

    const tech = Array.isArray(tecnologias) && tecnologias.length > 0 
      ? tecnologias.slice(0, 3).join(' + ') 
      : 'tecnologías modernas';

    // Generar sugerencias basadas en contenido
    const tipoProyecto = descripcion.toLowerCase().includes('web') ? 'Web' :
                        descripcion.toLowerCase().includes('móvil') ? 'Móvil' :
                        descripcion.toLowerCase().includes('data') ? 'Datos' : 'Sistema';

    const sugerencias = [
      `${tipoProyecto} de ${palabras[0] || 'Innovación'} - ${tech}`,
      `Proyecto ${palabras[1] || 'Académico'}: ${palabras.slice(0, 2).join(' ') || 'Desarrollo Integral'}`,
      `Implementación ${tech} para ${palabras[2] || 'Gestión'} ${palabras[3] || 'Eficiente'}`
    ].filter(s => s.length > 10);

    res.status(200).json({
      msg: process.env.HF_API_TOKEN ? "Sugerencias generadas localmente" : "Sugerencias generadas",
      titulos: sugerencias
    });

  } catch (error) {
    console.error('❌ Error IA:', error);
    res.status(500).json({ 
      msg: 'Error al generar sugerencias',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};