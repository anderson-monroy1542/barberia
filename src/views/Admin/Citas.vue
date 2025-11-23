<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Administrar Citas</ion-title>
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
                <ion-button 
                  size="small" 
                  fill="outline" 
                  color="primary"
                  @click="openEdit(c)"
                >
                  <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
                </ion-button>
                <ion-button 
                  size="small" 
                  fill="outline" 
                  color="danger"
                  @click="confirmDelete(c)"
                >
                  <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
                </ion-button>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <div v-if="filteredAppointments.length === 0" class="empty-state">
          <p>No hay citas con los filtros seleccionados</p>
        </div>
      </div>

      <!-- MODAL EDITAR -->
      <ion-modal :is-open="showModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Editar Cita</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div v-if="formData">
            <!-- Cliente -->
            <ion-item>
              <ion-label position="stacked">Cliente</ion-label>
              <ion-select 
                v-model="formData.Id_usuario" 
                placeholder="Selecciona un cliente"
              >
                <ion-select-option 
                  v-for="cliente in clientes" 
                  :key="cliente.Id_usuario"
                  :value="cliente.Id_usuario"
                >
                  {{ cliente.Nombre }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Fecha y Hora (solo para mostrar, calculamos barberos disponibles) -->
            <ion-item>
              <ion-label position="stacked">Fecha</ion-label>
              <ion-input 
                type="date" 
                v-model="formData.Fecha"
                @ionChange="loadAvailableBarberos"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Hora</ion-label>
              <ion-input 
                type="time" 
                v-model="formData.Hora"
                @ionChange="loadAvailableBarberos"
              ></ion-input>
            </ion-item>

            <!-- Barberos disponibles (usuarios con rol barbero) -->
            <ion-item>
              <ion-label position="stacked">
                Barbero
                <span v-if="loadingBarberos" style="font-size: 11px; color: #999;"> (cargando...)</span>
              </ion-label>
              <ion-select 
                v-model="formData.Id_Barbero" 
                placeholder="Selecciona un barbero"
                :disabled="loadingBarberos || availableBarberos.length === 0"
              >
                <ion-select-option 
                  v-for="barbero in availableBarberos" 
                  :key="barbero.Id_Barbero"
                  :value="barbero.Id_Barbero"
                >
                  {{ barbero.NombreBarbero }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <div v-if="!loadingBarberos && availableBarberos.length === 0 && formData.Fecha && formData.Hora" class="warning-message">
              ⚠️ No hay barberos disponibles en esta fecha y hora
            </div>

            <!-- Mostrar errores de validación de edición -->
            <div v-if="editErrors" class="warning-message" style="background:#f8d7da; border-color:#f5c2c7; color:#842029; margin-top:10px;">
              ⚠️ {{ editErrors }}
            </div>

            <!-- Servicio (solo nombre) -->
            <ion-item>
              <ion-label position="stacked">Servicio</ion-label>
              <ion-select 
                v-model="formData.Id_servicio" 
                placeholder="Selecciona un servicio"
              >
                <ion-select-option 
                  v-for="servicio in servicios" 
                  :key="servicio.Id_servicio"
                  :value="servicio.Id_servicio"
                >
                  {{ servicio.NombreServicio }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Estado -->
            <ion-item>
              <ion-label position="stacked">Estado</ion-label>
              <ion-select v-model="formData.Id_estadoC">
                <ion-select-option :value="1">Pendiente</ion-select-option>
                <ion-select-option :value="2">Confirmada</ion-select-option>
                <ion-select-option :value="3">Completado</ion-select-option>
                <ion-select-option :value="4">Cancelada</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-button 
              expand="block" 
              @click="saveAppointment"
              :disabled="!isFormValid"
              style="margin-top: 20px;"
            >
              Guardar Cambios
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>

      <!-- ALERT PARA CONFIRMAR ELIMINACIÓN -->
      <ion-alert
        :is-open="showDeleteAlert"
        header="Confirmar eliminación"
        :message="`¿Estás seguro de eliminar la cita de ${citaToDelete?.cliente}?`"
        :buttons="deleteAlertButtons"
        @didDismiss="showDeleteAlert = false"
      ></ion-alert>
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
    IonInput,
    IonIcon,
    IonAlert,
    useIonRouter,
    onIonViewWillEnter,
  } from "@ionic/vue";

  import { 
    createOutline, 
    trashOutline 
  } from "ionicons/icons";

  import { ref, computed, onMounted } from "vue";
  import AdminCitaService from "@/api/Admin/AdminCitaService";
  import type Cita from "@/interface/Admin/cita";

  // services
  import ServicioService from "@/api/Admin/ServicioService";
  import UsuarioService from "@/api/Admin/UsuarioService";

  const servicioService = new ServicioService();
  const usuarioService = new UsuarioService();

  const citaService = new AdminCitaService();

  // Estados
  const appointments = ref<any[]>([]);
  const barberos = ref<any[]>([]);            // usuarios con rol barbero (Id_Barbero = Id_usuario)
  const availableBarberos = ref<any[]>([]);  // mismos objetos que barberos (Id_Barbero, NombreBarbero)
  const servicios = ref<any[]>([]);
  const clientes = ref<any[]>([]);           // usuarios con rol cliente
  const loadingBarberos = ref(false);

  const filterFrom = ref<string | null>(null);
  const filterTo = ref<string | null>(null);
  const filterStatus = ref<string>("todas");

  const showModal = ref(false);
  const showDeleteAlert = ref(false);
  const citaToDelete = ref<any | null>(null);

  const editLoading = ref(false);
  const editErrors = ref<string | null>(null);

  const formData = ref<any>({
    Id_cita: null,
    Fecha: '',
    Hora: '',
    Id_Barbero: null,
    Id_servicio: null,
    Id_estadoC: 1,
    Id_usuario: null,
    Dia: ''
  });

  const router = useIonRouter();



  function roleToString(u: any): string {
    if (!u) return "";
    const candidates = [
      u.Rol, u.role, u.nombreRol, u.roleName, u.Role, u.id_rol, u.Id_rol, u.IdRol, u.Id_rol
    ];
    return String(candidates.find((x:any) => x !== undefined && x !== null) ?? "").toLowerCase();
  }

  function isBarberoUser(u: any): boolean {
    if (!u) return false;
    if (u.IsBarbero === true) return true;
    const r = roleToString(u);
    if (!r) {
      const possible = u.Id_rol ?? u.id_rol ?? u.IdRol ?? u.roleId ?? u.Id_rol;
      if (possible === 2 || possible === "2") return true;
    }
    return r.includes("barb") || r.includes("barbero") || r.includes("barber");
  }

  function isClienteUser(u: any): boolean {
    if (!u) return false;
    if (u.IsCliente === true) return true;
    const r = roleToString(u);
    if (!r) {
      const possible = u.Id_rol ?? u.id_rol ?? u.IdRol ?? u.roleId ?? u.Id_rol;
      if (possible === 1 || possible === "1") return true;
    }
    return r.includes("client") || r.includes("cliente") || r.includes("user");
  }

  //formateo / util

  function normalizeUserName(u: any): string {
    return (
      u.Nombre ??
      u.nombre ??
      (u.FirstName && u.LastName ? `${u.FirstName} ${u.LastName}` : null) ??
      (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : null) ??
      u.username ??
      "Sin nombre"
    );
  }

  function normalizeServiceName(s: any): string {
    return s.NombreServicio ?? s.nombreServicio ?? s.Nombre ?? s.nombre ?? s.title ?? "Servicio";
  }

  function normalizeUserId(u: any): number | null {
    return u.Id_usuario ?? u.id ?? u.Id ?? null;
  }

  //formateo fecha hora

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

    const userId = 
      item.Id_usuario ?? 
      item.id_usuario ?? 
      item.IdUsuario ?? 
      item.usuarioId ?? 
      item.ClienteId ??
      item.Id_cliente ??
      null;

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
      barbero,
      servicio: item.Servicio ?? item.servicio ?? "Servicio",
      fecha: iso,
      estado: estadoNormalizado,
      estadoId: item.Id_estadoC ?? 1,
      userId: userId,
      raw: item,
    };
  }

  //color del badge según estado

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

  //cargando datos
  async function loadAppointments() {
    try {
      const rows = await citaService.getAll();
      console.log("🔍 Citas recibidas:", rows);
      appointments.value = rows.map(mapBackendToView);
    } catch (error) {
      console.error("Error cargando citas:", error);
    }
  }

  async function loadCatalogs() {
    try {
      // mantengo datos de ejemplo para carga inicial (no toca edición)
      barberos.value = [
        { Id_Barbero: 1, NombreBarbero: 'Carlos López' },
        { Id_Barbero: 2, NombreBarbero: 'Pedro Martínez' }
      ];

      servicios.value = [
        { Id_servicio: 1, NombreServicio: 'Corte Classic', Precio: 15 },
        { Id_servicio: 2, NombreServicio: 'Corte + Barba', Precio: 25 },
        { Id_servicio: 3, NombreServicio: 'Afeitado', Precio: 10 }
      ];

      clientes.value = [
        { Id_usuario: 1, Nombre: 'Juan Pérez' },
        { Id_usuario: 2, Nombre: 'María García' },
        { Id_usuario: 3, Nombre: 'Luis Rodríguez' }
      ];
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  }

  //barberos disponibles

  async function loadAvailableBarberos() {
    // si no hay fecha/hora, devolvemos la lista completa (select editable)
    if (!formData.value.Fecha || !formData.value.Hora) {
      availableBarberos.value = barberos.value;
      return;
    }

    loadingBarberos.value = true;
    editErrors.value = null;

    try {
      // citas del día 
      const citasDelDia = await citaService.getByDia(formData.value.Fecha);

      // convierto hora seleccionada a minutos
      const [hSel, mSel] = formData.value.Hora.split(':').map(Number);
      const minutosSel = hSel * 60 + mSel;
      const slotMinutos = 30; // cada turno de 30 minutos

      const barberosOcupados = new Set<number>();

      citasDelDia.forEach((cita: Cita) => {
        // ignorar la misma cita que se está editando
        if (formData.value.Id_cita && cita.Id_cita === formData.value.Id_cita) return;
        // ignorar citas canceladas (Id_estadoC === 4)
        if (cita.Id_estadoC === 4) return;
        if (!cita.Hora || !cita.Id_Barbero) return;

        const horaCitaNorm = normalizeTimeString(cita.Hora);
        if (!horaCitaNorm) return;
        const [hC, mC] = horaCitaNorm.split(':').map(Number);
        const minutosCita = hC * 60 + mC;

        if (Math.abs(minutosCita - minutosSel) < slotMinutos) {
          barberosOcupados.add(cita.Id_Barbero as number);
        }
      });

      // filtrar barberos disponibles
      availableBarberos.value = barberos.value.filter(b => !barberosOcupados.has(b.Id_Barbero));

      // si el barbero actual ya no está disponible se limpia
      if (formData.value.Id_Barbero && !availableBarberos.value.some(b => b.Id_Barbero === formData.value.Id_Barbero)) {
        formData.value.Id_Barbero = null;
      }
    } catch (err) {
      console.error("Error en loadAvailableBarberos:", err);
      availableBarberos.value = barberos.value;
      editErrors.value = "No se pudo comprobar disponibilidad; revisa conexión.";
    } finally {
      loadingBarberos.value = false;
    }
  }

  //validación de edición

  async function validateEditSlot() {
    editErrors.value = null;

    // campos requeridos para validar
    if (!formData.value.Fecha || !formData.value.Hora || !formData.value.Id_Barbero) {
      // no hay suficientes datos para validar aún
      return;
    }

    try {
      const citasDelDia = await citaService.getByDia(formData.value.Fecha);

      const [hSel, mSel] = formData.value.Hora.split(':').map(Number);
      const minutosSel = hSel * 60 + mSel;
      const slotMinutos = 30;

      // busco si existe otra cita del mismo barbero
      const conflicto = citasDelDia.some((c: Cita) => {
        if (formData.value.Id_cita && c.Id_cita === formData.value.Id_cita) return false;
        if (c.Id_estadoC === 4) return false; 
        if (!c.Hora || !c.Id_Barbero) return false;
        if (c.Id_Barbero !== formData.value.Id_Barbero) return false;

        const horaCita = normalizeTimeString(c.Hora);
        if (!horaCita) return false;
        const [hC, mC] = horaCita.split(':').map(Number);
        const minutosCita = hC * 60 + mC;

        return Math.abs(minutosCita - minutosSel) < slotMinutos;
      });

      if (conflicto) {
        editErrors.value = "El barbero seleccionado ya tiene una cita en ese slot de 30 minutos.";
      } else {
        editErrors.value = null;
      }
    } catch (err) {
      console.error("Error validando slot:", err);
      editErrors.value = "No se pudo validar disponibilidad.";
    }
  }

  //modal editar

  async function openEdit(c: any) {
    const raw = c.raw;

    editErrors.value = null;
    editLoading.value = true;

    try {
      
      const clientesMap = new Map<number, { Id_usuario: number; Nombre: string }>();
      const barberosMap = new Map<number, { Id_Barbero: number; NombreBarbero: string }>();
      const serviciosMap = new Map<number, { Id_servicio: number; NombreServicio: string }>();

      appointments.value.forEach((a: any) => {
        const r = a.raw ?? {};

        
        const clientId = a.userId ?? r.Id_usuario ?? r.ClienteId ?? r.Id_cliente ?? null;
        if (clientId) {
          const name = a.cliente ?? r.ClienteNombre ?? r.Nombre ?? `Cliente ${clientId}`;
          clientesMap.set(Number(clientId), { Id_usuario: Number(clientId), Nombre: name });
        }

        
        const barberoId = r.Id_Barbero ?? null;
        if (barberoId) {
          const nameB = a.barbero ?? r.BarberoNombre ?? r.NombreBarbero ?? `Barbero ${barberoId}`;
          barberosMap.set(Number(barberoId), { Id_Barbero: Number(barberoId), NombreBarbero: nameB });
        }

        
        const servicioId = r.Id_servicio ?? null;
        if (servicioId) {
          const nameS = a.servicio ?? r.Servicio ?? r.NombreServicio ?? `Servicio ${servicioId}`;
          serviciosMap.set(Number(servicioId), { Id_servicio: Number(servicioId), NombreServicio: nameS });
        }
      });

      
      clientes.value = Array.from(clientesMap.values());
      barberos.value = Array.from(barberosMap.values());
      servicios.value = Array.from(serviciosMap.values());

      // Mapear fecha/hora
      let fecha = "";
      let hora = "";
      if (c.fecha && typeof c.fecha === "string" && c.fecha.includes("T")) {
        fecha = c.fecha.split("T")[0];
        const timePart = c.fecha.split("T")[1].split(".")[0];
        if (timePart) hora = timePart.substring(0, 5); // HH:MM
      } else {
        fecha = raw.Fecha ?? raw.fecha ?? "";
        hora = (raw.Hora ?? raw.hora ?? "").toString().substring(0,5);
      }

      
      formData.value = {
        Id_cita: c.id,
        Fecha: fecha,
        Hora: hora,
        Id_Barbero: raw.Id_Barbero ?? raw.Id_usuarioBarbero ?? raw.Id_usuario ?? null,
        Id_servicio: raw.Id_servicio ?? null,
        Id_estadoC: c.estadoId ?? (raw.Id_estadoC ?? 1),
        Id_usuario: c.userId ?? (raw.Id_usuario ?? null),
        Dia: raw.Dia || ""
      };

      // Actualizar disponibles y validar
      await loadAvailableBarberos();
      await validateEditSlot();

      showModal.value = true;
    } catch (err: any) {
      console.error("Error en openEdit:", err);
      editErrors.value = "Error cargando datos para editar. Revisa la consola.";
    } finally {
      editLoading.value = false;
    }
  }

  function closeModal() {
    showModal.value = false;
    availableBarberos.value = [];
  }

  const isFormValid = computed(() => {
    return (
      formData.value.Fecha &&
      formData.value.Hora &&
      formData.value.Id_Barbero &&
      formData.value.Id_servicio &&
      formData.value.Id_usuario
    );
  });

  //guardar 

  async function saveAppointment() {
    if (!isFormValid.value) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (editErrors.value) {
      alert(editErrors.value);
      return;
    }

    try {
      const fecha = new Date(formData.value.Fecha);
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      formData.value.Dia = diasSemana[fecha.getDay()];

      if (formData.value.Hora && !/:\d{2}:\d{2}$/.test(formData.value.Hora)) {
        formData.value.Hora = formData.value.Hora + ':00';
      }

      console.log("Actualizando cita:", formData.value);
      await citaService.update(formData.value);
      console.log("Cita actualizada exitosamente");

      closeModal();
      await loadAppointments();
    } catch (error: any) {
      console.error("Error al guardar:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      alert(`Error al guardar: ${error.response?.data?.message || error.message}`);
    }
  }

  //eliminar cita

  function confirmDelete(c: any) {
    citaToDelete.value = c;
    showDeleteAlert.value = true;
  }

  const deleteAlertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel'
    },
    {
      text: 'Eliminar',
      role: 'confirm',
      handler: async () => {
        await deleteAppointment();
      }
    }
  ];

  async function deleteAppointment() {
    if (!citaToDelete.value) return;

    try {
      console.log("Eliminando cita:", citaToDelete.value.id);
      await citaService.delete(citaToDelete.value.id);
      console.log("Cita eliminada exitosamente");
      await loadAppointments();
      citaToDelete.value = null;
    } catch (error: any) {
      console.error("Error al eliminar:", error);
      alert(`Error al eliminar: ${error.response?.data?.message || error.message}`);
    }
  }


  const filteredAppointments = computed(() => {
    return appointments.value.filter((c) => {
      if (!c.fecha) return false;
      const d = new Date(c.fecha);

      if (filterStatus.value !== "todas") {
        const estadoLower = c.estado.toLowerCase();
        if (estadoLower !== filterStatus.value) return false;
      }

      if (filterFrom.value) {
        const f = new Date(filterFrom.value + "T00:00:00");
        if (d < f) return false;
      }

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
    filterStatus.value = "todas";
  }

  function logout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  onIonViewWillEnter(async () => {
    await loadCatalogs();
    await loadAppointments();
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

  .warning-message {
    padding: 12px;
    margin: 12px 0;
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    font-size: 13px;
    color: #856404;
  }
</style>
