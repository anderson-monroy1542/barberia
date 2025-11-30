<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Gestión de Usuarios</ion-title>
        <ion-buttons slot="end">
            <ion-button @click="openEditModal(defaultUser)">
                <ion-icon :icon="personAddOutline" slot="start"></ion-icon>
                Agregar Usuario
            </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="user-management-container">
        
        <div class="filters-bar">
          <ion-searchbar 
            v-model="searchText" 
            placeholder="Buscar por Nombre, Apellido o Correo" 
            :debounce="300"
          ></ion-searchbar>
          <ion-item>
            <ion-label>Rol</ion-label>
            <ion-select v-model="filterRole" placeholder="Todos los Roles">
              <ion-select-option :value="null">Todos</ion-select-option>
              <ion-select-option v-for="rol in roles" :key="rol.Id_rol" :value="rol.Id_rol">
                {{ rol.Rol }}
              </ion-select-option>
            </ion-select>
          </ion-item>
        </div>

        <div class="table-container" v-if="!loading">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.Id_usuario">
                <td>{{ user.Id_usuario }}</td>
                <td>{{ user.Nombre }} {{ user.Apellido }}</td>
                <td>{{ user.Correo }}</td>
                <td><ion-badge :color="getRoleColor(user.Id_rol)">{{ user.Rol }}</ion-badge></td>
                <td>
                  <ion-button size="small" fill="outline" color="primary" @click="openEditModal(user)">
                    Editar
                  </ion-button>
                  <ion-button size="small" color="danger" @click="confirmDelete(user)">
                    Eliminar
                  </ion-button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredUsers.length === 0" class="empty-state">
              <p>No se encontraron usuarios que coincidan con los filtros.</p>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <ion-spinner></ion-spinner>
          <p>Cargando usuarios...</p>
        </div>
      </div>

      <ion-modal :is-open="showEditModal" @did-dismiss="closeEditModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ userToEdit.Id_usuario ? 'Editar Usuario' : 'Agregar Nuevo Usuario' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeEditModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input v-model="userToEdit.Nombre"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Apellido</ion-label>
            <ion-input v-model="userToEdit.Apellido"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Correo</ion-label>
            <ion-input type="email" v-model="userToEdit.Correo"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Contraseña</ion-label>
            <ion-input type="password" v-model="userToEdit.Contrasena" :placeholder="userToEdit.Id_usuario ? 'Dejar vacío para no cambiar' : 'Requerido'"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Rol</ion-label>
            <ion-select v-model="userToEdit.Id_rol" placeholder="Selecciona el Rol">
              <ion-select-option v-for="rol in roles" :key="rol.Id_rol" :value="rol.Id_rol">
                {{ rol.Rol }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          
          <ion-button expand="block" color="success" @click="saveUser" class="ion-margin-top">
            Guardar
          </ion-button>
        </ion-content>
      </ion-modal>

      <ion-alert
          :is-open="showAlertDelete"
          header="Confirmar Eliminación"
          :message="`¿Estás seguro de eliminar a <strong>${userToDelete?.Nombre} ${userToDelete?.Apellido}</strong>? Esta acción es irreversible.`"
          :buttons="deleteAlertButtons"
          @did-dismiss="showAlertDelete = false"
      ></ion-alert>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonSearchbar, IonItem, IonLabel,
  IonSelect, IonSelectOption, IonModal, IonInput, IonBadge,
  IonButtons, IonSpinner, IonAlert, toastController, onIonViewWillEnter
} from '@ionic/vue';
import { personAddOutline } from 'ionicons/icons';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Estado
const loading = ref(false);
const users = ref<any[]>([]);
const roles = ref<any[]>([]); // Array que debe llenarse con la API

const searchText = ref('');
const filterRole = ref<number | null>(null);

const showEditModal = ref(false);
const defaultUser = { Id_usuario: null, Nombre: '', Apellido: '', Correo: '', Contrasena: '', Id_rol: 3 }; 
const userToEdit = ref<any>({ ...defaultUser });

const showAlertDelete = ref(false);
const userToDelete = ref<any>(null);


// ======================= LÓGICA DE CARGA =======================
const loadUsersAndRoles = async () => {
  loading.value = true;
  try {
    // 1. Cargar todos los usuarios con rol (Nuevo endpoint)
    const usersResp = await axios.get(`${API_URL}/usuarios/get/all-admin`);
    users.value = usersResp.data;

    // 2. Cargar la lista de roles (Endpoint /roles/get/all)
    const rolesResp = await axios.get(`${API_URL}/roles/get/all`);
    roles.value = rolesResp.data; // <--- Esta línea asegura que el array se actualice
    
  } catch (error) {
    console.error('Error al cargar datos:', error);
    showToast('Error al cargar la gestión de usuarios', 'danger');
  } finally {
    loading.value = false;
  }
};

// ======================= FILTROS =======================
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // 1. Filtrar por rol
    if (filterRole.value !== null && user.Id_rol !== filterRole.value) {
      return false;
    }

    // 2. Filtrar por búsqueda de texto
    const searchLower = searchText.value.toLowerCase();
    const fullName = `${user.Nombre} ${user.Apellido}`.toLowerCase();
    
    if (searchLower && !fullName.includes(searchLower) && !user.Correo.toLowerCase().includes(searchLower)) {
      return false;
    }

    return true;
  });
});

// ======================= CRUD: EDICIÓN/CREACIÓN =======================
const openEditModal = (user: any = defaultUser) => {
  userToEdit.value = JSON.parse(JSON.stringify(user));
  
  // Aseguramos que el Id_rol sea un número para el ion-select.
  if (userToEdit.value.Id_rol) {
    userToEdit.value.Id_rol = parseInt(userToEdit.value.Id_rol);
  } else {
    userToEdit.value.Id_rol = defaultUser.Id_rol; 
  }

  userToEdit.value.Contrasena = ''; 
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  userToEdit.value = { ...defaultUser };
};

const saveUser = async () => {
  if (!userToEdit.value.Nombre || !userToEdit.value.Correo || !userToEdit.value.Id_rol || (!userToEdit.value.Id_usuario && !userToEdit.value.Contrasena)) {
    showToast('Complete los campos obligatorios (Nombre, Correo, Rol, y Contraseña si es nuevo)', 'warning');
    return;
  }
  
  const payload = { 
    ...userToEdit.value,
    Id_rol: parseInt(userToEdit.value.Id_rol) // Parseamos el valor del select
  };
  
  if (userToEdit.value.Id_usuario && !payload.Contrasena) {
      delete payload.Contrasena;
  }

  try {
    if (payload.Id_usuario) {
      // Editar (PUT /usuarios/:id)
      await axios.put(`${API_URL}/usuarios/${payload.Id_usuario}`, payload);
      showToast('Usuario actualizado con éxito', 'success');
    } else {
      // Crear (POST /usuarios/registrar)
      const response = await axios.post(`${API_URL}/usuarios/registrar`, payload);
      const newId = response.data.insertId;
      
      if (newId && payload.Id_rol !== 3) {
        const updateRolePayload = {
            ...payload,
            Id_usuario: newId,
            Contrasena: '', 
            Id_rol: payload.Id_rol 
        };
        await axios.put(`${API_URL}/usuarios/${newId}`, updateRolePayload);
      }
      showToast('Usuario agregado con éxito', 'success');
    }

    closeEditModal();
    loadUsersAndRoles();
  } catch (error: any) {
    console.error('Error al guardar usuario:', error);
    const msg = error.response?.data?.message || error.message || 'Error desconocido al guardar.';
    showToast(msg, 'danger');
  }
};

// ======================= CRUD: ELIMINACIÓN =======================
const confirmDelete = (user: any) => {
  userToDelete.value = user;
  showAlertDelete.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value || !userToDelete.value.Id_usuario) return;

  try {
    await axios.delete(`${API_URL}/usuarios/delete/${userToDelete.value.Id_usuario}`);
    
    showToast('Usuario eliminado correctamente', 'success');
    loadUsersAndRoles();
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    showToast('Error al eliminar usuario: ' + (error.response?.data?.message || error.message), 'danger');
  } finally {
    userToDelete.value = null;
  }
};

const deleteAlertButtons = [
    { text: 'Cancelar', role: 'cancel', handler: () => { userToDelete.value = null; } },
    { text: 'Eliminar', role: 'destructive', handler: () => { deleteUser(); } }
];

// ======================= UTILIDADES =======================
const getRoleColor = (idRol: number) => {
  switch (idRol) {
    case 1: return 'danger';    // Admin
    case 2: return 'warning';   // Barbero
    case 3: return 'success';   // Cliente
    default: return 'medium';
  }
};

const showToast = async (message: string, color: string = 'primary') => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'top'
  });
  await toast.present();
};

onIonViewWillEnter(loadUsersAndRoles);
</script>

<style scoped>
/* Estilos generales para el contenedor */
.user-management-container {
  padding-bottom: 20px;
}

/* Estilos de la barra de filtros */
.filters-bar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 20px;
}
@media (min-width: 600px) {
    .filters-bar {
        grid-template-columns: 2fr 1fr;
    }
}
/* Estilos de la tabla */
.table-container {
  /* Mantener overflow-x: auto para el scroll horizontal en móviles */
  overflow-x: auto; 
  background: var(--ion-color-light-contrast);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0;
}

table {
  /* CLAVE 1: Forzar un ancho mínimo para que todas las 5 columnas quepan y activen el scroll */
  width: 100%;
  min-width: 950px; 
  border-collapse: collapse;
  color: var(--ion-color-step-900);
  table-layout: fixed; 
}

thead th {
  background-color: var(--ion-color-primary);
  color: white; /* Asegura el color blanco en fondos oscuros */
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid var(--ion-color-primary-shade);
  white-space: nowrap; /* Evita que el encabezado se corte */
}

tbody td {
  padding: 10px 15px;
  border-bottom: 1px solid var(--ion-color-step-150);
  /* CLAVE: Forzar color claro en el texto de las celdas de datos */
  color: var(--ion-color-light, #f4f4f4); 
  white-space: normal;
}
/* Columna 1: ID */
thead th:nth-child(1), tbody td:nth-child(1) { 
  width: 60px; 
  text-align: center;
}
/* Columna 2: Nombre Completo */
thead th:nth-child(2), tbody td:nth-child(2) { 
  width: 180px; 
  white-space: nowrap; 
}
/* Columna 3: Correo */
thead th:nth-child(3), tbody td:nth-child(3) { 
  width: 250px; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap;
}
/* Columna 4: Rol */
thead th:nth-child(4), tbody td:nth-child(4) { 
  width: 120px; 
  text-align: center;
}
/* Columna 5: Acciones */
thead th:nth-child(5), tbody td:nth-child(5) { 
  width: 180px; 
  text-align: center;
}
/* CLAVE 3: Estilos de acciones */
tbody td:last-child {
  display: flex;
  gap: 8px;
  justify-content: center; /* Centrar los botones */
  align-items: center;
  flex-wrap: nowrap;
}

tbody tr:nth-child(even) {
  background-color: var(--ion-color-step-50);
}

/* Estilos de estado vacío/carga */
.empty-state, .loading-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--ion-color-medium);
}
.loading-state ion-spinner {
    margin-bottom: 10px;
}
</style>