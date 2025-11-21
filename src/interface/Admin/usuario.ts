// src/interface/Admin/usuario.ts
export default interface Usuario {
  Id_usuario: number;
  Nombre: string;
  Apellidos?: string | null;
  Email?: string | null;
  Telefono?: string | null;
}
