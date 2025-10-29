<template>
    <ion-page>
        <ion-header>
        <ion-toolbar>
            <ion-title>Servicios</ion-title>
        </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">

        <p>Bienvenido a la página de Servicios.</p>

        </ion-content>
    </ion-page>
    </template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent 
    } from '@ionic/vue';

    export default defineComponent({
    name: 'Inicio',
    components: { 
        IonPage, 
        IonHeader, 
        IonToolbar, 
        IonTitle, 
        IonContent 
    }
    });
</script>