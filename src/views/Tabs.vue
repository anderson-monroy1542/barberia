<template>
    <ion-page>
        <ion-tabs>
        <ion-router-outlet></ion-router-outlet>

        <ion-tab-bar slot="bottom">
            <ion-tab-button tab="inicio" href="/inicio">
            <ion-icon :icon="homeOutline" />
            <ion-label>Inicio</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="agendar" href="/agendar">
            <ion-icon :icon="calendarOutline" />
            <ion-label>Agendar</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="servicios" href="/servicios">
            <ion-icon :icon="gridOutline" />
            <ion-label>Servicios</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="horarios" href="/horarios">
            <ion-icon :icon="timeOutline" />
            <ion-label>Horarios</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="cuenta" href="/cuenta">
            <ion-icon :icon="personCircleOutline" />
            <ion-label>Cuenta</ion-label>
            </ion-tab-button>
        </ion-tab-bar>
        </ion-tabs>
    </ion-page>
    </template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { 
    IonPage, 
    IonTabs, 
    IonTabBar, 
    IonTabButton, 
    IonLabel, 
    IonIcon, 
    IonRouterOutlet 
    } from '@ionic/vue';

    //inconos
    import { 
    homeOutline, 
    calendarOutline, 
    gridOutline, 
    timeOutline, 
    personCircleOutline 
    } from 'ionicons/icons';

    export default defineComponent({
    name: 'Tabs',
    components: { 
        IonPage, 
        IonTabs, 
        IonTabBar, 
        IonTabButton, 
        IonLabel, 
        IonIcon, 
        IonRouterOutlet 
    },
    setup() {
        //haciendo accesibles los iconos
        return {
        homeOutline,
        calendarOutline,
        gridOutline,
        timeOutline,
        personCircleOutline
        };
    }
    });
</script>

<style scoped>
    ion-tab-bar {
    /*fondo del menú */
    --background: #2D3748;

    /* botón ACTIVO  */
    --color-selected: #4FD1C5;

    /* botones INACTIVOS */
    --color: #E6FFFA;

    /* Borde superior */
    border-top: 1px solid #38B2AC;
    }
</style>