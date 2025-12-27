import type { Cita } from "../types/cita";
import type {
  ActualizarEspecialidadData,
  CrearEspecialidadData,
  Especialidad,
} from "../types/especialidad";
import type {
  ActualizarPacienteData,
  CrearPacienteData,
  Paciente,
} from "../types/paciente";
import type { ActualizarSedeData, CrearSedeData, Sede } from "../types/sede";

// URL de la API real
const API_BASE_URL = "https://citas-medicas-backend-1kwn.onrender.com/api";

// Tipos para autenticación
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

export const citasApi = {
  /**
   * Obtiene todas las citas médicas desde la API real.
   */
  async listarCitas(): Promise<Cita[]> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/citas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener las citas: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Obtiene una cita médica por su ID.
   */
  async obtenerCitaPorId(id: number): Promise<Cita> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/citas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la cita: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Confirma una cita con teléfono y retorna la cita actualizada.
   */
  async confirmarCita(id_cita: number, telefono: string): Promise<Cita> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/citas/confirmar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_cita, telefono }),
    });

    if (!response.ok) {
      throw new Error(`Error al confirmar la cita: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Cancela una cita y retorna la cita actualizada.
   */
  async cancelarCita(id_cita: number): Promise<Cita> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/citas/cancelar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_cita }),
    });

    if (!response.ok) {
      throw new Error(`Error al cancelar la cita: ${response.statusText}`);
    }

    return await response.json();
  },
};

export const authApi = {
  /**
   * Inicia sesión con email y password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al iniciar sesión: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Registra un nuevo usuario
   */
  async register(
    nombre: string,
    email: string,
    password: string,
    rol: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, password, rol }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al registrarse: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Cierra la sesión actual
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  },
};

export const pacientesApi = {
  /**
   * Obtiene todos los pacientes
   */
  async listarPacientes(): Promise<Paciente[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/pacientes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los pacientes: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Obtiene un paciente por su ID
   */
  async obtenerPacientePorId(id: number): Promise<Paciente> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el paciente: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Crea un nuevo paciente
   */
  async crearPaciente(data: CrearPacienteData): Promise<Paciente> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/pacientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al crear el paciente: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Actualiza un paciente existente
   */
  async actualizarPaciente(
    id: number,
    data: ActualizarPacienteData
  ): Promise<Paciente> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al actualizar el paciente: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Elimina un paciente
   */
  async eliminarPaciente(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al eliminar el paciente: ${response.statusText}`
      );
    }
  },
};

export const sedesApi = {
  /**
   * Obtiene todas las sedes
   */
  async listarSedes(): Promise<Sede[]> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/sedes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener las sedes: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Obtiene una sede por su ID
   */
  async obtenerSedePorId(id: number): Promise<Sede> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/sedes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la sede: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Obtiene las especialidades de una sede
   */
  async obtenerEspecialidadesPorSede(idSede: number): Promise<Especialidad[]> {
    const token = authApi.getToken();
    const response = await fetch(
      `${API_BASE_URL}/sedes/${idSede}/especialidades`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al obtener las especialidades: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Crea una nueva sede
   */
  async crearSede(data: CrearSedeData): Promise<Sede> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/sedes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear la sede: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Actualiza una sede existente
   */
  async actualizarSede(id: number, data: ActualizarSedeData): Promise<Sede> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/sedes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al actualizar la sede: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Elimina una sede
   */
  async eliminarSede(id: number): Promise<void> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/sedes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar la sede: ${response.statusText}`
      );
    }
  },

  /**
   * Vincula una especialidad a una sede
   */
  async vincularEspecialidad(
    idSede: number,
    idEspecialidad: number
  ): Promise<void> {
    const token = authApi.getToken();
    const response = await fetch(
      `${API_BASE_URL}/sedes/${idSede}/especialidades/${idEspecialidad}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al vincular la especialidad: ${response.statusText}`
      );
    }
  },

  /**
   * Desvincula una especialidad de una sede
   */
  async desvincularEspecialidad(
    idSede: number,
    idEspecialidad: number
  ): Promise<void> {
    const token = authApi.getToken();
    const response = await fetch(
      `${API_BASE_URL}/sedes/${idSede}/especialidades/${idEspecialidad}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al desvincular la especialidad: ${response.statusText}`
      );
    }
  },
};

export const especialidadesApi = {
  /**
   * Obtiene todas las especialidades
   */
  async listarEspecialidades(): Promise<Especialidad[]> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/especialidades`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener las especialidades: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Obtiene una especialidad por su ID
   */
  async obtenerEspecialidadPorId(id: number): Promise<Especialidad> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/especialidades/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener la especialidad: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Crea una nueva especialidad
   */
  async crearEspecialidad(data: CrearEspecialidadData): Promise<Especialidad> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/especialidades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al crear la especialidad: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Actualiza una especialidad existente
   */
  async actualizarEspecialidad(
    id: number,
    data: ActualizarEspecialidadData
  ): Promise<Especialidad> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/especialidades/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al actualizar la especialidad: ${response.statusText}`
      );
    }

    return await response.json();
  },

  /**
   * Elimina una especialidad
   */
  async eliminarEspecialidad(id: number): Promise<void> {
    const token = authApi.getToken();
    const response = await fetch(`${API_BASE_URL}/especialidades/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error al eliminar la especialidad: ${response.statusText}`
      );
    }
  },
};
