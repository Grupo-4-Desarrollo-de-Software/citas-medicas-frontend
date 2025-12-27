import { useEffect, useState } from 'react';
import { especialidadesApi } from '../services/api';
import type { Especialidad } from '../types/especialidad';
import { FormularioEspecialidad } from './FormularioEspecialidad';
import './ListaEspecialidades.css';

export function ListaEspecialidades() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [especialidadEditando, setEspecialidadEditando] = useState<Especialidad | null>(null);

  const cargarEspecialidades = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await especialidadesApi.listarEspecialidades();
      setEspecialidades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las especialidades');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const handleNuevaEspecialidad = () => {
    setEspecialidadEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarEspecialidad = (especialidad: Especialidad) => {
    setEspecialidadEditando(especialidad);
    setMostrarFormulario(true);
  };

  const handleEliminarEspecialidad = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta especialidad?')) {
      return;
    }

    try {
      await especialidadesApi.eliminarEspecialidad(id);
      await cargarEspecialidades();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la especialidad');
    }
  };

  const handleFormularioExito = () => {
    setMostrarFormulario(false);
    setEspecialidadEditando(null);
    cargarEspecialidades();
  };

  const handleFormularioCancelar = () => {
    setMostrarFormulario(false);
    setEspecialidadEditando(null);
  };

  if (cargando) {
    return (
      <div className="especialidad-cargando">
        <div className="spinner-especialidad"></div>
        <p>Cargando especialidades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="especialidad-error">
        <p>❌ {error}</p>
        <button onClick={cargarEspecialidades} className="btn-nueva-especialidad">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="lista-especialidades">
        <div className="lista-especialidades-header">
          <h2>Gestión de Especialidades</h2>
          <button onClick={handleNuevaEspecialidad} className="btn-nueva-especialidad">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Nueva Especialidad
          </button>
        </div>

        <table className="tabla-especialidades">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {especialidades.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No hay especialidades registradas
                </td>
              </tr>
            ) : (
              especialidades.map((especialidad) => (
                <tr key={especialidad.id_especialidad}>
                  <td>{especialidad.id_especialidad}</td>
                  <td style={{ fontWeight: 600 }}>{especialidad.nombre}</td>
                  <td>{especialidad.descripcion || 'No definido'}</td>
                  <td>
                    <div className="acciones-especialidad">
                      <button
                        onClick={() => handleEditarEspecialidad(especialidad)}
                        className="btn-accion btn-editar"
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarEspecialidad(especialidad.id_especialidad)}
                        className="btn-accion btn-eliminar"
                        title="Eliminar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mostrarFormulario && (
        <FormularioEspecialidad
          especialidad={especialidadEditando}
          onExito={handleFormularioExito}
          onCancelar={handleFormularioCancelar}
        />
      )}
    </>
  );
}
