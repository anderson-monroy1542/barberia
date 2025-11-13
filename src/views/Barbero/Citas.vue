<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Citas</ion-title>
        <ion-buttons slot="end">
            <ion-button @click="logout()">
                <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
                Cerrar Sesión
            </ion-button>
        </ion-buttons>
      </ion-toolbar>

      
    </ion-header>

    <ion-content class="ion-padding">
      <div class="filters">
        <ion-item>
          <ion-label>Desde</ion-label>
          <input type="date" v-model="filterFrom" />
        </ion-item>
        <ion-item>
          <ion-label>Hasta</ion-label>
          <input type="date" v-model="filterTo" />
        </ion-item>
        <ion-button expand="block" @click="clearFilters">Limpiar filtros</ion-button>
      </div>

      <div class="appointments">
        <ion-card v-for="c in filteredAppointments" :key="c.id" class="appointment-card">
          <ion-card-header>
            <ion-card-title>{{ c.cliente }}</ion-card-title>
            <ion-note class="status-note"><ion-badge :color="c.estado === 'completado' ? 'success' : 'warning'">{{ c.estado }}</ion-badge></ion-note>
          </ion-card-header>
          <ion-card-content>
            <div class="card-row">
              <div class="card-info">
                <p class="service">{{ c.servicio }}</p>
                <p class="date">{{ formatDateTime(c.fecha) }}</p>
              </div>
              <div class="card-actions">
                <ion-button size="small" fill="outline" @click="openEdit(c)">Editar</ion-button>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <div v-if="filteredAppointments.length === 0" class="empty">
          <ion-text>No hay citas para las fechas seleccionadas.</ion-text>
        </div>
      </div>

      <!-- Modal simple para editar estado -->
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
              <ion-select v-model="editable.estado">
                <ion-select-option value="pendiente">Pendiente</ion-select-option>
                <ion-select-option value="completado">Completado</ion-select-option>
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
// 1. IMPORTACIONES (COMPONENTES, VUE, ICONOS)
// Todos los imports se agrupan aquí
import { ref, computed, onMounted } from 'vue';
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
  useIonRouter,
  IonIcon,
  IonNote
} from '@ionic/vue';
import {
    checkmarkCircleOutline,
    addOutline,
    documentTextOutline,
    searchOutline,
    starOutline,
    createOutline,
    trashOutline,
    logOutOutline
} from 'ionicons/icons';


const STORAGE_KEY = 'citas';
const appointments = ref<any[]>([]);
const filterFrom = ref<string | null>(null);
const filterTo = ref<string | null>(null);
const showModal = ref(false);
const editable = ref<any | null>(null);
const router = useIonRouter();


const filteredAppointments = computed(() => {
  let list = appointments.value.slice().sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  if (filterFrom.value) {
    const from = new Date(filterFrom.value + 'T00:00:00');
    list = list.filter((c) => new Date(c.fecha) >= from);
  }
  if (filterTo.value) {
    const to = new Date(filterTo.value + 'T23:59:59');
    list = list.filter((c) => new Date(c.fecha) <= to);
  }
  return list;
});


function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      appointments.value = JSON.parse(raw);
    } catch (e) {
      console.error('No se pudo parsear citas:', e);
      appointments.value = [];
    }
  } else {
    appointments.value = [
      { id: 1, cliente: 'Juan Pérez', servicio: 'Corte', fecha: '2025-11-08T10:00:00', estado: 'pendiente' },
      { id: 2, cliente: 'María López', servicio: 'Afeitado', fecha: '2025-11-09T12:30:00', estado: 'completado' },
      { id: 3, cliente: 'Luis Gómez', servicio: 'Corte + Barba', fecha: '2025-11-10T15:00:00', estado: 'pendiente' }
    ];
    saveAll();
  }
}

function saveAll() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments.value));
}

function openEdit(c: any) {
  editable.value = JSON.parse(JSON.stringify(c));
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editable.value = null;
}

function saveEdit() {
  if (!editable.value) return;
  const idx = appointments.value.findIndex((a) => a.id === editable.value.id);
  if (idx >= 0) {
    appointments.value[idx] = { ...editable.value };
    saveAll();
  }
  closeModal();
}

function clearFilters() {
  filterFrom.value = null;
  filterTo.value = null;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

const logout = () => {
    localStorage.removeItem('user');
    router.navigate('/login', 'back', 'replace');
};


onMounted(() => {
  load();
});

</script>

<style scoped>
.filters {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

ion-badge {
  text-transform: capitalize;
}

.appointment-card ion-card-content .card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-info {
  flex: 1 1 auto;
}

.card-actions {
  flex: 0 0 auto;
}
</style>
