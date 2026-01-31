import Mensaje from "../models/Mensaje.js";
import Proyecto from "../models/Proyecto.js";

/* =========================
   ENVIAR MENSAJE A UN PROYECTO
========================= */
const enviarMensaje = async (req, res) => {
  try {
    const { proyectoId } = req.params;
    const { contenido } = req.body;
    const emisorId = req.estudianteHeader._id;
    
    if (!contenido) {
      return res.status(400).json({ msg: "El mensaje no puede estar vacío" });
    }

    // Verificar que el proyecto exista
    const proyecto = await Proyecto.findById(proyectoId);
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    const mensaje = new Mensaje({
      proyecto: proyectoId,
      emisor: emisorId,
      contenido,
    });

    await mensaje.save();

    res.status(201).json({
      msg: "Mensaje enviado correctamente",
      mensaje,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al enviar el mensaje" });
  }
};

/* =========================
   LISTAR MENSAJES DE UN PROYECTO
========================= */
const listarMensajesProyecto = async (req, res) => {
  try {
    const { proyectoId } = req.params;

    const mensajes = await Mensaje.find({ proyecto: proyectoId })
      .populate("emisor", "nombre apellido email fotoPerfil")
      .sort({ createdAt: 1 });

    res.status(200).json(mensajes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los mensajes" });
  }
};

export {
  enviarMensaje,
  listarMensajesProyecto,
};
