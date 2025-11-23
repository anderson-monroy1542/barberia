
export default interface Cita {
  
  Id_cita?: number;
  Fecha?: string;        
  Dia?: string;          
  Hora?: string;         
  Id_Barbero?: number;
  Id_servicio?: number;
  Id_estadoC?: number;
  Id_usuario?: number;


  ClienteNombre?: string;
  BarberoNombre?: string;
  Servicio?: string;
  Precio?: number | null;
  EstadoC?: string;

  fechaIso?: string;     
  estadoId?: number;
  estado?: string;
  raw?: any;
}
