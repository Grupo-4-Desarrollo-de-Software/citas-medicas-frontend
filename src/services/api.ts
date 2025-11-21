import type { Cita } from '../types/cita';

// Flags de control: el mock tiene prioridad. Solo se consulta la API real
// si VITE_USE_REAL_API es true y VITE_USE_MOCK_DATA es false.
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';
const SHOULD_USE_MOCK = USE_MOCK_DATA || !USE_REAL_API;

// Ruta relativa para que el proxy de Vite funcione
const API_BASE_URL = '/api';

let mockCitas: Cita[] = [
  {
    id_cita: 1,
    paciente: 'Juan Perez',
    medico: 'Dra. Ana Morales',
    fecha: '2025-01-12',
    hora: '09:30',
    motivo: 'Control general',
    estado: 'Confirmada',
    notas: 'Llegar 10 minutos antes para registrar signos vitales.',
  },
  {
    id_cita: 2,
    paciente: 'Mariana Lopez',
    medico: 'Dr. Carlos Rojas',
    fecha: '2025-01-13',
    hora: '11:00',
    motivo: 'Consulta de seguimiento',
    estado: 'Pendiente',
  },
  {
    id_cita: 3,
    paciente: 'Luis Fernandez',
    medico: 'Dra. Gabriela Ruiz',
    fecha: '2025-01-15',
    hora: '15:45',
    motivo: 'Dolor de espalda',
    estado: 'Programada',
    notas: 'Paciente refiere dolor al levantar peso.',
  },
  {
    id_cita: 4,
    paciente: 'Carolina Diaz',
    medico: 'Dr. Mateo Vargas',
    fecha: '2025-01-18',
    hora: '08:15',
    motivo: 'Evaluacion prequirurgica',
    estado: 'Confirmada',
  },
];

const mockDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
  async listarCitas(): Promise<Cita[]> {
    await mockDelay();
    return mockCitas;
  },
  async obtenerCitaPorId(id: number): Promise<Cita> {
    await mockDelay();
    const cita = mockCitas.find((item) => item.id_cita === id);
    if (!cita) {
      throw new Error(`Cita con id ${id} no encontrada (mock)`);
    }
    return cita;
  },
  async confirmarCita(id: number): Promise<Cita> {
    await mockDelay();
    const existe = mockCitas.find((item) => item.id_cita === id);
    if (!existe) {
      throw new Error(`Cita con id ${id} no encontrada (mock)`);
    }
    mockCitas = mockCitas.map((item) =>
      item.id_cita === id ? { ...item, estado: 'Confirmada' } : item
    );
    return mockCitas.find((item) => item.id_cita === id)!;
  },
};

export const citasApi = {
  /**
   * Obtiene todas las citas medicas.
   * Usa mock si SHOULD_USE_MOCK es true; de lo contrario consume la API real.
   */
  async listarCitas(): Promise<Cita[]> {
    if (SHOULD_USE_MOCK) {
      return mockApi.listarCitas();
    }

    const response = await fetch(`${API_BASE_URL}/citas`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener las citas: ${response.statusText}`);
    }
    
    return await response.json();
  },

  /**
   * Obtiene una cita medica por su ID.
   * Usa mock si SHOULD_USE_MOCK es true; de lo contrario consume la API real.
   */
  async obtenerCitaPorId(id: number): Promise<Cita> {
    if (SHOULD_USE_MOCK) {
      return mockApi.obtenerCitaPorId(id);
    }

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
    if (SHOULD_USE_MOCK) {
      return mockApi.confirmarCita(id);
    }

    const response = await fetch(`${API_BASE_URL}/citas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: 'Confirmada' }),
    });

    if (!response.ok) {
      throw new Error(`Error al confirmar la cita: ${response.statusText}`);
    }

    // Si el backend responde sin cuerpo, devolvemos un fallback con el id y estado.
    try {
      return await response.json();
    } catch (_) {
      return { id_cita: id, estado: 'Confirmada' } as Cita;
    }
  },
};
