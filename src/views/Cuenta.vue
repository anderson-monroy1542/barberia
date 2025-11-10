<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Mi Cuenta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Tarjeta de perfil -->
      <ion-card class="profile-card">
        <ion-card-content>
          <div class="profile-header">
            <div class="avatar-section">
              <img 
                :src="user.avatar || defaultAvatar" 
                alt="avatar" 
                class="profile-avatar" 
              />
              <ion-button 
                @click="editField('avatar')" 
                fill="clear" 
                size="small" 
                class="edit-avatar-btn"
              >
                <ion-icon :icon="cameraOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>
            <div class="profile-info">
              <h2 class="profile-name">
                {{ user.nombre }} {{ user.apellido }}
                <ion-button 
                  @click="editField('nombre')" 
                  fill="clear" 
                  size="small"
                  class="inline-edit-btn"
                >
                  <ion-icon :icon="pencilOutline"></ion-icon>
                </ion-button>
              </h2>
              <p class="profile-username">
                @{{ user.username }}
                <ion-button 
                  @click="editField('username')" 
                  fill="clear" 
                  size="small"
                  class="inline-edit-btn"
                >
                  <ion-icon :icon="pencilOutline"></ion-icon>
                </ion-button>
              </p>
              <p class="profile-email">
                {{ user.email }}
                <ion-button 
                  @click="editField('email')" 
                  fill="clear" 
                  size="small"
                  class="inline-edit-btn"
                >
                  <ion-icon :icon="pencilOutline"></ion-icon>
                </ion-button>
              </p>
              <ion-badge v-if="user.rol" color="primary" class="role-badge">
                {{ user.rol }}
              </ion-badge>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Información adicional editable -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Información Personal</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <!-- Apellido editable -->
            <ion-item class="editable-item">
              <ion-label>
                <h3>Apellido</h3>
                <p>{{ user.apellido || 'No especificado' }}</p>
              </ion-label>
              <ion-button 
                @click="editField('apellido')" 
                fill="clear" 
                slot="end"
                class="edit-item-btn"
              >
                <ion-icon :icon="pencilOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>

            <!-- Teléfono (nuevo campo) -->
            <ion-item class="editable-item">
              <ion-label>
                <h3>Teléfono</h3>
                <p>{{ user.telefono || 'No especificado' }}</p>
              </ion-label>
              <ion-button 
                @click="editField('telefono')" 
                fill="clear" 
                slot="end"
                class="edit-item-btn"
              >
                <ion-icon :icon="pencilOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>

            <!-- Dirección (nuevo campo) -->
            <ion-item class="editable-item">
              <ion-label>
                <h3>Dirección</h3>
                <p>{{ user.direccion || 'No especificado' }}</p>
              </ion-label>
              <ion-button 
                @click="editField('direccion')" 
                fill="clear" 
                slot="end"
                class="edit-item-btn"
              >
                <ion-icon :icon="pencilOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Acciones principales -->
      <div class="actions-section">
        <ion-button 
          expand="block" 
          @click="openChangePassword" 
          fill="outline"
          class="action-btn"
        >
          <ion-icon :icon="keyOutline" slot="start"></ion-icon>
          Cambiar Contraseña
        </ion-button>
        
        <ion-button 
          expand="block" 
          @click="logout" 
          fill="clear"
          color="medium"
          class="action-btn"
        >
          <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
          Cerrar Sesión
        </ion-button>
      </div>

      <!-- Modal para edición individual -->
      <ion-modal 
        :is-open="showEditModal" 
        @didDismiss="closeEditModal"
        class="edit-modal"
      >
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editModalTitle }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeEditModal">
                <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        
        <ion-content class="ion-padding">
          <div class="edit-form">
            <!-- Campo Nombre -->
            <ion-item v-if="editingField === 'nombre'" class="form-item">
              <ion-label position="stacked">Nombre</ion-label>
              <ion-input 
                v-model="editForm.nombre" 
                placeholder="Ingresa tu nombre"
                :clear-input="true"
              ></ion-input>
            </ion-item>

            <!-- Campo Apellido -->
            <ion-item v-if="editingField === 'apellido'" class="form-item">
              <ion-label position="stacked">Apellido</ion-label>
              <ion-input 
                v-model="editForm.apellido" 
                placeholder="Ingresa tu apellido"
                :clear-input="true"
              ></ion-input>
            </ion-item>

            <!-- Campo Usuario -->
            <ion-item v-if="editingField === 'username'" class="form-item">
              <ion-label position="stacked">Nombre de Usuario</ion-label>
              <ion-input 
                v-model="editForm.username" 
                placeholder="Ingresa tu usuario"
                :clear-input="true"
              ></ion-input>
            </ion-item>

            <!-- Campo Email -->
            <ion-item v-if="editingField === 'email'" class="form-item">
              <ion-label position="stacked">Correo Electrónico</ion-label>
              <ion-input 
                v-model="editForm.email" 
                type="email"
                placeholder="correo@ejemplo.com"
                :clear-input="true"
              ></ion-input>
            </ion-item>

            <!-- Campo Avatar -->
            <ion-item v-if="editingField === 'avatar'" class="form-item">
              <ion-label position="stacked">URL de Foto de Perfil</ion-label>
              <ion-input 
                v-model="editForm.avatar" 
                placeholder="https://ejemplo.com/foto.jpg"
                :clear-input="true"
              ></ion-input>
              <ion-button 
                @click="takePhoto" 
                fill="clear" 
                slot="end"
                v-if="isMobile"
              >
                <ion-icon :icon="cameraOutline"></ion-icon>
              </ion-button>
            </ion-item>

            <!-- Campo Teléfono -->
            <ion-item v-if="editingField === 'telefono'" class="form-item">
              <ion-label position="stacked">Teléfono</ion-label>
              <ion-input 
                v-model="editForm.telefono" 
                type="tel"
                placeholder="+1 234 567 8900"
                :clear-input="true"
              ></ion-input>
            </ion-item>

            <!-- Campo Dirección -->
            <ion-item v-if="editingField === 'direccion'" class="form-item">
              <ion-label position="stacked">Dirección</ion-label>
              <ion-textarea 
                v-model="editForm.direccion" 
                placeholder="Ingresa tu dirección completa"
                rows="3"
                :auto-grow="true"
              ></ion-textarea>
            </ion-item>

            <!-- Botones de acción -->
            <div class="form-actions">
              <ion-button 
                @click="closeEditModal" 
                fill="outline" 
                expand="block"
                class="cancel-btn"
              >
                Cancelar
              </ion-button>
              <ion-button 
                @click="saveField" 
                color="primary" 
                expand="block"
                :disabled="!isEditFormValid"
                class="save-btn"
              >
                Guardar Cambios
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Modal cambio de contraseña -->
      <ion-modal :is-open="showPwdModal" @didDismiss="closePwdModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Cambiar Contraseña</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closePwdModal">
                <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="password-form">
            <ion-item>
              <ion-label position="stacked">Contraseña Actual</ion-label>
              <ion-input 
                v-model="pwd.current" 
                type="password"
                placeholder="Ingresa tu contraseña actual"
              ></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-label position="stacked">Nueva Contraseña</ion-label>
              <ion-input 
                v-model="pwd.new" 
                type="password"
                placeholder="Ingresa nueva contraseña"
              ></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-label position="stacked">Confirmar Contraseña</ion-label>
              <ion-input 
                v-model="pwd.repeat" 
                type="password"
                placeholder="Repite la nueva contraseña"
              ></ion-input>
            </ion-item>

            <div class="password-actions">
              <ion-button 
                expand="block" 
                @click="changePassword" 
                :disabled="changingPwd || !isPasswordValid"
                class="change-pwd-btn"
              >
                <ion-spinner v-if="changingPwd" slot="start"></ion-spinner>
                {{ changingPwd ? 'Procesando...' : 'Actualizar Contraseña' }}
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonBadge,
  IonModal,
  IonIcon,
  IonSpinner,
  toastController
} from '@ionic/vue';
import { 
  pencilOutline, 
  cameraOutline, 
  keyOutline, 
  logOutOutline,
  closeOutline
} from 'ionicons/icons';
import axios from 'axios';

// Configuración
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const defaultAvatar = '/assets/avatar-placeholder.png';

// Estado reactivo
const user = ref({
  id: null,
  nombre: '',
  apellido: '',
  username: '',
  email: '',
  rol: '',
  avatar: null,
  telefono: '',
  direccion: ''
});

const showEditModal = ref(false);
const showPwdModal = ref(false);
const editingField = ref('');
const changingPwd = ref(false);

const editForm = reactive({
  nombre: '',
  apellido: '',
  username: '',
  email: '',
  avatar: '',
  telefono: '',
  direccion: ''
});

const pwd = reactive({
  current: '',
  new: '',
  repeat: ''
});

// Computed properties
const editModalTitle = computed(() => {
  const fieldNames = {
    'nombre': 'Editar Nombre',
    'apellido': 'Editar Apellido',
    'username': 'Editar Usuario',
    'email': 'Editar Email',
    'avatar': 'Editar Foto de Perfil',
    'telefono': 'Editar Teléfono',
    'direccion': 'Editar Dirección'
  };
  return fieldNames[editingField.value] || 'Editar Información';
});

const isEditFormValid = computed(() => {
  const value = editForm[editingField.value];
  if (!value) return false;
  
  switch (editingField.value) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'telefono':
      return value.length >= 8;
    default:
      return value.trim().length > 0;
  }
});

const isPasswordValid = computed(() => {
  return pwd.current && pwd.new && pwd.repeat && pwd.new === pwd.repeat && pwd.new.length >= 6;
});

const isMobile = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
});

// Obtener ID del usuario logueado
const getLoggedUserId = () => {
  return localStorage.getItem('userId') || 1;
};

// Mostrar notificaciones
const showToast = async (message, color = 'success') => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'top'
  });
  await toast.present();
};

// Cargar datos del usuario
async function loadUser() {
  try {
    const userId = getLoggedUserId();
    const response = await axios.get(`${API_BASE}/usuarios/${userId}`);
    
    if (response.data) {
      user.value = { ...response.data };
    }
  } catch (error) {
    console.error('Error cargando usuario:', error);
    // Datos de demo
    user.value = {
      id: 1,
      nombre: 'Steven',
      apellido: 'Castillo',
      username: 'steven',
      email: 'steven@example.com',
      rol: 'Cliente',
      avatar: null,
      telefono: '+1 234 567 8900',
      direccion: 'Av. Principal #123, Ciudad'
    };
    await showToast('Modo demo activado', 'warning');
  }
}

// Abrir modal de edición para campo específico
function editField(field) {
  editingField.value = field;
  editForm[field] = user.value[field] || '';
  showEditModal.value = true;
}

// Cerrar modal de edición
function closeEditModal() {
  showEditModal.value = false;
  editingField.value = '';
}

// Guardar campo individual
async function saveField() {
  try {
    const userId = getLoggedUserId();
    const field = editingField.value;
    const value = editForm[field];
    
    // Actualizar en el backend
    await axios.patch(`${API_BASE}/usuarios/${userId}`, {
      [field]: value
    });
    
    // Actualizar localmente
    user.value[field] = value;
    
    await showToast(`${fieldNames[field]} actualizado correctamente`);
    closeEditModal();
  } catch (error) {
    console.error('Error guardando campo:', error);
    await showToast('Error al guardar los cambios', 'danger');
  }
}

// Manejo de contraseña
function openChangePassword() {
  pwd.current = '';
  pwd.new = '';
  pwd.repeat = '';
  showPwdModal.value = true;
}

function closePwdModal() {
  showPwdModal.value = false;
}

async function changePassword() {
  changingPwd.value = true;
  try {
    const userId = getLoggedUserId();
    await axios.post(`${API_BASE}/usuarios/${userId}/cambiar-password`, {
      current: pwd.current,
      newPassword: pwd.new,
    });
    
    await showToast('Contraseña actualizada correctamente');
    closePwdModal();
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    await showToast('Error al cambiar contraseña', 'danger');
  } finally {
    changingPwd.value = false;
  }
}

// Funcionalidad adicional
function takePhoto() {
  // Implementar lógica para tomar foto con la cámara
  showToast('Funcionalidad de cámara en desarrollo', 'warning');
}

function logout() {
  // Implementar lógica de logout
  localStorage.removeItem('userId');
  showToast('Sesión cerrada', 'success');
  // Redirigir al login
  window.location.href = '/login';
}

// Nombres de campos para mostrar
const fieldNames = {
  'nombre': 'Nombre',
  'apellido': 'Apellido',
  'username': 'Usuario',
  'email': 'Email',
  'avatar': 'Avatar',
  'telefono': 'Teléfono',
  'direccion': 'Dirección'
};

onMounted(() => {
  loadUser();
});
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-section {
  position: relative;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--ion-color-primary);
}

.edit-avatar-btn {
  position: absolute;
  bottom: -5px;
  right: -5px;
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 50%;
  width: 32px;
  height: 32px;
}

.profile-info {
  flex: 1;
}

.profile-name {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.profile-username,
.profile-email {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
  color: var(--ion-color-medium);
  font-size: 0.95rem;
}

.inline-edit-btn {
  --padding-start: 4px;
  --padding-end: 4px;
  --color: var(--ion-color-primary);
}

.role-badge {
  margin-top: 8px;
}

.editable-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.editable-item h3 {
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--ion-color-dark);
}

.editable-item p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.edit-item-btn {
  --color: var(--ion-color-primary);
}

.actions-section {
  margin-top: 24px;
}

.action-btn {
  margin-bottom: 12px;
}

.edit-modal {
  --border-radius: 16px 16px 0 0;
}

.edit-form {
  padding: 8px 0;
}

.form-item {
  --padding-start: 0;
  margin-bottom: 16px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.cancel-btn {
  --border-color: var(--ion-color-medium);
  --color: var(--ion-color-medium);
}

.save-btn {
  --border-radius: 8px;
}

.password-form {
  padding: 8px 0;
}

.password-actions {
  margin-top: 24px;
}

.change-pwd-btn {
  --border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-name,
  .profile-username,
  .profile-email {
    justify-content: center;
  }
}
</style>