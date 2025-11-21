// src/api/Admin/HorarioDiaService.ts
import axios, { AxiosInstance } from "axios";
import type HorarioDia from "@/interface/Admin/horarioDia";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  timeout: 8000,
});

export default class HorarioDiaService {
  async getAll(): Promise<HorarioDia[]> {
    const resp = await api.get("/horariodias/get/all");
    return resp.data as HorarioDia[];
  }

  async getByDia(idDia: string | number): Promise<HorarioDia[]> {
    const resp = await api.get(`/horariodias/get/dia/${idDia}`);
    return resp.data as HorarioDia[];
  }
}
