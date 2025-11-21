// src/interface/Admin/barbero.ts
export default interface Barbero {
  Id_Barbero: number;
  NombreBarbero: string;
  Email?: string | null;
  Telefono?: string | null;
  // si tu BD trae disponibilidad por turno o similar:
  Horario?: string | null;
}
