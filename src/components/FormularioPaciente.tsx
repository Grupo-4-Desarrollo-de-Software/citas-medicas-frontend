import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { pacientesApi } from '../services/api';
import type { CrearPacienteData, Paciente } from '../types/paciente';
import './FormularioPaciente.css';

interface FormularioPacienteProps {
  paciente: Paciente | null;
  onExito: () => void;
  onCancelar: () => void;
}

type Alerta = { tipo: 'success' | 'error'; mensaje: string };

export function FormularioPaciente({ paciente, onExito, onCancelar }: FormularioPacienteProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [documento, setDocumento] = useState('');
  const [genero, setGenero] = useState<'M' | 'F'>('M');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  useEffect(() => {
    if (paciente) {
      setNombre(paciente.nombre);
      setEmail(paciente.email);
      setTelefono(paciente.telefono);
      setFechaNacimiento(paciente.fecha_nacimiento);
      setDocumento(paciente.documento);
      setGenero(paciente.genero);
      setDireccion(paciente.direccion || '');
      setCiudad(paciente.ciudad || '');
    }
  }, [paciente]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !email || !telefono || !fechaNacimiento || !documento) {
      setAlerta({ tipo: 'error', mensaje: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    setCargando(true);
    setAlerta(null);

    try {
      const data: CrearPacienteData = {
        nombre,
        email,
        telefono,
        fecha_nacimiento: fechaNacimiento,
        documento,
        genero,
        direccion: direccion || undefined,
        ciudad: ciudad || undefined,
      };

      if (paciente) {
        await pacientesApi.actualizarPaciente(paciente.id_paciente, data);
        setAlerta({ tipo: 'success', mensaje: 'Paciente actualizado exitosamente' });
      } else {
        await pacientesApi.crearPaciente(data);
        setAlerta({ tipo: 'success', mensaje: 'Paciente creado exitosamente' });
      }

      setTimeout(() => {
        onExito();
      }, 500);
    } catch (err) {
      setAlerta({
        tipo: 'error',
        mensaje: err instanceof Error ? err.message : 'Error al guardar el paciente',
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
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {paciente ? 'Editar Paciente' : 'Nuevo Paciente'}
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
                  Nombre completo<span className="required">*</span>
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  disabled={cargando}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label htmlFor="email">
                    Email<span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@example.com"
                    disabled={cargando}
                    required
                  />
                </div>

                <div className="form-group-modal">
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

              <div className="form-row">
                <div className="form-group-modal">
                  <label htmlFor="documento">
                    Documento<span className="required">*</span>
                  </label>
                  <input
                    id="documento"
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="12345678"
                    disabled={cargando}
                    required
                  />
                </div>

                <div className="form-group-modal">
                  <label htmlFor="fechaNacimiento">
                    Fecha de nacimiento<span className="required">*</span>
                  </label>
                  <input
                    id="fechaNacimiento"
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    disabled={cargando}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label htmlFor="genero">
                    Género<span className="required">*</span>
                  </label>
                  <select
                    id="genero"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value as 'M' | 'F')}
                    disabled={cargando}
                    required
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div className="form-group-modal">
                  <label htmlFor="ciudad">Ciudad</label>
                  <input
                    id="ciudad"
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Lima"
                    disabled={cargando}
                  />
                </div>
              </div>

              <div className="form-group-modal full-width">
                <label htmlFor="direccion">Dirección</label>
                <textarea
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Av. Principal 123"
                  disabled={cargando}
                  rows={2}
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
                  {paciente ? 'Actualizar' : 'Guardar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
