import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import '../components/FormularioPaciente.css';
import { especialidadesApi } from '../services/api';
import type { CrearEspecialidadData, Especialidad } from '../types/especialidad';

interface FormularioEspecialidadProps {
  especialidad: Especialidad | null;
  onExito: () => void;
  onCancelar: () => void;
}

type Alerta = { tipo: 'success' | 'error'; mensaje: string };

export function FormularioEspecialidad({ especialidad, onExito, onCancelar }: FormularioEspecialidadProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  useEffect(() => {
    if (especialidad) {
      setNombre(especialidad.nombre);
      setDescripcion(especialidad.descripcion || '');
    }
  }, [especialidad]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre) {
      setAlerta({ tipo: 'error', mensaje: 'Por favor ingresa el nombre de la especialidad' });
      return;
    }

    setCargando(true);
    setAlerta(null);

    try {
      const data: CrearEspecialidadData = {
        nombre,
        descripcion: descripcion || undefined,
      };

      if (especialidad) {
        await especialidadesApi.actualizarEspecialidad(especialidad.id_especialidad, data);
        setAlerta({ tipo: 'success', mensaje: 'Especialidad actualizada exitosamente' });
      } else {
        await especialidadesApi.crearEspecialidad(data);
        setAlerta({ tipo: 'success', mensaje: 'Especialidad creada exitosamente' });
      }

      setTimeout(() => {
        onExito();
      }, 500);
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'Error al guardar la especialidad',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18V12" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 15H15" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {especialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}
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

            <div className="formulario-paciente">
              <div className="form-group-modal full-width">
                <label htmlFor="nombre">
                  Nombre de la especialidad<span className="required">*</span>
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Cardiología"
                  disabled={cargando}
                  required
                />
              </div>

              <div className="form-group-modal full-width">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción de la especialidad"
                  disabled={cargando}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancelar} className="btn-modal btn-cancelar" disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal btn-guardar" disabled={cargando}>
              {cargando ? (
                <>
                  <div className="spinner-btn"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {especialidad ? 'Actualizar' : 'Guardar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
