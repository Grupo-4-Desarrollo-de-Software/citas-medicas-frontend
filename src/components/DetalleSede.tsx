import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sedesApi } from '../services/api';
import type { Especialidad } from '../types/especialidad';
import type { Sede } from '../types/sede';
import './DetalleSede.css';
import { ModalAgregarEspecialidad } from './ModalAgregarEspecialidad';

export function DetalleSede() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sede, setSede] = useState<Sede | null>(null);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarDatos = async () => {
    if (!id) return;

    try {
      setCargando(true);
      setError(null);
      const [sedeData, especialidadesData] = await Promise.all([
        sedesApi.obtenerSedePorId(Number(id)),
        sedesApi.obtenerEspecialidadesPorSede(Number(id)),
      ]);
      setSede(sedeData);
      setEspecialidades(especialidadesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const handleQuitarEspecialidad = async (idEspecialidad: number) => {
    if (!id || !confirm('¿Estás seguro de que deseas desvincular esta especialidad?')) {
      return;
    }

    try {
      await sedesApi.desvincularEspecialidad(Number(id), idEspecialidad);
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al desvincular la especialidad');
    }
  };

  const handleAgregarExito = () => {
    setMostrarModal(false);
    cargarDatos();
  };

  if (cargando) {
    return (
      <div className="sede-cargando">
        <div className="spinner-sede"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  if (error || !sede) {
    return (
      <div className="sede-error">
        <p>❌ {error || 'Sede no encontrada'}</p>
        <button onClick={() => navigate('/sedes')} className="btn-volver">
          Volver a sedes
        </button>
      </div>
    );
  }

  return (
    <div className="detalle-sede">
      <div className="detalle-sede-header">
        <div className="detalle-sede-header-top">
          <h2>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {sede.nombre}
          </h2>
          <button onClick={() => navigate('/sedes')} className="btn-volver">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Volver
          </button>
        </div>

        <div className="sede-info">
          <div className="sede-info-item">
            <label>Dirección</label>
            <span>{sede.direccion}</span>
          </div>
          <div className="sede-info-item">
            <label>Teléfono</label>
            <span>{sede.telefono}</span>
          </div>
          <div className="sede-info-item">
            <label>ID Sede</label>
            <span>#{sede.id_sede}</span>
          </div>
        </div>
      </div>

      <div className="especialidades-sede">
        <div className="especialidades-sede-header">
          <h3>Especialidades Vinculadas</h3>
          <button onClick={() => setMostrarModal(true)} className="btn-agregar-especialidad">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Agregar Especialidad
          </button>
        </div>

        {especialidades.length === 0 ? (
          <div className="especialidades-vacio">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No hay especialidades vinculadas a esta sede</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Haz clic en "Agregar Especialidad" para vincular una</p>
          </div>
        ) : (
          <div className="especialidades-grid">
            {especialidades.map((especialidad) => (
              <div key={especialidad.id_especialidad} className="especialidad-card">
                <div className="especialidad-card-info">
                  <h4>{especialidad.nombre}</h4>
                  {especialidad.descripcion && <p>{especialidad.descripcion}</p>}
                </div>
                <button
                  onClick={() => handleQuitarEspecialidad(especialidad.id_especialidad)}
                  className="btn-quitar"
                  title="Quitar especialidad"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarModal && (
        <ModalAgregarEspecialidad
          idSede={Number(id)}
          especialidadesVinculadas={especialidades}
          onExito={handleAgregarExito}
          onCancelar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}
