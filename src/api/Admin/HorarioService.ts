// src/api/Admin/HorarioService.ts
import axios, { AxiosInstance } from "axios";
import type Horario from "@/interface/Admin/horario";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  timeout: 8000,
});

export default class HorarioService {
  async getAll(): Promise<Horario[]> {
    const resp = await api.get("/horarios/get/all");
    return resp.data as Horario[];
  }

  async getById(id: number | string): Promise<Horario | null> {
    const resp = await api.get(`/horarios/get/${id}`);
    return resp.data ?? null;
  }

  async getByDia(dia: string): Promise<Horario[]> {
    const resp = await api.get(`/horarios/get/dia/${encodeURIComponent(dia)}`);
    return resp.data as Horario[];
  }
}
