import Proyecto from '../models/Proyecto.js';
import Donacion from '../models/Donacion.js';
import Estudiante from '../models/Estudiante.js';

// Dashboard para admin
export const dashboardAdmin = async (req, res) => {
  try {
    const [
      totalProyectos,
      proyectosPublicados,
      totalEstudiantes,
      totalDonaciones,
      donacionesExitosas,
      topDonantes
    ] = await Promise.all([
      Proyecto.countDocuments(),
      Proyecto.countDocuments({ estado: 'publicado' }),
      Estudiante.countDocuments({ status: true }),
      Donacion.countDocuments(),
      Donacion.aggregate([
        { $match: { estado: 'exitosa' } },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$monto' },
            count: { $sum: 1 }
          } 
        }
      ]),
      Donacion.aggregate([
        { $match: { estado: 'exitosa', donante: { $ne: null } } },
        { $group: { _id: '$donante', total: { $sum: '$monto' } } },
        { $sort: { total: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'estudiantes',
            localField: '_id',
            foreignField: '_id',
            as: 'estudiante'
          }
        },
        { $unwind: '$estudiante' }
      ])
    ]);

    const donacionesData = donacionesExitosas[0] || { total: 0, count: 0 };

    const proyectosPorCategoria = await Proyecto.aggregate([
      { $group: { _id: '$categoria', total: { $sum: 1 } } }
    ]);

    const ultimosProyectos = await Proyecto.find()
      .populate('autor', 'nombre apellido email')
      .sort({ createdAt: -1 })
      .limit(5);

    const ultimasDonaciones = await Donacion.find()
      .populate('donante', 'nombre apellido email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('donante monto mensaje createdAt');

    res.status(200).json({
      msg: "Dashboard administrador",
      data: {
        resumen: {
          totalProyectos,
          proyectosPublicados,
          totalEstudiantes,
          totalDonaciones: donacionesData.count,
          montoTotalDonaciones: donacionesData.total
        },
        categorias: proyectosPorCategoria,
        topDonantes,
        ultimosProyectos,
        ultimasDonaciones
      }
    });

  } catch (error) {
    console.error('❌ Dashboard admin error:', error);
    res.status(500).json({ msg: 'Error al obtener estadísticas' });
  }
};

// Dashboard para estudiante
export const dashboardEstudiante = async (req, res) => {
  try {
    const estudianteId = req.estudianteHeader._id;

    const [
      proyectos,
      donacionesPropias,
      donacionesTotales
    ] = await Promise.all([
      Proyecto.find({ autor: estudianteId }).sort({ createdAt: -1 }),
      Donacion.find({ donante: estudianteId }).sort({ createdAt: -1 }),
      Donacion.aggregate([
        { $match: { estado: 'exitosa' } },
        { $group: { _id: null, total: { $sum: '$monto' } } }
      ])
    ]);

    const totalProyectos = proyectos.length;
    const totalVistas = proyectos.reduce((sum, p) => sum + (p.vistas || 0), 0);
    const totalLikes = proyectos.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
    const proyectosPublicados = proyectos.filter(p => p.estado === 'publicado').length;
    
    const montoTotalDonado = donacionesPropias.reduce((sum, d) => sum + (d.monto || 0), 0);
    const montoTotalPlataforma = donacionesTotales[0]?.total || 0;

    // Donaciones recientes de toda la plataforma (públicas)
    const donacionesRecientes = await Donacion.find()
      .populate('donante', 'nombre apellido')
      .sort({ createdAt: -1 })
      .limit(3)
      .select('donante monto mensaje createdAt');

    res.status(200).json({
      msg: "Dashboard estudiante",
      data: {
        resumen: {
          totalProyectos,
          proyectosPublicados,
          totalVistas,
          totalLikes,
          totalDonacionesPropias: donacionesPropias.length,
          montoTotalDonado,
          montoTotalPlataforma
        },
        proyectosRecientes: proyectos.slice(0, 3),
        donacionesPropiasRecientes: donacionesPropias.slice(0, 3),
        donacionesRecientesPlataforma: donacionesRecientes
      }
    });

  } catch (error) {
    console.error('❌ Dashboard estudiante error:', error);
    res.status(500).json({ msg: 'Error al obtener estadísticas' });
  }
};