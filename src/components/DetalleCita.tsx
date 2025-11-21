import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { citasApi } from '../services/api';
import type { Cita } from '../types/cita';
import './DetalleCita.css';

type Alerta = { tipo: 'success' | 'error'; mensaje: string };

export function DetalleCita() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cita, setCita] = useState<Cita | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    const cargarCita = async () => {
      if (!id) return;
      
      try {
        setCargando(true);
        setError(null);
        const datos = await citasApi.obtenerCitaPorId(parseInt(id, 10));
        setCita(datos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error al cargar la cita:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarCita();
  }, [id]);

  useEffect(() => {
    if (!alerta) return;
    const timer = setTimeout(() => setAlerta(null), 3500);
    return () => clearTimeout(timer);
  }, [alerta]);

  const handleConfirmar = async () => {
    if (!cita || confirmando || cita.estado?.toLowerCase() === 'confirmada') return;
    setConfirmando(true);
    try {
      const actualizada = await citasApi.confirmarCita(cita.id_cita);
      setCita((prev) =>
        prev ? { ...prev, ...(actualizada || {}), estado: 'Confirmada' } : prev
      );
      setAlerta({ tipo: 'success', mensaje: `Cita #${cita.id_cita} confirmada` });
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'No se pudo confirmar la cita',
      });
      console.error('Error al confirmar la cita:', err);
    } finally {
      setConfirmando(false);
    }
  };

  if (cargando) {
    return <div className="cargando">Cargando detalles de la cita...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="error">
        <p>Cita no encontrada</p>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  const yaConfirmada = cita.estado?.toLowerCase() === 'confirmada';

  return (
    <div className="detalle-cita">
      <div className="detalle-cita-header">
        <h2>Detalle de la Cita #{cita.id_cita}</h2>
        <div className="acciones-header">
          <button onClick={() => navigate('/')} className="btn-volver">
            Volver a la Lista
          </button>
          <button
            type="button"
            className="btn-confirmar"
            disabled={yaConfirmada || confirmando}
            onClick={handleConfirmar}
          >
            {yaConfirmada ? 'Confirmada' : confirmando ? 'Confirmando...' : 'Confirmar cita'}
          </button>
        </div>
      </div>
      {alerta && (
        <div className={`alerta ${alerta.tipo === 'success' ? 'alerta-success' : 'alerta-error'}`}>
          {alerta.mensaje}
        </div>
      )}
      <div className="detalle-cita-content">
        <div className="detalle-seccion">
          <h3>Informacion del Paciente</h3>
          <p><strong>Nombre:</strong> {cita.paciente}</p>
        </div>
        <div className="detalle-seccion">
          <h3>Informacion del Medico</h3>
          <p><strong>Nombre:</strong> {cita.medico}</p>
        </div>
        <div className="detalle-seccion">
          <h3>Fecha y Hora</h3>
          <p><strong>Fecha:</strong> {cita.fecha}</p>
          <p><strong>Hora:</strong> {cita.hora}</p>
        </div>
        {cita.motivo && (
          <div className="detalle-seccion">
            <h3>Motivo de la Consulta</h3>
            <p>{cita.motivo}</p>
          </div>
        )}
        {cita.estado && (
          <div className="detalle-seccion">
            <h3>Estado</h3>
            <p>
              <span className={`cita-estado estado-${cita.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                {cita.estado}
              </span>
            </p>
          </div>
        )}
        {cita.notas && (
          <div className="detalle-seccion">
            <h3>Notas Adicionales</h3>
            <p>{cita.notas}</p>
          </div>
        )}
        {!cita.motivo && !cita.estado && !cita.notas && (
          <div className="detalle-seccion">
            <p style={{ color: '#5f6368', fontStyle: 'italic' }}>
              No hay informacion adicional disponible para esta cita.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

