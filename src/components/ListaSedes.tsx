import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sedesApi } from '../services/api';
import type { Sede } from '../types/sede';
import { FormularioSede } from './FormularioSede';
import './ListaSedes.css';

export function ListaSedes() {
  const navigate = useNavigate();
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [sedeEditando, setSedeEditando] = useState<Sede | null>(null);

  const cargarSedes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await sedesApi.listarSedes();
      setSedes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las sedes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSedes();
  }, []);

  const handleNuevaSede = () => {
    setSedeEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarSede = (sede: Sede) => {
    setSedeEditando(sede);
    setMostrarFormulario(true);
  };

  const handleVerSede = (id: number) => {
    navigate(`/sedes/${id}`);
  };

  const handleEliminarSede = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta sede?')) {
      return;
    }

    try {
      await sedesApi.eliminarSede(id);
      await cargarSedes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la sede');
    }
  };

  const handleFormularioExito = () => {
    setMostrarFormulario(false);
    setSedeEditando(null);
    cargarSedes();
  };

  const handleFormularioCancelar = () => {
    setMostrarFormulario(false);
    setSedeEditando(null);
  };

  if (cargando) {
    return (
      <div className="sede-cargando">
        <div className="spinner-sede"></div>
        <p>Cargando sedes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sede-error">
        <p>❌ {error}</p>
        <button onClick={cargarSedes} className="btn-nueva-sede">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="lista-sedes">
        <div className="lista-sedes-header">
          <h2>Gestión de Sedes</h2>
          <button onClick={handleNuevaSede} className="btn-nueva-sede">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Nueva Sede
          </button>
        </div>

        <table className="tabla-sedes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sedes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No hay sedes registradas
                </td>
              </tr>
            ) : (
              sedes.map((sede) => (
                <tr key={sede.id_sede}>
                  <td>{sede.id_sede}</td>
                  <td style={{ fontWeight: 600 }}>{sede.nombre}</td>
                  <td>{sede.direccion}</td>
                  <td>{sede.telefono}</td>
                  <td>
                    <div className="acciones-sede">
                      <button
                        onClick={() => handleVerSede(sede.id_sede)}
                        className="btn-accion btn-ver"
                        title="Ver especialidades"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Ver
                      </button>
                      <button
                        onClick={() => handleEditarSede(sede)}
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
                        onClick={() => handleEliminarSede(sede.id_sede)}
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
        <FormularioSede
          sede={sedeEditando}
          onExito={handleFormularioExito}
          onCancelar={handleFormularioCancelar}
        />
      )}
    </>
  );
}
