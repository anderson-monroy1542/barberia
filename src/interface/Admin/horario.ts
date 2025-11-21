// src/interface/Admin/horario.ts
export default interface Horario {
  Id_Horario?: number;
  Dia?: string;          // "Lunes", "Martes", ...
  Apertura?: string;     // "08:00:00"
  Cierre?: string;       // "16:00:00"
  // otros campos que tenga tu tabla horarios
}
