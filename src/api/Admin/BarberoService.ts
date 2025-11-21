// src/api/Admin/BarberoService.ts
import axios, { AxiosInstance } from "axios";
import type Barbero from "@/interface/Admin/barbero";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  timeout: 8000,
});

export default class BarberoService {
  async getAll(): Promise<Barbero[]> {
    const resp = await api.get("/barberos/get/all");
    return resp.data as Barbero[];
  }

  async getById(id: number | string): Promise<Barbero | null> {
    const resp = await api.get(`/barberos/get/${id}`);
    return resp.data ?? null;
  }
}
