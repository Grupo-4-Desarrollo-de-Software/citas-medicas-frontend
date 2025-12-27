export interface Especialidad {
  id_especialidad: number;
  nombre: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

export interface CrearEspecialidadData {
  nombre: string;
  descripcion?: string;
}

export interface ActualizarEspecialidadData {
  nombre?: string;
  descripcion?: string;
}
