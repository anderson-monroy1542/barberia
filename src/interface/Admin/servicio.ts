// src/interface/Admin/servicio.ts
export default interface Servicio {
  Id_servicio: number;
  NombreServicio: string;
  Precio?: number | null;
  DuracionMinutos?: number | null; // útil si decides cambiar duración por servicio
}
