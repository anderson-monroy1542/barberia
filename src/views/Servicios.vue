<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Servicios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <h2 class="ion-text-center services-title">Nuestros Servicios de Barbería</h2>

      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="6" size-lg="4" v-for="servicio in servicios" :key="servicio.nombre">
            
            <ion-card class="service-card">
              <ion-card-header>
                <ion-card-title class="card-title">{{ servicio.nombre }}</ion-card-title>
                <ion-card-subtitle class="card-subtitle">{{ servicio.categoria }}</ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <p class="card-description">{{ servicio.descripcion }}</p>
                
                <div class="price-container">
                    <strong>Costo:</strong> 
                    <span class="price-tag">{{ servicio.precio }}</span>
                </div>
                <ion-button 
                    expand="block" 
                    :router-link="{ path: '/horarios', query: { nombreServicio: servicio.nombre } }" 
                    color="success">
                    AGENDAR CITA
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
    IonCardTitle, IonCardSubtitle, IonCardContent, IonButton 
} from '@ionic/vue';

export default defineComponent({
  name: 'Servicios',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
    IonCardTitle, IonCardSubtitle, IonCardContent, IonButton
  },
  setup() {
    // Definición de los datos de los servicios
    const servicios = ref([
      { nombre: 'Corte Clásico', categoria: 'Cabello', descripcion: 'Estilo tradicional con tijera y máquina.', precio: '$10.00' },
      { nombre: 'Fade (Degradado)', categoria: 'Cabello', descripcion: 'Degradado moderno a tu elección (alto, medio, bajo).', precio: '$12.00' },
      { nombre: 'Corte + Barba', categoria: 'Paquete Completo', descripcion: 'Corte de cabello y perfilado de barba con navaja.', precio: '$18.00' },
      { nombre: 'Arreglo de Barba', categoria: 'Barba', descripcion: 'Perfilado, toalla caliente y aplicación de tónico.', precio: '$8.00' },
      { nombre: 'Corte de Cejas', categoria: 'Extras', descripcion: 'Perfilado y recorte de cejas.', precio: '$5.00' },
      { nombre: 'Limpieza Facial', categoria: 'Facial', descripcion: 'Exfoliación, vapor, mascarilla y crema hidratante.', precio: '$20.00' },
      { nombre: 'Corte con Diseño', categoria: 'Cabello Especial', descripcion: 'Corte más líneas o diseños artísticos con navaja.', precio: '$15.00' },
    ]);

    return { servicios };
  }
});
</script>

<style scoped>
.services-title {
    color: #f7f7f7; 
    margin: 20px 0;
    font-weight: 600;
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
</style>