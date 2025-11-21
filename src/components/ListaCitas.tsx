import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { citasApi } from '../services/api';
import type { Cita } from '../types/cita';
import './ListaCitas.css';

type Alerta = { tipo: 'success' | 'error'; mensaje: string };

export function ListaCitas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [confirmandoIds, setConfirmandoIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    if (!alerta) return;
    const timer = setTimeout(() => setAlerta(null), 3500);
    return () => clearTimeout(timer);
  }, [alerta]);

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

  const confirmarCita = async (id: number) => {
    if (confirmandoIds.has(id)) return;
    setConfirmandoIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      const actualizada = await citasApi.confirmarCita(id);
      setCitas((prev) =>
        prev.map((cita) =>
          cita.id_cita === id ? { ...cita, ...(actualizada || {}), estado: 'Confirmada' } : cita
        )
      );
      setAlerta({ tipo: 'success', mensaje: `Cita #${id} confirmada` });
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'No se pudo confirmar la cita',
      });
      console.error('Error al confirmar cita:', err);
    } finally {
      setConfirmandoIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
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
        <h2>Lista de Citas Medicas</h2>
        <button onClick={cargarCitas} className="btn-refrescar">
          Actualizar
        </button>
      </div>
      {alerta && (
        <div className={`alerta ${alerta.tipo === 'success' ? 'alerta-success' : 'alerta-error'}`}>
          {alerta.mensaje}
        </div>
      )}
      <div className="tabla-container">
        <table className="tabla-citas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Medico</th>
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
                  <div className="acciones">
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
                    <button
                      type="button"
                      className="btn-confirmar"
                      disabled={confirmandoIds.has(cita.id_cita) || cita.estado?.toLowerCase() === 'confirmada'}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        confirmarCita(cita.id_cita);
                      }}
                    >
                      {confirmandoIds.has(cita.id_cita) ? 'Confirmando...' : 'Confirmar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

