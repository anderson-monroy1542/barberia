<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Servicios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="services-title">
          <h2 class="ion-text-center">Nuestros Servicios de Barbería</h2>
          
          <ion-button 
              v-if="userRole === 1"
              color="secondary"
              @click="openEditModal(defaultService)"
          >
              + Nuevo Servicio
          </ion-button>
          </div>

      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="6" size-lg="4" v-for="servicio in servicios" :key="servicio.Id_servicio">
            
            <ion-card class="service-card">
              <ion-card-header>
                <ion-card-title class="card-title">{{ servicio.Servicio }}</ion-card-title>
                <ion-card-subtitle class="card-subtitle">{{ servicio.EstadoS }}</ion-card-subtitle> 
              </ion-card-header>

              <ion-card-content>
                <p class="card-description">{{ servicio.Descripcion }}</p>
                
                <div class="price-container">
                    <strong>Costo:</strong> 
                    <span class="price-tag">${{ servicio.Precio }}</span>
                </div>

                <div v-if="userRole === 1" class="admin-actions">
                    <ion-button 
                        size="small" 
                        color="primary" 
                        @click="openEditModal(servicio)"
                    >
                        Editar
                    </ion-button>
                    <ion-button 
                        size="small" 
                        color="danger" 
                        @click="confirmDelete(servicio)"
                    >
                        Eliminar
                    </ion-button>
                </div>
                <ion-button 
                    v-else
                    expand="block" 
                    router-link="/Tabs/horarios"
                    color="success">
                    AGENDAR CITA
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      <ion-modal :is-open="showEditModal" @did-dismiss="closeEditModal">
          <ion-header>
              <ion-toolbar>
                  <ion-title>{{ serviceToEdit.Id_servicio ? 'Editar Servicio' : 'Crear Nuevo Servicio' }}</ion-title>
                  <ion-buttons slot="end">
                      <ion-button @click="closeEditModal">Cerrar</ion-button>
                  </ion-buttons>
              </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
              <ion-item>
                  <ion-label position="stacked">Nombre del Servicio</ion-label>
                  <ion-input v-model="serviceToEdit.Servicio"></ion-input>
              </ion-item>
              <ion-item>
                  <ion-label position="stacked">Descripción</ion-label>
                  <ion-textarea v-model="serviceToEdit.Descripcion" rows="3"></ion-textarea>
              </ion-item>
              <ion-item>
                  <ion-label position="stacked">Precio ($)</ion-label>
                  <ion-input type="number" v-model.number="serviceToEdit.Precio" step="0.01"></ion-input>
              </ion-item>
              <ion-item>
                  <ion-label position="stacked">Estado</ion-label>
                  <ion-select v-model="serviceToEdit.Id_estadoS" placeholder="Selecciona el estado">
                      <ion-select-option value="1">Activo</ion-select-option>
                      <ion-select-option value="2">Inactivo</ion-select-option>
                  </ion-select>
              </ion-item>

              <ion-button expand="block" color="success" @click="saveService" class="ion-margin-top">
                  Guardar Cambios
              </ion-button>
          </ion-content>
      </ion-modal>
      <ion-alert
          :is-open="showAlertDelete"
          header="Confirmar Eliminación"
          :message="`¿Estás seguro de eliminar el servicio <strong>${serviceToDelete?.Servicio}</strong>? Esta acción no se puede deshacer.`"
          :buttons="deleteAlertButtons"
          @did-dismiss="showAlertDelete = false"
      ></ion-alert>
      </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
    IonCardTitle, IonCardSubtitle, IonCardContent, IonButton,
    IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonAlert, toastController, onIonViewWillEnter, IonButtons
} from '@ionic/vue';
import axios from 'axios';

// Valores por defecto para el formulario de edición (uso como constante para resetear)
const defaultServiceData = { 
    Id_servicio: null, 
    Servicio: '', 
    Descripcion: '', 
    Precio: 0.00, 
    Id_estadoS: '1' // Usamos string '1' para el ion-select
};

export default defineComponent({
  name: 'Servicios',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
    IonCardTitle, IonCardSubtitle, IonCardContent, IonButton,
    IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonAlert, IonButtons
  },
  setup() {
    const API_URL = 'http://localhost:3000';
    const userRole = ref(0);
    const servicios = ref<any[]>([]); // Usará la data de la API
    const showEditModal = ref(false);
    const serviceToEdit = ref<any>({ ...defaultServiceData });
    
    const showAlertDelete = ref(false);
    const serviceToDelete = ref<any>(null);

    // ======================= LÓGICA DE CARGA DE DATOS =======================
    const loadServices = async () => {
        try {
            // Usamos el endpoint que ya existe en ServiciosController.js
            const response = await axios.get(`${API_URL}/servicios/get/all`);
            servicios.value = response.data;
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            showToast('Error al cargar servicios', 'danger');
        }
    };
    
    onIonViewWillEnter(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            userRole.value = JSON.parse(storedUser).Id_rol;
        }
        loadServices(); // Cargar los servicios reales
    });

    // ======================= LÓGICA DE EDICIÓN/CREACIÓN =======================
    const openEditModal = (servicio: any) => {
        // Clonar el objeto para evitar modificar el original
        const data = servicio.Id_servicio ? servicio : defaultServiceData;
        
        serviceToEdit.value = JSON.parse(JSON.stringify(data));
        
        // Formatear para el formulario
        serviceToEdit.value.Precio = parseFloat(data.Precio || 0);
        serviceToEdit.value.Id_estadoS = String(data.Id_estadoS || '1');
        
        showEditModal.value = true;
    };

    const closeEditModal = () => {
        showEditModal.value = false;
        serviceToEdit.value = { ...defaultServiceData };
    };

    const saveService = async () => {
        if (!serviceToEdit.value.Servicio || !serviceToEdit.value.Precio) {
            showToast('Completa el nombre y el precio del servicio.', 'warning');
            return;
        }

        try {
            const data = {
                ...serviceToEdit.value,
                // Aseguramos que el precio sea un número flotante válido para el backend
                Precio: parseFloat(serviceToEdit.value.Precio), 
                Id_estadoS: parseInt(serviceToEdit.value.Id_estadoS)
            };

            if (data.Id_servicio) {
                // Actualizar (PUT)
                await axios.put(`${API_URL}/servicios/update`, data);
                showToast('Servicio actualizado con éxito', 'success');
            } else {
                // Crear (POST)
                await axios.post(`${API_URL}/servicios/add`, data);
                showToast('Servicio creado con éxito', 'success');
            }
            
            closeEditModal();
            loadServices(); // Recargar la lista
        } catch (error: any) {
            console.error('Error al guardar servicio:', error);
            showToast('Error al guardar: ' + (error.response?.data?.message || error.message), 'danger');
        }
    };

    // ======================= LÓGICA DE ELIMINACIÓN =======================
    const confirmDelete = (servicio: any) => {
        serviceToDelete.value = servicio;
        showAlertDelete.value = true;
    };

    const deleteService = async () => {
        if (!serviceToDelete.value || !serviceToDelete.value.Id_servicio) return;

        try {
            // Usamos el endpoint que ya existe en ServiciosController.js
            await axios.delete(`${API_URL}/servicios/delete/${serviceToDelete.value.Id_servicio}`);
            
            showToast('Servicio eliminado correctamente', 'success');
            loadServices(); // Recargar la lista
        } catch (error: any) {
            console.error('Error al eliminar servicio:', error);
            showToast('Error al eliminar: ' + (error.response?.data?.message || error.message), 'danger');
        } finally {
            serviceToDelete.value = null;
        }
    };
    
    // Configuración de los botones de la alerta de eliminación
    const deleteAlertButtons = [
        {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => { serviceToDelete.value = null; }
        },
        {
            text: 'Eliminar',
            role: 'destructive',
            handler: () => { deleteService(); }
        }
    ];

    // Función global para mostrar Toast
    const showToast = async (message: string, color: string = 'primary') => {
        const toast = await toastController.create({
            message,
            duration: 2000,
            color,
            position: 'top'
        });
        await toast.present();
    };

    return { 
        servicios, userRole, defaultService: defaultServiceData,
        showEditModal, serviceToEdit, openEditModal, closeEditModal, saveService,
        showAlertDelete, serviceToDelete, confirmDelete, deleteAlertButtons
    };
  }
});
</script>

<style scoped>
.services-title {
    color: #f7f7f7; 
    margin: 20px 0;
    font-weight: 600;
    /* Agregado para alinear el título y el botón de agregar */
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.services-title h2 {
    margin: 0;
}

.service-card {
  margin-bottom: 20px;
  background: #1e1e1e; 
  color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.card-title {
    font-weight: bold;
    color: #00bfff; 
}

.card-subtitle {
    /* Usado para mostrar el estado */
    color: #aaaaaa;
}

.card-description {
    margin-bottom: 15px;
    font-size: 0.95em;
    color: #cccccc;
}

.price-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 15px;
    border-top: 1px solid #333333;
}

.price-tag {
    font-size: 1.3em;
    color: #ffd700; 
    font-weight: bold;
}

.admin-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-top: 15px;
    border-top: 1px solid #333333;
    padding-top: 10px;
}
</style>