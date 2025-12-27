export interface Paciente {
  id_paciente: number;
  nombre: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  documento: string;
  genero: "M" | "F";
  direccion?: string;
  ciudad?: string;
  created_at: string;
  updated_at: string;
}

export interface CrearPacienteData {
  nombre: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  documento: string;
  genero: "M" | "F";
  direccion?: string;
  ciudad?: string;
}

export interface ActualizarPacienteData {
  nombre?: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  documento?: string;
  genero?: "M" | "F";
  direccion?: string;
  ciudad?: string;
}
