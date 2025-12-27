import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { citasApi, especialidadesApi } from '../services/api';
import type { Cita } from '../types/cita';
import type { Especialidad } from '../types/especialidad';
import './ListaCitas.css';

type Alerta = { tipo: 'success' | 'error'; mensaje: string };

export function ListaCitas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [confirmandoIds, setConfirmandoIds] = useState<Set<number>>(new Set());
  const [cancelandoIds, setCancelandoIds] = useState<Set<number>>(new Set());

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
      const [citasData, especialidadesData] = await Promise.all([
        citasApi.listarCitas(),
        especialidadesApi.listarEspecialidades(),
      ]);
      setCitas(citasData);
      setEspecialidades(especialidadesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error al cargar citas:', err);
    } finally {
      setCargando(false);
    }
  };

  const confirmarCita = async (id: number) => {
    if (confirmandoIds.has(id)) return;
    
    const telefono = prompt('Ingresa el teléfono de confirmación (ej: +51999999999):');
    if (!telefono || telefono.trim() === '') {
      setAlerta({ tipo: 'error', mensaje: 'Teléfono requerido para confirmar' });
      return;
    }

    setConfirmandoIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      const actualizada = await citasApi.confirmarCita(id, telefono.trim());
      setCitas((prev) =>
        prev.map((cita) =>
          cita.id_cita === id ? { ...cita, ...(actualizada || {}), estado: 'CONFIRMADA' } : cita
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

  const cancelarCita = async (id: number) => {
    if (cancelandoIds.has(id)) return;
    
    if (!confirm(`¿Estás seguro de cancelar la cita #${id}?`)) return;

    setCancelandoIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      const actualizada = await citasApi.cancelarCita(id);
      setCitas((prev) =>
        prev.map((cita) =>
          cita.id_cita === id ? { ...cita, ...(actualizada || {}), estado: 'CANCELADA' } : cita
        )
      );
      setAlerta({ tipo: 'success', mensaje: `Cita #${id} cancelada` });
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'No se pudo cancelar la cita',
      });
      console.error('Error al cancelar cita:', err);
    } finally {
      setCancelandoIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Función para obtener el nombre de la especialidad
  const obtenerNombreEspecialidad = (id_especialidad: number): string => {
    if (!id_especialidad) return 'No definido';
    const especialidad = especialidades.find(e => e.id_especialidad === id_especialidad);
    return especialidad ? especialidad.nombre : `ID: ${id_especialidad}`;
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // Función para formatear la hora
  const formatearHora = (hora: string) => {
    // La hora viene como "00:02:00", tomamos solo HH:MM
    return hora.substring(0, 5);
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
              <th>ID Paciente</th>
              <th>Especialidad</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Canal</th>
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
                <td className="col-paciente">{cita.id_paciente}</td>
                <td className="col-especialidad">{obtenerNombreEspecialidad(cita.id_especialidad)}</td>
                <td className="col-fecha">{formatearFecha(cita.fecha)}</td>
                <td className="col-hora">{formatearHora(cita.hora)}</td>
                <td className="col-motivo">{cita.canal}</td>
                <td className="col-estado">
                  <span className={`cita-estado estado-${cita.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                    {cita.estado}
                  </span>
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
                      disabled={confirmandoIds.has(cita.id_cita) || cita.estado?.toLowerCase() === 'confirmada' || cita.estado?.toLowerCase() === 'cancelada'}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        confirmarCita(cita.id_cita);
                      }}
                    >
                      {confirmandoIds.has(cita.id_cita) ? 'Confirmando...' : 'Confirmar'}
                    </button>
                    <button
                      type="button"
                      className="btn-cancelar"
                      disabled={cancelandoIds.has(cita.id_cita) || cita.estado?.toLowerCase() === 'cancelada'}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        cancelarCita(cita.id_cita);
                      }}
                    >
                      {cancelandoIds.has(cita.id_cita) ? 'Cancelando...' : 'Cancelar'}
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

