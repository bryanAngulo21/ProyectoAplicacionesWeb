import { create } from 'zustand';

const storeProyectos = create((set) => ({
  proyectos: [],
  proyectoDetalle: null,
  loading: false,
  error: null,
  
  // Actualizar lista de proyectos
  setProyectos: (proyectos) => set({ proyectos }),
  
  // Agregar un proyecto
  agregarProyecto: (proyecto) => 
    set((state) => ({ proyectos: [proyecto, ...state.proyectos] })),
  
  // Actualizar un proyecto
  actualizarProyecto: (proyectoActualizado) =>
    set((state) => ({
      proyectos: state.proyectos.map((proyecto) =>
        proyecto._id === proyectoActualizado._id ? proyectoActualizado : proyecto
      ),
    })),
  
  // Eliminar un proyecto
  eliminarProyecto: (id) =>
    set((state) => ({
      proyectos: state.proyectos.filter((proyecto) => proyecto._id !== id),
    })),
  
  // Establecer proyecto detalle
  setProyectoDetalle: (proyecto) => set({ proyectoDetalle: proyecto }),
  
  // Limpiar estado
  limpiarEstado: () => set({ proyectos: [], proyectoDetalle: null, error: null }),
}));

export default storeProyectos;