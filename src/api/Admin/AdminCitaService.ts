// src/api/Admin/AdminCitaService.ts
import axios, { AxiosInstance } from "axios";
import type Cita from "@/interface/Admin/cita";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  timeout: 8000,
});

export default class AdminCitaService {
  async getAll(): Promise<Cita[]> {
    const resp = await api.get("/citas/get/all");
    return resp.data as Cita[];
  }

  async getById(id: number | string): Promise<Cita | null> {
    const resp = await api.get(`/citas/get/${id}`);
    return resp.data ?? null;
  }

  /**
   * Insertar nueva cita.
   * El objeto cita debe incluir: Fecha (YYYY-MM-DD), Dia, Hora, Id_Barbero, Id_servicio, Id_estadoC, Id_usuario
   */
  async create(cita: Cita): Promise<{ insertId?: number; raw?: any }> {
    const resp = await api.post("/citas/add", cita);
    return resp.data;
  }

  /**
   * Actualizar cita.
   * Backend espera un objeto con al menos: Id_cita, Fecha, Dia, Hora, Id_Barbero, Id_servicio, Id_estadoC, Id_usuario
   */
  async update(cita: Cita): Promise<any> {
    // Si tu backend espera { cita: cita } descomenta la línea siguiente:
    // return (await api.put("/citas/update", { cita })).data;
    return (await api.put("/citas/update", cita)).data;
  }

  async delete(id: number | string): Promise<any> {
    return (await api.delete(`/citas/delete/${id}`)).data;
  }

  // Queries auxiliares que puedes necesitar
  async getByDia(dia: string): Promise<Cita[]> {
    // dia en formato 'YYYY-MM-DD'
    const resp = await api.get(`/citas/get/dia/${encodeURIComponent(dia)}`);
    return resp.data as Cita[];
  }

  async getByUsuario(idUsuario: number | string): Promise<Cita[]> {
    const resp = await api.get(`/citas/get/usuario/${idUsuario}`);
    return resp.data as Cita[];
  }
}
