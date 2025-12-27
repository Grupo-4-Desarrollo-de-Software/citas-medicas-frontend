import { useEffect, useState } from 'react';
import { pacientesApi } from '../services/api';
import type { Paciente } from '../types/paciente';
import { FormularioPaciente } from './FormularioPaciente';
import './ListaPacientes.css';

export function ListaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);

  const cargarPacientes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await pacientesApi.listarPacientes();
      setPacientes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los pacientes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleNuevoPaciente = () => {
    setPacienteEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarPaciente = (paciente: Paciente) => {
    setPacienteEditando(paciente);
    setMostrarFormulario(true);
  };

  const handleEliminarPaciente = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      return;
    }

    try {
      await pacientesApi.eliminarPaciente(id);
      await cargarPacientes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el paciente');
    }
  };

  const handleFormularioExito = () => {
    setMostrarFormulario(false);
    setPacienteEditando(null);
    cargarPacientes();
  };

  const handleFormularioCancelar = () => {
    setMostrarFormulario(false);
    setPacienteEditando(null);
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (cargando) {
    return (
      <div className="paciente-cargando">
        <div className="spinner-paciente"></div>
        <p>Cargando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="paciente-error">
        <p>❌ {error}</p>
        <button onClick={cargarPacientes} className="btn-nuevo-paciente">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="lista-pacientes">
        <div className="lista-pacientes-header">
          <h2>Gestión de Pacientes</h2>
          <button onClick={handleNuevoPaciente} className="btn-nuevo-paciente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Nuevo Paciente
          </button>
        </div>

        <table className="tabla-pacientes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Documento</th>
              <th>Fecha Nac.</th>
              <th>Género</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No hay pacientes registrados
                </td>
              </tr>
            ) : (
              pacientes.map((paciente) => (
                <tr key={paciente.id_paciente}>
                  <td>{paciente.id_paciente}</td>
                  <td style={{ fontWeight: 600 }}>{paciente.nombre}</td>
                  <td>{paciente.email}</td>
                  <td>{paciente.telefono}</td>
                  <td>{paciente.documento}</td>
                  <td>{formatearFecha(paciente.fecha_nacimiento)}</td>
                  <td>
                    <span className={`genero-badge genero-${paciente.genero}`}>
                      {paciente.genero === 'M' ? 'Masculino' : 'Femenino'}
                    </span>
                  </td>
                  <td>{paciente.ciudad || '-'}</td>
                  <td>
                    <div className="acciones-paciente">
                      <button
                        onClick={() => handleEditarPaciente(paciente)}
                        className="btn-accion btn-editar"
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarPaciente(paciente.id_paciente)}
                        className="btn-accion btn-eliminar"
                        title="Eliminar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mostrarFormulario && (
        <FormularioPaciente
          paciente={pacienteEditando}
          onExito={handleFormularioExito}
          onCancelar={handleFormularioCancelar}
        />
      )}
    </>
  );
}
