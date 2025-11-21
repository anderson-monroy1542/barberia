// src/interface/Admin/horarioDia.ts
export default interface HorarioDia {
  Id?: number;
  IdDia?: number | string; // id del día o nombre/clave según tu BD
  HoraInicio: string;      // "08:00:00"
  HoraFin: string;         // "16:00:00"
  // campos extra opcionales
}
