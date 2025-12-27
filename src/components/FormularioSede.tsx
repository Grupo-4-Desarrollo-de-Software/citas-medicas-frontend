import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import '../components/FormularioPaciente.css';
import { sedesApi } from '../services/api';
import type { CrearSedeData, Sede } from '../types/sede';

interface FormularioSedeProps {
  sede: Sede | null;
  onExito: () => void;
  onCancelar: () => void;
}

type Alerta = { tipo: 'success' | 'error'; mensaje: string };

export function FormularioSede({ sede, onExito, onCancelar }: FormularioSedeProps) {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  useEffect(() => {
    if (sede) {
      setNombre(sede.nombre);
      setDireccion(sede.direccion);
      setTelefono(sede.telefono);
    }
  }, [sede]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !direccion || !telefono) {
      setAlerta({ tipo: 'error', mensaje: 'Por favor completa todos los campos' });
      return;
    }

    setCargando(true);
    setAlerta(null);

    try {
      const data: CrearSedeData = {
        nombre,
        direccion,
        telefono,
      };

      if (sede) {
        await sedesApi.actualizarSede(sede.id_sede, data);
        setAlerta({ tipo: 'success', mensaje: 'Sede actualizada exitosamente' });
      } else {
        await sedesApi.crearSede(data);
        setAlerta({ tipo: 'success', mensaje: 'Sede creada exitosamente' });
      }

      setTimeout(() => {
        onExito();
      }, 500);
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'Error al guardar la sede',
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
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {sede ? 'Editar Sede' : 'Nueva Sede'}
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
                  Nombre de la sede<span className="required">*</span>
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Sede Central"
                  disabled={cargando}
                  required
                />
              </div>

              <div className="form-group-modal full-width">
                <label htmlFor="direccion">
                  Dirección<span className="required">*</span>
                </label>
                <input
                  id="direccion"
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Av. Principal 123"
                  disabled={cargando}
                  required
                />
              </div>

              <div className="form-group-modal full-width">
                <label htmlFor="telefono">
                  Teléfono<span className="required">*</span>
                </label>
                <input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+51999999999"
                  disabled={cargando}
                  required
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
                  {sede ? 'Actualizar' : 'Guardar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
