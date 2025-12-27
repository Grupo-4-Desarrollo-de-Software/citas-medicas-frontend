export interface Sede {
  id_sede: number;
  nombre: string;
  direccion: string;
  telefono: string;
  created_at: string;
  updated_at: string;
}

export interface CrearSedeData {
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface ActualizarSedeData {
  nombre?: string;
  direccion?: string;
  telefono?: string;
}
