// src/api/appointmentsService.ts
import axios from 'axios';
import Appointment from '@/interface/Barbero/Appointment';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ajusta si tu backend corre en otro host/puerto
  timeout: 8000
});

// Interceptor opcional para añadir token si en el futuro lo guardas
api.interceptors.request.use(config => {
  const raw = localStorage.getItem('user');
  if (raw) {
    try {
      const user = JSON.parse(raw);
      // si guardas token, usa: config.headers.Authorization = `Bearer ${user.token}`;
      // actualmente no usamos token, así que nada extra
    } catch (e) {
      // ignore
    }
  }
  return config;
}, err => Promise.reject(err));

export default class AppointmentsService {
  // Obtiene las citas para el usuario actual; el backend decide según rol
  async getMyAppointments(userId: number): Promise<Appointment[]> {
    const resp = await api.get(`/citas/get/mis-citas/${userId}`);
    // el backend debe devolver un array de citas
    return (resp.data || []) as Appointment[];
  }

  // Actualiza una cita (usa PUT /citas/update en tu backend)
  // Espera un objeto con propiedades que tu backend acepte (Id_cita, Id_estadoC, etc)
  async updateAppointment(payload: Partial<Appointment> & { Id_cita: number }): Promise<any> {
    const resp = await api.put('/citas/update', payload);
    return resp.data;
  }

  // Método auxiliar: obtener por rango de fechas (si quieres)
  async getByDateRange(userId: number, from: string, to: string): Promise<Appointment[]> {
    // Si tu backend no tiene endpoint para esto, puedes filtrar en frontend.
    const resp = await api.get(`/citas/get/mis-citas/${userId}`);
    const list = (resp.data || []) as Appointment[];
    const f = from ? new Date(from + 'T00:00:00').getTime() : null;
    const t = to ? new Date(to + 'T23:59:59').getTime() : null;
    return list.filter(a => {
      const ts = new Date((a.Fecha && a.Hora) ? `${a.Fecha}T${a.Hora}` : (a.fechaIso || '')).getTime();
      if (isNaN(ts)) return false;
      if (f !== null && ts < f) return false;
      if (t !== null && ts > t) return false;
      return true;
    });
  }
}
