<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mis Citas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout()">Cerrar Sesión</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Filtros -->
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

      <!-- Lista de citas -->
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
          </ion-card-header>

          <ion-card-content>
            <div class="card-row">
              <div class="card-info">
                <p class="service">{{ c.servicio }}</p>
                <p class="date">{{ formatDateTime(c.fecha) }}</p>
              </div>

              <div class="card-actions">
                <ion-button size="small" fill="outline" @click="openEdit(c)">
                  Editar Estado
                </ion-button>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <div v-if="filteredAppointments.length === 0" class="empty-state">
          <p>No tienes citas con los filtros seleccionados</p>
        </div>
      </div>

      <!-- Modal de edición -->
      <ion-modal :is-open="showModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Editar Estado de Cita</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div v-if="editable">
            <div class="edit-info">
              <h3>{{ editable.cliente }}</h3>
              <p class="service-name">{{ editable.servicio }}</p>
              <p class="datetime">{{ formatDateTime(editable.fecha) }}</p>
            </div>

            <ion-item>
              <ion-label position="stacked">Estado</ion-label>
              <ion-select v-model="editable.estadoId">
                <ion-select-option 
                  v-for="estado in estados" 
                  :key="estado.Id_estadoC ?? estado.id_estadoC"
                  :value="estado.Id_estadoC ?? estado.id_estadoC"
                >
                  {{ estado.EstadoC ?? estado.estadoC ?? estado.nombre }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-button expand="block" @click="saveEdit" class="save-btn">
              Guardar Cambios
            </ion-button>
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
    IonNote,
    useIonRouter,
    onIonViewDidEnter,
    onIonViewWillEnter,
  } from "@ionic/vue";

  import { ref, computed, onMounted } from "vue";
  import AdminCitaService from "@/api/Admin/AdminCitaService";
  import axios from "axios";

  const citaService = new AdminCitaService();

  const appointments = ref<any[]>([]);
  const estados = ref<any[]>([]);
  const filterFrom = ref<string | null>(null);
  const filterTo = ref<string | null>(null);
  const filterStatus = ref<string>("pendiente");
  const showModal = ref(false);
  const editable = ref<any | null>(null);
  const currentBarberoId = ref<number | null>(null);

  const router = useIonRouter();

  // Formateo de fecha y hora
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

  function buildIsoFromVarious(item: any): string | null {
    const fechaCandidates = [item.Fecha, item.fecha].filter(Boolean);
    const horaCandidates = [item.Hora, item.hora].filter(Boolean);

    const fecha = fechaCandidates.map(tryParseDateCandidate).find((f) => f) ?? null;
    const hora = horaCandidates.map(normalizeTimeString).find((h) => h) ?? null;

    if (fecha && hora) return `${fecha}T${hora}`;

    return null;
  }

  function mapBackendToView(item: any) {
    const cliente = item.ClienteNombre || item.nombreCliente || item.NombreCliente || "Cliente";
    const iso = buildIsoFromVarious(item);

    let estadoNormalizado = (item.EstadoC?.toLowerCase() ?? "pendiente").trim();
    
    if (estadoNormalizado === "completada" || estadoNormalizado === "completado") {
      estadoNormalizado = "completado";
    }
    
    if (estadoNormalizado === "cancelada" || estadoNormalizado === "cancelado") {
      estadoNormalizado = "cancelada";
    }

    return {
      id: item.Id_cita,
      cliente,
      servicio: item.Servicio ?? item.servicio ?? "Servicio",
      fecha: iso,
      estado: estadoNormalizado,
      estadoId: item.Id_estadoC ?? 1,
      clienteId: item.Id_cliente,
      barberoId: item.Id_Barbero,
      raw: item,
    };
  }

  function formatDateTime(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getBadgeColor(estado: string): string {
    const estadoLower = estado.toLowerCase();
    
    if (estadoLower === 'completado' || estadoLower === 'completada') {
      return 'success';
    }
    
    if (estadoLower === 'pendiente') {
      return 'warning';
    }
    
    if (estadoLower === 'cancelada' || estadoLower === 'cancelado') {
      return 'danger';
    }
    
    if (estadoLower === 'confirmada' || estadoLower === 'confirmado') {
      return 'primary';
    }
    
    return 'medium';
  }

  // Carga de estados desde la base de datos
  async function loadEstados() {
    try {
      const response = await axios.get('http://localhost:3000/estadocita');
      // Filtrar solo los estados que el barbero puede usar (Pendiente, Completada, Cancelada)
      estados.value = response.data.filter((estado: any) => {
        const id = estado.Id_estadoC ?? estado.id_estadoC ?? estado.id;
        return id === 1 || id === 2 || id === 3; // 1=Pendiente, 2=Completada, 3=Cancelada
      });
      console.log("Estados cargados:", estados.value);
    } catch (error) {
      console.error("Error cargando estados:", error);
      // Estados por defecto en caso de error
      estados.value = [
        { Id_estadoC: 1, EstadoC: 'Pendiente' },
        { Id_estadoC: 2, EstadoC: 'Completada' },
        { Id_estadoC: 3, EstadoC: 'Cancelada' }
      ];
    }
  }

  // Carga de citas del barbero usando el servicio del admin
  async function loadAppointments() {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;

      const barberoId = user?.Id_usuario ?? null;
      
      if (!barberoId) {
        console.error("No se encontró el ID del barbero");
        return;
      }

      currentBarberoId.value = barberoId;
      console.log("Barbero logueado - ID:", barberoId);

      // Obtener TODAS las citas usando el servicio del admin
      const rows = await citaService.getAll();
      
      console.log("Total de citas recibidas:", rows.length);

      // Filtrar solo las citas donde Id_Barbero coincida con el barbero logueado
      const citasFiltradas = rows.filter((cita: any) => {
        const citaBarberoId = cita.Id_Barbero ?? cita.Id_usuarioBarbero ?? null;
        return citaBarberoId === barberoId;
      });

      console.log("Citas del barbero:", citasFiltradas.length);

      appointments.value = citasFiltradas.map(mapBackendToView);
      
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  }

  // Editar cita (solo el estado)
  function openEdit(c: any) {
    editable.value = JSON.parse(JSON.stringify(c));
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
    editable.value = null;
  }

  async function saveEdit() {
    if (!editable.value) return;

    const raw = editable.value.raw;
    if (!raw) return;

    // Validación: el barbero solo puede editar sus propias citas
    if (raw.Id_Barbero !== currentBarberoId.value) {
      alert("No tienes permiso para editar esta cita");
      return;
    }

    let Fecha = raw.Fecha ?? null;
    let Hora = raw.Hora ?? "00:00:00";

    if (editable.value.fecha) {
      const iso = editable.value.fecha;
      if (iso.includes("T")) {
        Fecha = iso.split("T")[0];
        const timePart = iso.split("T")[1].split(".")[0];
        if (timePart) Hora = timePart;
      }
    }

    // Asegurar formato correcto de hora
    if (Hora && !/:\d{2}:\d{2}$/.test(Hora)) {
      Hora = Hora + ':00';
    }

    // Obtener el día de la semana
    const fecha = new Date(Fecha);
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const Dia = diasSemana[fecha.getDay()];

    const payload = {
      Id_cita: raw.Id_cita,
      Fecha,
      Dia,
      Hora,
      Id_Barbero: raw.Id_Barbero,
      Id_servicio: raw.Id_servicio,
      Id_estadoC: editable.value.estadoId,
      Id_usuario: editable.value.clienteId ?? raw.Id_cliente ?? raw.Id_usuario,
    };

    console.log("Payload a enviar:", payload);

    if (!payload.Id_usuario) {
      alert("Error: No se pudo obtener el ID del cliente");
      return;
    }

    try {
      await citaService.update(payload);
      console.log("Cita actualizada exitosamente");
      closeModal();
      await loadAppointments();
    } catch (error: any) {
      console.error("Error al guardar:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      alert(`Error al guardar: ${error.response?.data?.message || error.message}`);
    }
  }

  // Filtros
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
    filterStatus.value = "pendiente";
  }

  function logout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  onIonViewWillEnter(() => {
    loadEstados();
    loadAppointments();
  });
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

  .appointments {
    display: grid;
    gap: 12px;
  }

  .appointment-card {
    margin: 0;
  }

  .card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .card-info {
    flex: 1;
  }

  .card-actions {
    display: flex;
    gap: 8px;
  }

  .service {
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  .date {
    font-size: 13px;
    color: #666;
    margin: 0;
  }

  .status-note {
    margin-top: 8px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }

  .empty-state p {
    margin: 0;
    font-size: 14px;
  }

  .edit-info {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .edit-info h3 {
    margin: 0 0 8px 0;
    color: #333;
  }

  .service-name {
    font-weight: 600;
    color: #666;
    margin: 4px 0;
  }

  .datetime {
    font-size: 14px;
    color: #999;
    margin: 4px 0 0 0;
  }

  .save-btn {
    margin-top: 20px;
  }
</style>