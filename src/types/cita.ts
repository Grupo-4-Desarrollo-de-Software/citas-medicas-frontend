export interface Cita {
  id_cita: number;
  id_paciente: number;
  id_medico: number;
  fecha: string;
  hora: string;
  canal: string;
  estado: string;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
}
