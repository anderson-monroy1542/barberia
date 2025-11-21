// src/api/Admin/ServicioService.ts
import axios, { AxiosInstance } from "axios";
import type Servicio from "@/interface/Admin/servicio";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  timeout: 8000,
});

export default class ServicioService {
  async getAll(): Promise<Servicio[]> {
    const resp = await api.get("/servicios/get/all");
    return resp.data as Servicio[];
  }

  async getById(id: number | string): Promise<Servicio | null> {
    const resp = await api.get(`/servicios/get/${id}`);
    return resp.data ?? null;
  }
}
