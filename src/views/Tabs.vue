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

            <!-- Nueva pestaña de Reseñas para el admin -->
            <ion-tab-button v-if="userRole === 1" tab="resenas" href="/Tabs/gestionresenas">
            <ion-icon :icon="starOutline" />
            <ion-label>Reseñas</ion-label>
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


<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { 
    IonPage, 
    IonTabs, 
    IonTabBar, 
    IonTabButton, 
    IonLabel, 
    IonIcon, 
    IonRouterOutlet, 
    onIonViewWillEnter
    } from '@ionic/vue';
    import { 
    homeOutline, 
    calendarOutline, 
    gridOutline, 
    timeOutline, 
    personCircleOutline,
    starOutline  
    } from 'ionicons/icons';

    
    const userRole = ref<number | null>(null);

    
    onIonViewWillEnter(() => {
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        
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