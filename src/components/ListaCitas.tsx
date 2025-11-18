import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citasApi } from '../services/api';
import type { Cita } from '../types/cita';
import './ListaCitas.css';

export function ListaCitas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await citasApi.listarCitas();
      setCitas(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error al cargar citas:', err);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <div className="cargando">Cargando citas...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={cargarCitas}>Reintentar</button>
      </div>
    );
  }

  if (citas.length === 0) {
    return <div className="sin-citas">No hay citas disponibles</div>;
  }

  return (
    <div className="lista-citas">
      <div className="lista-citas-header">
        <h2>Lista de Citas Médicas</h2>
        <button onClick={cargarCitas} className="btn-refrescar">
          🔄 Actualizar
        </button>
      </div>
      <div className="tabla-container">
        <table className="tabla-citas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr 
                key={cita.id_cita} 
                className="fila-cita"
                onClick={() => navigate(`/citas/${cita.id_cita}`)}
                style={{ cursor: 'pointer' }}
              >
                <td className="col-id">#{cita.id_cita}</td>
                <td className="col-paciente">{cita.paciente}</td>
                <td className="col-medico">{cita.medico}</td>
                <td className="col-fecha">{cita.fecha}</td>
                <td className="col-hora">{cita.hora}</td>
                <td className="col-motivo">{cita.motivo || '-'}</td>
                <td className="col-estado">
                  {cita.estado ? (
                    <span className={`cita-estado estado-${cita.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                      {cita.estado}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="col-acciones" onClick={(e) => e.stopPropagation()}>
                  <button 
                    type="button"
                    className="btn-ver-detalle"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/citas/${cita.id_cita}`);
                    }}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

