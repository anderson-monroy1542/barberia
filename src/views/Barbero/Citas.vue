<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Citas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout()">Cerrar Sesión</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- FILTROS -->
      <div class="filters">
        <div class="status-filters">
          <ion-button 
            class="status-btn"
            :fill="filterStatus === 'pendiente' ? 'solid' : 'outline'"
            :color="filterStatus === 'pendiente' ? 'warning' : 'medium'"
            @click="filterStatus = 'pendiente'"
          >
            Pendientes
          </ion-button>
          <ion-button 
            class="status-btn"
            :fill="filterStatus === 'completado' ? 'solid' : 'outline'"
            :color="filterStatus === 'completado' ? 'success' : 'medium'"
            @click="filterStatus = 'completado'"
          >
            Completadas
          </ion-button>
          <ion-button 
            class="status-btn"
            :fill="filterStatus === 'cancelada' ? 'solid' : 'outline'"
            :color="filterStatus === 'cancelada' ? 'danger' : 'medium'"
            @click="filterStatus = 'cancelada'"
          >
            Canceladas
          </ion-button>
          <ion-button 
            class="status-btn"
            :fill="filterStatus === 'todas' ? 'solid' : 'outline'"
            :color="filterStatus === 'todas' ? 'primary' : 'medium'"
            @click="filterStatus = 'todas'"
          >
            Todas
          </ion-button>
        </div>

        <div class="date-filters">
          <div class="date-input-wrapper">
            <label>Desde</label>
            <input type="date" v-model="filterFrom" />
          </div>

          <div class="date-input-wrapper">
            <label>Hasta</label>
            <input type="date" v-model="filterTo" />
          </div>
        </div>

        <ion-button class="clear-btn" size="small" fill="clear" @click="clearFilters">
          Limpiar filtros
        </ion-button>
      </div>

      <!-- LISTA DE CITAS -->
      <div class="appointments">
        <ion-card
          v-for="c in filteredAppointments"
          :key="c.id"
          class="appointment-card"
        >
          <ion-card-header>
            <ion-card-title>{{ c.cliente }}</ion-card-title>

            <ion-note class="status-note">
              <ion-badge :color="getBadgeColor(c.estado)">
                {{ c.estado }}
              </ion-badge>
            </ion-note>

            <div
              v-if="c.barbero"
              style="font-size: 12px; color: #bdbdbd; margin-top: 4px;"
            >
              Barbero: {{ c.barbero }}
            </div>
          </ion-card-header>

          <ion-card-content>
            <div class="card-row">
              <div class="card-info">
                <p class="service">{{ c.servicio }}</p>
                <p class="date">{{ formatDateTime(c.fecha) }}</p>
              </div>

              <div class="card-actions">
                <ion-button size="small" fill="outline" @click="openEdit(c)"
                  >Editar</ion-button
                >
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- MODAL -->
      <ion-modal :is-open="showModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Editar cita</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div v-if="editable">
            <h3>{{ editable.cliente }} — {{ editable.servicio }}</h3>
            <p>{{ formatDateTime(editable.fecha) }}</p>

            <ion-item>
              <ion-label position="stacked">Estado</ion-label>
              <ion-select v-model="editable.estadoId">
                <ion-select-option :value="1">Pendiente</ion-select-option>
                <ion-select-option :value="2">Confirmada</ion-select-option>
                <ion-select-option :value="3">Completado</ion-select-option>
                <ion-select-option :value="4">Cancelada</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-button expand="block" @click="saveEdit">Guardar</ion-button>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonBadge,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonText,
  IonNote,
  useIonRouter,
} from "@ionic/vue";

import { ref, computed, onMounted } from "vue";
import AppointmentsService from "@/api/Barbero/appointmentsService";

const appointmentsService = new AppointmentsService();

const appointments = ref<any[]>([]);
const filterFrom = ref<string | null>(null);
const filterTo = ref<string | null>(null);
const filterStatus = ref<string>("pendiente"); // Por defecto: pendientes
const showModal = ref(false);
const editable = ref<any | null>(null);

const router = useIonRouter();

/* ============================
   FORMATEO DE FECHA-HORA
============================ */

function normalizeTimeString(timeRaw: any): string | null {
  if (!timeRaw) return null;

  let t = String(timeRaw).trim().replace("Z", "");

  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;

  if (/^\d{2}:\d{2}$/.test(t)) return t + ":00";

  if (/^\d{2}:\d{2}:\d{2}\.\d+/.test(t)) return t.split(".")[0];

  const ampm = t.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (ampm) {
    let h = parseInt(ampm[1]);
    const m = ampm[2];
    const p = ampm[3].toLowerCase();

    if (p === "pm" && h < 12) h += 12;
    if (p === "am" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${m}:00`;
  }

  return null;
}

function tryParseDateCandidate(c: any): string | null {
  if (!c) return null;

  const s = String(c).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.split("T")[0];

  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const Y = d.getFullYear();
    const M = String(d.getMonth() + 1).padStart(2, "0");
    const D = String(d.getDate()).padStart(2, "0");
    return `${Y}-${M}-${D}`;
  }

  return null;
}

/* ============================
   BUILD ISO
============================ */

function buildIsoFromVarious(item: any): string | null {
  const fechaCandidates = [item.Fecha, item.fecha].filter(Boolean);
  const horaCandidates = [item.Hora, item.hora].filter(Boolean);

  const fecha = fechaCandidates.map(tryParseDateCandidate).find((f) => f) ?? null;
  const hora =
    horaCandidates.map(normalizeTimeString).find((h) => h) ?? null;

  if (fecha && hora) return `${fecha}T${hora}`;

  return null;
}

/* ============================
   MAPEADOR DE RESPUESTA
============================ */

function mapBackendToView(item: any) {
  const cliente =
    item.ClienteNombre ||
    item.nombreCliente ||
    item.NombreCliente ||
    item.cliente ||
    "Cliente";

  const barbero =
    item.BarberoNombre ||
    item.nombreBarbero ||
    item.NombreBarbero ||
    null;

  const iso = buildIsoFromVarious(item);

  // Buscar Id_usuario en diferentes variaciones del backend
  const userId = 
    item.Id_usuario ?? 
    item.id_usuario ?? 
    item.IdUsuario ?? 
    item.usuarioId ?? 
    item.ClienteId ??
    item.Id_cliente ??
    null;

  // Normalizar el estado para que sea consistente
  let estadoNormalizado = (item.EstadoC?.toLowerCase() ?? "pendiente").trim();
  
  // Si el estado es "completado" o "completada", unificarlo como "completado"
  if (estadoNormalizado === "completada" || estadoNormalizado === "completado") {
    estadoNormalizado = "completado";
  }
  
  // Si el estado es "cancelada" o "cancelado", unificarlo como "cancelada"
  if (estadoNormalizado === "cancelada" || estadoNormalizado === "cancelado") {
    estadoNormalizado = "cancelada";
  }

  console.log("👤 UserId encontrado para cita", item.Id_cita, ":", userId);
  console.log("📊 Estado original:", item.EstadoC, "→ Estado normalizado:", estadoNormalizado);

  return {
    id: item.Id_cita,
    cliente,
    barbero,
    servicio: item.Servicio ?? item.servicio ?? "Servicio",
    fecha: iso,
    estado: estadoNormalizado,
    estadoId: item.Id_estadoC ?? 1,
    userId: userId,
    raw: item,
  };
}

/* ============================
   FORMATEO FINAL DE FECHA
============================ */

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

/* ============================
   COLOR DEL BADGE SEGÚN ESTADO
============================ */

function getBadgeColor(estado: string): string {
  const estadoLower = estado.toLowerCase();
  
  if (estadoLower === 'completado' || estadoLower === 'completada') {
    return 'success'; // Verde
  }
  
  if (estadoLower === 'pendiente') {
    return 'warning'; // Amarillo
  }
  
  if (estadoLower === 'cancelada' || estadoLower === 'cancelado') {
    return 'danger'; // Rojo
  }
  
  if (estadoLower === 'confirmada' || estadoLower === 'confirmado') {
    return 'primary'; // Azul
  }
  
  return 'medium'; // Gris por defecto
}

/* ============================
   CARGA DE CITAS
============================ */

async function loadAppointments() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const userId = user?.Id_usuario ?? null;
  if (!userId) return;

  const rows = await appointmentsService.getMyAppointments(userId);

  // 🔍 LOG PARA VER LA ESTRUCTURA DE LOS DATOS
  console.log("🔍 Datos recibidos del backend:", rows[0]);

  appointments.value = rows.map(mapBackendToView);
}

/* ============================
   EDITAR CITA
============================ */

function openEdit(c: any) {
  editable.value = JSON.parse(JSON.stringify(c));
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveEdit() {
  if (!editable.value) return;

  const raw = editable.value.raw;
  if (!raw) return;

  let Fecha = raw.Fecha ?? null;
  let Hora = raw.Hora ?? "00:00:00";

  // Extraer fecha y hora si están en formato ISO
  if (editable.value.fecha) {
    const iso = editable.value.fecha;
    if (iso.includes("T")) {
      Fecha = iso.split("T")[0];
      const timePart = iso.split("T")[1].split(".")[0];
      if (timePart) Hora = timePart;
    }
  }

  // Obtener Id_usuario de forma segura
  const Id_usuario = editable.value.userId ?? raw.Id_usuario;

  const payload = {
    Id_cita: raw.Id_cita,
    Fecha,
    Dia: raw.Dia,
    Hora,
    Id_Barbero: raw.Id_Barbero,
    Id_servicio: raw.Id_servicio,
    Id_estadoC: editable.value.estadoId,
    Id_usuario: Id_usuario,
  };

  console.log("📤 Payload a enviar:", payload);
  console.log("📋 Datos raw originales:", raw);
  console.log("👤 Id_usuario:", Id_usuario);

  // Validar que Id_usuario no sea undefined
  if (!Id_usuario) {
    alert("Error: No se pudo obtener el ID del usuario");
    return;
  }

  try {
    const response = await appointmentsService.updateAppointment(payload);
    console.log("✅ Respuesta exitosa:", response);
    closeModal();
    await loadAppointments();
  } catch (error: any) {
    console.error("❌ Error al guardar:", error);
    console.error("❌ Respuesta del servidor:", error.response?.data);
    alert(`Error al guardar: ${error.response?.data?.message || error.message}`);
  }
}

/* ============================
   FILTROS
============================ */

const filteredAppointments = computed(() => {
  return appointments.value.filter((c) => {
    if (!c.fecha) return false;
    const d = new Date(c.fecha);

    // Filtro por estado
    if (filterStatus.value !== "todas") {
      const estadoLower = c.estado.toLowerCase();
      if (estadoLower !== filterStatus.value) return false;
    }

    // Filtro por fecha desde
    if (filterFrom.value) {
      const f = new Date(filterFrom.value + "T00:00:00");
      if (d < f) return false;
    }

    // Filtro por fecha hasta
    if (filterTo.value) {
      const t = new Date(filterTo.value + "T23:59:59");
      if (d > t) return false;
    }

    return true;
  });
});

function clearFilters() {
  filterFrom.value = null;
  filterTo.value = null;
  filterStatus.value = "pendiente"; // Vuelve a pendientes
}

/* ============================
   LOGOUT
============================ */

function logout() {
  localStorage.removeItem("user");
  router.push("/login");
}

/* ============================
   ON MOUNT
============================ */

onMounted(() => loadAppointments());
</script>

<style scoped>
.filters {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
}

.status-filters {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.status-btn {
  --border-radius: 20px;
  font-weight: 500;
  text-transform: none;
}

.date-filters {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.date-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-input-wrapper label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
  padding-left: 4px;
}

.date-input-wrapper input[type="date"] {
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
}

.date-input-wrapper input[type="date"]:focus {
  outline: none;
  border-color: #3880ff;
  box-shadow: 0 0 0 3px rgba(56, 128, 255, 0.1);
}

.clear-btn {
  margin: 0 auto;
  max-width: 140px;
  font-size: 13px;
  text-transform: none;
}

.card-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
</style>