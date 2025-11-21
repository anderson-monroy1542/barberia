// src/interface/Cita.ts
export default interface Cita {
  // Campos de la tabla Cita
  Id_cita?: number;
  Fecha?: string;        // 'YYYY-MM-DD'
  Dia?: string;          // 'Lunes', 'Martes', ...
  Hora?: string;         // 'HH:MM:SS'
  Id_Barbero?: number;
  Id_servicio?: number;
  Id_estadoC?: number;
  Id_usuario?: number;

  // Campos que suele devolver el backend en joins / vistas
  ClienteNombre?: string;
  BarberoNombre?: string;
  Servicio?: string;
  Precio?: number | null;
  EstadoC?: string;

  // Para uso en UI / mapping local
  fechaIso?: string;     // 'YYYY-MM-DDTHH:MM:SS' (opcional)
  estadoId?: number;
  estado?: string;
  raw?: any;
}
