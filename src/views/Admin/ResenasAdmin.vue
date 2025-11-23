<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Gestión de Reseñas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout()">
            <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
            Cerrar Sesión
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Filtros -->
      <div class="filters">
        <ion-item>
          <ion-label>Filtrar por puntuación</ion-label>
          <ion-select v-model="filterRating" placeholder="Todas">
            <ion-select-option :value="null">Todas</ion-select-option>
            <ion-select-option :value="5">5 estrellas</ion-select-option>
            <ion-select-option :value="4">4 estrellas</ion-select-option>
            <ion-select-option :value="3">3 estrellas</ion-select-option>
            <ion-select-option :value="2">2 estrellas</ion-select-option>
            <ion-select-option :value="1">1 estrella</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-button expand="block" @click="clearFilters">Limpiar filtros</ion-button>
      </div>

      <!-- Lista de Reseñas -->
      <div class="reviews">
        <ion-card v-for="r in filteredReviews" :key="r.Id_resena" class="review-card">
          <ion-card-header>
            <div class="card-header-content">
              <ion-card-title>
                {{ r.ClienteNombre }} {{ r.ClienteApellido }}
              </ion-card-title>
              <div class="stars">
                <ion-icon 
                  v-for="i in 5" 
                  :key="i" 
                  :icon="starOutline"
                  :class="{ 'star-filled': i <= r.Puntuacion }"
                ></ion-icon>
              </div>
            </div>
          </ion-card-header>
          
          <ion-card-content>
            <p class="comment">"{{ r.Comentario }}"</p>
            
            <div class="info-grid">
              <div class="info-item">
                <ion-icon :icon="calendarOutline"></ion-icon>
                <span><strong>Fecha:</strong> {{ formatDate(r.Fecha) }}</span>
              </div>
              <div class="info-item">
                <ion-icon :icon="timeOutline"></ion-icon>
                <span><strong>Hora:</strong> {{ r.Hora }}</span>
              </div>
              <div class="info-item">
                <ion-icon :icon="cutOutline"></ion-icon>
                <span><strong>Servicio:</strong> {{ r.NombreServicio || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <ion-icon :icon="personOutline"></ion-icon>
                <span><strong>Barbero:</strong> {{ r.BarberoNombre }} {{ r.BarberoApellido }}</span>
              </div>
            </div>
            
            <div class="card-actions">
              <ion-button size="small" fill="outline" color="danger" @click="confirmDelete(r)">
                <ion-icon :icon="trashOutline" slot="start"></ion-icon>
                Eliminar
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <div v-if="filteredReviews.length === 0 && !loading" class="empty">
          <ion-icon :icon="chatboxOutline" class="empty-icon"></ion-icon>
          <ion-text>No hay reseñas disponibles.</ion-text>
        </div>

        <div v-if="loading" class="loading">
          <ion-spinner></ion-spinner>
          <p>Cargando reseñas...</p>
        </div>
      </div>

      <!-- Modal de Confirmación de Eliminación -->
      <ion-modal :is-open="showDeleteModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Confirmar eliminación</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeDeleteModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div v-if="reviewToDelete" class="modal-content">
            <ion-icon :icon="warningOutline" class="warning-icon" color="danger"></ion-icon>
            <h3>¿Eliminar esta reseña?</h3>
            
            <div class="review-details">
              <p><strong>Cliente:</strong> {{ reviewToDelete.ClienteNombre }} {{ reviewToDelete.ClienteApellido }}</p>
              <p><strong>Puntuación:</strong> {{ reviewToDelete.Puntuacion }} ⭐</p>
              <p><strong>Comentario:</strong> "{{ reviewToDelete.Comentario }}"</p>
            </div>

            <ion-button expand="block" color="danger" @click="deleteReview">
              <ion-icon :icon="trashOutline" slot="start"></ion-icon>
              Eliminar definitivamente
            </ion-button>
            <ion-button expand="block" fill="outline" @click="closeDeleteModal">
              Cancelar
            </ion-button>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
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
    IonModal,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonText,
    IonIcon,
    IonSpinner,
    useIonRouter,
    toastController
  } from '@ionic/vue';
  import {
    logOutOutline,
    starOutline,
    trashOutline,
    calendarOutline,
    timeOutline,
    cutOutline,
    personOutline,
    chatboxOutline,
    warningOutline
  } from 'ionicons/icons';
  import axios from 'axios';

  // Configuración de la API
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Estado
  const reviews = ref<any[]>([]);
  const filterRating = ref<number | null>(null);
  const showDeleteModal = ref(false);
  const reviewToDelete = ref<any | null>(null);
  const router = useIonRouter();
  const loading = ref(false);

  // Computed
  const filteredReviews = computed(() => {
    let list = reviews.value.slice();
    
    if (filterRating.value !== null) {
      list = list.filter((r) => r.Puntuacion === filterRating.value);
    }
    
    return list;
  });

  // Funciones
  async function loadReviews() {
    loading.value = true;
    try {
      const response = await axios.get(`${API_URL}/resenas/get/all`);
      reviews.value = response.data;
      console.log('Reseñas cargadas:', reviews.value);
    } catch (error: any) {
      console.error('Error al cargar reseñas:', error);
      showToast('Error al cargar las reseñas', 'danger');
    } finally {
      loading.value = false;
    }
  }

  function confirmDelete(review: any) {
    reviewToDelete.value = review;
    showDeleteModal.value = true;
  }

  function closeDeleteModal() {
    showDeleteModal.value = false;
    reviewToDelete.value = null;
  }

  async function deleteReview() {
    if (!reviewToDelete.value) return;
    
    try {
      await axios.delete(`${API_URL}/resenas/delete/${reviewToDelete.value.Id_resena}`);
      
      // Remover del array local
      reviews.value = reviews.value.filter(
        r => r.Id_resena !== reviewToDelete.value.Id_resena
      );
      
      showToast('Reseña eliminada correctamente', 'success');
      closeDeleteModal();
    } catch (error: any) {
      console.error('Error al eliminar reseña:', error);
      showToast('Error al eliminar la reseña', 'danger');
    }
  }

  function clearFilters() {
    filterRating.value = null;
  }

  function formatDate(dateString: string) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async function showToast(message: string, color: string = 'primary') {
    const toast = await toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  const logout = () => {
    localStorage.removeItem('user');
    router.navigate('/login', 'back', 'replace');
  };


  onMounted(() => {
    loadReviews();
  });
</script>

<style scoped>
.filters {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.reviews {
  display: grid;
  gap: 12px;
}

.review-card {
  margin: 0;
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.stars ion-icon {
  font-size: 20px;
  color: #ccc;
}

.stars ion-icon.star-filled {
  color: #ffd700;
}

.comment {
  margin: 12px 0;
  font-style: italic;
  color: var(--ion-color-medium);
  font-size: 0.95rem;
}

.info-grid {
  display: grid;
  gap: 8px;
  margin: 16px 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.info-item ion-icon {
  color: var(--ion-color-primary);
  font-size: 18px;
}

.card-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--ion-color-medium);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.loading {
  text-align: center;
  padding: 40px 20px;
}

.loading ion-spinner {
  margin-bottom: 16px;
}

.modal-content {
  text-align: center;
}

.warning-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.review-details {
  background: var(--ion-color-light);
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: left;
}

.review-details p {
  margin: 8px 0;
}
</style>