import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { citasApi, especialidadesApi, pacientesApi, sedesApi } from '../services/api';
import type { Cita } from '../types/cita';
import type { Especialidad } from '../types/especialidad';
import type { Paciente } from '../types/paciente';
import type { Sede } from '../types/sede';
import './DetalleCita.css';

type Alerta = { tipo: 'success' | 'error'; mensaje: string };

export function DetalleCita() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cita, setCita] = useState<Cita | null>(null);
  const [especialidad, setEspecialidad] = useState<Especialidad | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [sede, setSede] = useState<Sede | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    const cargarCita = async () => {
      if (!id) return;
      
      try {
        setCargando(true);
        setError(null);
        const datos = await citasApi.obtenerCitaPorId(parseInt(id, 10));
        setCita(datos);
        
        // Cargar especialidad
        if (datos.id_especialidad) {
          try {
            const especialidadData = await especialidadesApi.obtenerEspecialidadPorId(datos.id_especialidad);
            setEspecialidad(especialidadData);
          } catch (err) {
            console.error('Error al cargar especialidad:', err);
          }
        }
        
        // Cargar paciente
        if (datos.id_paciente) {
          try {
            const pacienteData = await pacientesApi.obtenerPacientePorId(datos.id_paciente);
            setPaciente(pacienteData);
          } catch (err) {
            console.error('Error al cargar paciente:', err);
          }
        }
        
        // Cargar sede
        if (datos.id_sede) {
          try {
            const sedeData = await sedesApi.obtenerSedePorId(datos.id_sede);
            setSede(sedeData);
          } catch (err) {
            console.error('Error al cargar sede:', err);
          }
        }
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
    if (!cita || confirmando || cita.estado?.toLowerCase().includes('confirmad')) return;
    
    const telefono = prompt('Ingresa el teléfono de confirmación (ej: +51999999999):');
    if (!telefono || telefono.trim() === '') {
      setAlerta({ tipo: 'error', mensaje: 'Teléfono requerido para confirmar' });
      return;
    }

    setConfirmando(true);
    try {
      const actualizada = await citasApi.confirmarCita(cita.id_cita, telefono.trim());
      setCita((prev) =>
        prev ? { ...prev, ...(actualizada || {}), estado: 'CONFIRMADA' } : prev
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

  const handleCancelar = async () => {
    if (!cita || cancelando || cita.estado?.toLowerCase().includes('cancelad')) return;
    
    if (!confirm(`¿Estás seguro de cancelar la cita #${cita.id_cita}?`)) return;

    setCancelando(true);
    try {
      const actualizada = await citasApi.cancelarCita(cita.id_cita);
      setCita((prev) =>
        prev ? { ...prev, ...(actualizada || {}), estado: 'CANCELADA' } : prev
      );
      setAlerta({ tipo: 'success', mensaje: `Cita #${cita.id_cita} cancelada` });
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'No se pudo cancelar la cita',
      });
      console.error('Error al cancelar la cita:', err);
    } finally {
      setCancelando(false);
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long' 
    });
  };

  // Función para formatear la hora
  const formatearHora = (hora: string) => {
    return hora.substring(0, 5);
  };

  // Función para obtener la clase CSS según el estado
  const obtenerClaseEstado = (estado: string): string => {
    const estadoNormalizado = estado.toLowerCase().trim();
    
    if (estadoNormalizado.includes('confirmada') || estadoNormalizado.includes('confirmed')) {
      return 'estado-confirmada';
    }
    if (estadoNormalizado.includes('cancelada') || estadoNormalizado.includes('canceled') || estadoNormalizado.includes('cancelled')) {
      return 'estado-cancelada';
    }
    if (estadoNormalizado.includes('completada') || estadoNormalizado.includes('completed')) {
      return 'estado-completada';
    }
    if (estadoNormalizado.includes('proceso') || estadoNormalizado.includes('progress')) {
      return 'estado-en-proceso';
    }
    if (estadoNormalizado.includes('programada') || estadoNormalizado.includes('scheduled') || estadoNormalizado.includes('pendiente') || estadoNormalizado.includes('pending')) {
      return 'estado-programada';
    }
    
    return 'estado-programada'; // Por defecto
  };

  // Función para obtener estilos inline según el estado
  const obtenerEstilosEstado = (estado: string): React.CSSProperties => {
    const estadoNormalizado = estado.toLowerCase().trim();
    
    if (estadoNormalizado.includes('confirmad') || estadoNormalizado.includes('confirmed')) {
      return { background: '#ecfdf3', color: '#166534', border: '1px solid #bbf7d0' };
    }
    if (estadoNormalizado.includes('cancelad') || estadoNormalizado.includes('canceled') || estadoNormalizado.includes('cancelled')) {
      return { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecdd3' };
    }
    if (estadoNormalizado.includes('completad') || estadoNormalizado.includes('completed')) {
      return { background: '#ecfdf3', color: '#166534', border: '1px solid #bbf7d0' };
    }
    if (estadoNormalizado.includes('proceso') || estadoNormalizado.includes('progress')) {
      return { background: '#fef3c7', color: '#92400e', border: '1px solid #fbbf24' };
    }
    // Por defecto: programada
    return { background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' };
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

  const yaConfirmada = cita.estado?.toLowerCase().includes('confirmad');
  const yaCancelada = cita.estado?.toLowerCase().includes('cancelad');

  return (
    <div className="detalle-cita">
      {alerta && (
        <div className={`alerta ${alerta.tipo === 'success' ? 'alerta-success' : 'alerta-error'}`}>
          {alerta.mensaje}
        </div>
      )}
      
      <div className="detalle-cita-header">
        <div className="header-info">
          <button onClick={() => navigate('/')} className="btn-volver">
            ← Volver
          </button>
          <div className="header-title">
            <h2>Cita Médica</h2>
            <span className="cita-id">#{cita.id_cita}</span>
          </div>
        </div>
        <div className="header-estado">
          <span className="cita-estado-badge" style={obtenerEstilosEstado(cita.estado)}>
            {cita.estado}
          </span>
        </div>
      </div>

      <div className="grid-detalle">
        {/* Card Paciente */}
        <div className="detalle-card">
          <div className="card-header">
            <div className="card-icon paciente-icon">👤</div>
            <h3>Paciente</h3>
          </div>
          <div className="card-body">
            <div className="info-item">
              <span className="info-label">Nombre</span>
              <span className="info-value">{paciente ? paciente.nombre : `ID: ${cita.id_paciente}`}</span>
            </div>
            {paciente?.email && (
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{paciente.email}</span>
              </div>
            )}
            {paciente?.telefono && (
              <div className="info-item">
                <span className="info-label">Teléfono</span>
                <span className="info-value">{paciente.telefono}</span>
              </div>
            )}
            {paciente?.documento && (
              <div className="info-item">
                <span className="info-label">Documento</span>
                <span className="info-value">{paciente.documento}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Especialidad */}
        <div className="detalle-card">
          <div className="card-header">
            <div className="card-icon especialidad-icon">🏥</div>
            <h3>Especialidad</h3>
          </div>
          <div className="card-body">
            <div className="info-item">
              <span className="info-label">Nombre</span>
              <span className="info-value">{
                !cita.id_especialidad 
                  ? 'No definido' 
                  : especialidad 
                    ? especialidad.nombre 
                    : `ID: ${cita.id_especialidad}`
              }</span>
            </div>
            {especialidad?.descripcion && (
              <div className="info-item full">
                <span className="info-label">Descripción</span>
                <span className="info-value">{especialidad.descripcion}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Sede */}
        <div className="detalle-card">
          <div className="card-header">
            <div className="card-icon sede-icon">📍</div>
            <h3>Sede</h3>
          </div>
          <div className="card-body">
            <div className="info-item">
              <span className="info-label">Nombre</span>
              <span className="info-value">{
                !cita.id_sede 
                  ? 'No definido' 
                  : sede 
                    ? sede.nombre 
                    : `ID: ${cita.id_sede}`
              }</span>
            </div>
            {sede?.direccion && (
              <div className="info-item full">
                <span className="info-label">Dirección</span>
                <span className="info-value">{sede.direccion}</span>
              </div>
            )}
            {sede?.telefono && (
              <div className="info-item">
                <span className="info-label">Teléfono</span>
                <span className="info-value">{sede.telefono}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Fecha y Hora */}
        <div className="detalle-card highlight">
          <div className="card-header">
            <div className="card-icon fecha-icon">📅</div>
            <h3>Fecha y Hora</h3>
          </div>
          <div className="card-body">
            <div className="info-item">
              <span className="info-label">Fecha</span>
              <span className="info-value featured">{formatearFecha(cita.fecha)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Hora</span>
              <span className="info-value featured">{formatearHora(cita.hora)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Canal</span>
              <span className="info-value">{cita.canal}</span>
            </div>
          </div>
        </div>

        {/* Card Fechas del Sistema */}
        <div className="detalle-card metadata">
          <div className="card-header">
            <div className="card-icon metadata-icon">🕒</div>
            <h3>Información del Sistema</h3>
          </div>
          <div className="card-body">
            <div className="info-item">
              <span className="info-label">Creada</span>
              <span className="info-value">{new Date(cita.created_at).toLocaleString('es-ES')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Actualizada</span>
              <span className="info-value">{new Date(cita.updated_at).toLocaleString('es-ES')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Confirmada</span>
              <span className="info-value">{cita.confirmed_at ? new Date(cita.confirmed_at).toLocaleString('es-ES') : 'No definido'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="acciones-footer">
        <button
          type="button"
          className="btn-confirmar-action"
          disabled={yaConfirmada || yaCancelada || confirmando}
          onClick={handleConfirmar}
        >
          {yaConfirmada ? '✓ Confirmada' : confirmando ? 'Confirmando...' : '✓ Confirmar cita'}
        </button>
        <button
          type="button"
          className="btn-cancelar-action"
          disabled={yaCancelada || cancelando}
          onClick={handleCancelar}
        >
          {yaCancelada ? '✕ Cancelada' : cancelando ? 'Cancelando...' : '✕ Cancelar cita'}
        </button>
      </div>
    </div>
  );
}

