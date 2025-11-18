export interface Cita {
  id_cita: number;
  paciente: string;
  medico: string;
  fecha: string;
  hora: string;
  motivo?: string;
  estado?: string;
  notas?: string;
}

