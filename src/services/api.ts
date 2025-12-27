import type { Cita } from "../types/cita";
import type {
  ActualizarPacienteData,
  CrearPacienteData,
  Paciente,
} from "../types/paciente";

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
    const response = await fetch(`${API_BASE_URL}/citas`);

    if (!response.ok) {
      throw new Error(`Error al obtener las citas: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Obtiene una cita médica por su ID.
   */
  async obtenerCitaPorId(id: number): Promise<Cita> {
    const response = await fetch(`${API_BASE_URL}/citas/${id}`);

    if (!response.ok) {
      throw new Error(`Error al obtener la cita: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Confirma una cita y retorna la cita actualizada.
   */
  async confirmarCita(id: number): Promise<Cita> {
    const response = await fetch(`${API_BASE_URL}/citas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: "CONFIRMADA" }),
    });

    if (!response.ok) {
      throw new Error(`Error al confirmar la cita: ${response.statusText}`);
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
