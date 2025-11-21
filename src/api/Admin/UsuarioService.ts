// src/api/Admin/UsuarioService.ts
import axios, { AxiosInstance } from "axios";
import type Usuario from "@/interface/Admin/usuario";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  timeout: 8000,
});

export default class UsuarioService {
  async getAll(): Promise<Usuario[]> {
    const resp = await api.get("/usuarios/get/all");
    return resp.data as Usuario[];
  }

  async getById(id: number | string): Promise<Usuario | null> {
    const resp = await api.get(`/usuarios/get/${id}`);
    return resp.data ?? null;
  }
}
