// src/interface/Appointment.ts
export default interface Appointment {
  Id_cita: number;
  Fecha: string;         // 'YYYY-MM-DD' (según tu BD)
  Dia: string;           // ej. "Martes"
  Hora: string;          // 'HH:MM:SS'
  Id_Barbero: number;
  BarberoNombre?: string;
  Id_servicio: number;
  Servicio?: string;
  Descripcion?: string;
  Precio?: number;
  Id_estadoC: number;
  EstadoC?: string;      // 'Pendiente' | 'Completado' ...
  Id_usuario?: number;   // el cliente (en BD es Id_usuario)
  ClienteNombre?: string;

  // campos auxiliares para front
  fechaIso?: string;     // e.g. '2025-11-25T10:00:00' creado en frontend si hace falta
}
