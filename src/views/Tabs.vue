<template>
    <ion-page>
        <ion-tabs>
        <ion-router-outlet></ion-router-outlet>

        <ion-tab-bar slot="bottom">
            
            <!-- Rol admin -->
            <!-- Inicio del admin -->
            <ion-tab-button v-if="userRole === 1" tab="inicio" href="/Tabs/gestioncitas">
            <ion-icon :icon="homeOutline" />
            <ion-label>Inicio</ion-label>
            </ion-tab-button>
            <!-- aqui se pueden añadir mas cosas para el admin -->


            <!-- Rol barbero -->
            <!-- Inicio del barbero -->
            <ion-tab-button v-if="userRole === 2" tab="inicio" href="/Tabs/barberocitas">
            <ion-icon :icon="homeOutline" />
            <ion-label>Inicio</ion-label>
            </ion-tab-button>
            <!-- aqui se pueden añadir mas cosas para el barbero -->


            <!-- Rol cliente -->
            <!-- Exclusivo del cliente -->
            <ion-tab-button v-if="userRole === 3" tab="inicio" href="/Tabs/inicio">
            <ion-icon :icon="homeOutline" />
            <ion-label>Inicio</ion-label>
            </ion-tab-button>
            
            <ion-tab-button v-if="userRole === 3" tab="agendar" href="/Tabs/agendar">
            <ion-icon :icon="calendarOutline" />
            <ion-label>Agendar</ion-label>
            </ion-tab-button>
            

            <!-- Todos los roles-->
            <ion-tab-button tab="servicios" href="/Tabs/servicios">
            <ion-icon :icon="gridOutline" />
            <ion-label>Servicios</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="horarios" href="/Tabs/horarios">
            <ion-icon :icon="timeOutline" />
            <ion-label>Horarios</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="cuenta" href="/Tabs/cuenta">
            <ion-icon :icon="personCircleOutline" />
            <ion-label>Cuenta</ion-label>
            </ion-tab-button>

        </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<!-- 
  AÑADIMOS UN <script setup> para leer el rol del usuario
  y poder usar v-if en el template.
-->
<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { 
    IonPage, 
    IonTabs, 
    IonTabBar, 
    IonTabButton, 
    IonLabel, 
    IonIcon, 
    IonRouterOutlet 
    } from '@ionic/vue';
    import { 
    homeOutline, 
    calendarOutline, 
    gridOutline, 
    timeOutline, 
    personCircleOutline 
    } from 'ionicons/icons';

    // Creamos una variable reactiva para guardar el rol
    const userRole = ref<number | null>(null);

    // onMounted se ejecuta cuando el componente se carga
    onMounted(() => {
    // Leemos el usuario de localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        // Convertimos el string a objeto y guardamos el Id_rol
        userRole.value = JSON.parse(storedUser).Id_rol;
    }
    });
</script>

<style scoped>
    ion-tab-bar {
    --background: #2D3748;
    --color-selected: #4FD1C5;
    --color: #E6FFFA;
    border-top: 1px solid #38B2AC;
    }
</style>