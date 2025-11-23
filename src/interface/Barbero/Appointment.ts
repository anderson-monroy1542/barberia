
export default interface Appointment {
  Id_cita: number;
  Fecha: string;         
  Dia: string;            
  Hora: string;          
  Id_Barbero: number;
  BarberoNombre?: string;
  Id_servicio: number;
  Servicio?: string;
  Descripcion?: string;
  Precio?: number;
  Id_estadoC: number;
  EstadoC?: string;      
  Id_usuario?: number;   
  ClienteNombre?: string;


  fechaIso?: string;
}
