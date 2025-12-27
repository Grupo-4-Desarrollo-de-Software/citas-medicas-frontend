import { useEffect, useState } from 'react';
import '../components/FormularioPaciente.css';
import { especialidadesApi, sedesApi } from '../services/api';
import type { Especialidad } from '../types/especialidad';

interface ModalAgregarEspecialidadProps {
  idSede: number;
  especialidadesVinculadas: Especialidad[];
  onExito: () => void;
  onCancelar: () => void;
}

type Alerta = { tipo: 'success' | 'error'; mensaje: string };

export function ModalAgregarEspecialidad({
  idSede,
  especialidadesVinculadas,
  onExito,
  onCancelar,
}: ModalAgregarEspecialidadProps) {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    try {
      setCargando(true);
      const data = await especialidadesApi.listarEspecialidades();
      // Filtrar las que ya están vinculadas
      const idsVinculados = especialidadesVinculadas.map((e) => e.id_especialidad);
      const disponibles = data.filter((e) => !idsVinculados.includes(e.id_especialidad));
      setEspecialidades(disponibles);
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'Error al cargar especialidades',
      });
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEspecialidad = (id: number) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (seleccionadas.length === 0) {
      setAlerta({ tipo: 'error', mensaje: 'Selecciona al menos una especialidad' });
      return;
    }

    setGuardando(true);
    setAlerta(null);

    try {
      // Vincular todas las especialidades seleccionadas
      await Promise.all(
        seleccionadas.map((idEspecialidad) =>
          sedesApi.vincularEspecialidad(idSede, idEspecialidad)
        )
      );

      setAlerta({ tipo: 'success', mensaje: 'Especialidades vinculadas exitosamente' });
      setTimeout(() => {
        onExito();
      }, 500);
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'Error al vincular especialidades',
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Agregar Especialidades
          </h3>
          <button onClick={onCancelar} className="btn-cerrar-modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {alerta && (
              <div className={`form-alerta ${alerta.tipo === 'success' ? 'alerta-success' : 'alerta-error'}`}>
                {alerta.mensaje}
              </div>
            )}

            {cargando ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                Cargando especialidades...
              </div>
            ) : especialidades.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                <p>No hay especialidades disponibles para vincular</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>Todas las especialidades ya están vinculadas a esta sede</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 8px 0' }}>
                  Selecciona las especialidades que deseas vincular a esta sede:
                </p>
                {especialidades.map((especialidad) => (
                  <label
                    key={especialidad.id_especialidad}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      border: '2px solid',
                      borderColor: seleccionadas.includes(especialidad.id_especialidad)
                        ? '#10b981'
                        : '#e2e8f0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: seleccionadas.includes(especialidad.id_especialidad)
                        ? '#d1fae5'
                        : '#ffffff',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={seleccionadas.includes(especialidad.id_especialidad)}
                      onChange={() => handleToggleEspecialidad(especialidad.id_especialidad)}
                      style={{ marginTop: '2px', cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                        {especialidad.nombre}
                      </div>
                      {especialidad.descripcion && (
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {especialidad.descripcion}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancelar} className="btn-modal btn-cancelar" disabled={guardando}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-modal btn-guardar"
              disabled={guardando || especialidades.length === 0}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
            >
              {guardando ? (
                <>
                  <div className="spinner-btn"></div>
                  Vinculando...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Vincular ({seleccionadas.length})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
