import type { Cita } from '../types/cita';

// Usar ruta relativa para que el proxy de Vite funcione
const API_BASE_URL = '/api';

export const citasApi = {
  /**
   * Obtiene todas las citas médicas
   */
  async listarCitas(): Promise<Cita[]> {
    const response = await fetch(`${API_BASE_URL}/citas`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener las citas: ${response.statusText}`);
    }
    
    return await response.json();
  },

  /**
   * Obtiene una cita médica por su ID
   */
  async obtenerCitaPorId(id: number): Promise<Cita> {
    const response = await fetch(`${API_BASE_URL}/citas/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener la cita: ${response.statusText}`);
    }
    
    return await response.json();
  },
};

