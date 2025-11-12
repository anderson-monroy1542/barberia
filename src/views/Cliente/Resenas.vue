<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title>Reseña</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <div class="center-container">
                <div class="login-form">
                    <div class="login-text-container">
                        <h1>Añadir Reseña</h1>
                    </div>

                    <!-- Campo de Comentario -->
                    <ion-item>
                        <ion-textarea 
                            placeholder="Comentario" 
                            v-model="comentario"
                            :auto-grow="true"
                            rows="5"
                        ></ion-textarea>
                    </ion-item>

                    <!-- INICIO: Selector de Estrellas -->
                    <ion-item lines="none">
                        <ion-label>Puntuación:</ion-label>
                        <div 
                            class="contenedor-estrellas" 
                            @mouseleave="resetHoverPuntuacion()"
                        >
                            <ion-icon
                            v-for="index in 5"
                            :key="index"
                            :icon="getIconoEstrella(index)"
                            class="icono-estrella"
                            @mouseover="setHoverPuntuacion(index)"
                            @click="seleccionarPuntuacion(index)"
                            />
                        </div>
                    </ion-item>
                    <!-- FIN: Selector de Estrellas -->
                    
                    <!-- 
                        Para la puntuación (1-5)
                    -->
                    <ion-input type="hidden" v-model="puntuacion"></ion-input>
                    
                    <!-- 
                    Para el id de la cita (viene en la URL)
                    -->
                    <ion-input type="hidden" v-model="idCita"></ion-input>

                    
                    <ion-button  color="primary" 
                        expand="block" class="signup-button"
                        @click="guardarResena"
                        :disabled="puntuacion === 0"
                    >
                        Guardar
                    </ion-button>
                </div>
            </div>

            
            <ion-alert
            :is-open="isOpenAlert"
            header="Informacion"
            message="Reseña guardada correctamente"
            :buttons="alertButtons"
            ></ion-alert>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">


    import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonButton, 
    IonTitle, 
    IonBackButton, 
    IonContent, 
    IonItem, 
    IonInput, 
    IonLabel,
    IonTextarea, 
    IonIcon,      
    IonAlert, 
    useIonRouter
    } from '@ionic/vue';
    import { ref } from 'vue';
    import { star, starOutline } from 'ionicons/icons'; // Importación de iconos de estrella
    import { useRoute } from 'vue-router'; // Importamos useRoute

    const router = useIonRouter();
    const route = useRoute(); // Instancia para leer la URL


    const comentario = ref("");
    const puntuacion = ref(0); 
    const hoverPuntuacion = ref(0); 

    //se captura el id de la cita que viene de la url
    
    const idCita = ref(route.params.id || null); 


    var isOpenAlert = ref(false);

    const alertButtons = [
        {
            text: "OK",
            role: 'confirm',
            handler: () => {
                router.back();
            }
        }
    ];

    //Funciones para las Estrellas 

    // Se llama al hacer CLIC en una estrella
    const seleccionarPuntuacion = (index: number) => {
    puntuacion.value = index;
    };

    // Funciones para el efecto
    const setHoverPuntuacion = (index: number) => {
    hoverPuntuacion.value = index;
    };
    const resetHoverPuntuacion = () => {
    hoverPuntuacion.value = 0;
    };

    // Lógica para decidir si mostrar lleno o vacio
    const getIconoEstrella = (index: number) => {
    const displayRating = hoverPuntuacion.value || puntuacion.value;
    if (index <= displayRating) {
        return star; // Icono de estrella llena
    } else {
        return starOutline; // Icono de estrella vacía
    }
    };


    // Función del botón "Guardar"
    const guardarResena = () => {
    if (puntuacion.value === 0) {
        console.error('Debes seleccionar una puntuación');
        return;
    }
    if (!idCita.value) {
        console.error('No se encontró el ID de la cita');
        return;
    }

    // Aquí iría la lógica para guardar la reseña en el backend

    // Muestra el alert de confirmación
    isOpenAlert.value = true;
    };

</script>

<style scoped>
    .login-form {
        width: 400px;
        padding: 20px;
        border-radius: 8px;
    }

    .center-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 90vh;
    }

    .login-text-container {
    text-align: center;
    padding-bottom: 5vh;
    }

    ion-item {
    --padding-start: 16px;
    --padding-end: 16px;
    border-radius: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    --border-width: 0;
    --highlight-color-focused: transparent;
    }

    ion-item:last-of-type {
    margin-bottom: 0;
    }

    .signup-button {
    font-weight: bold;
    height: 50px;
    margin-top: 24px;
    }

    /* Estilos para las Estrellas 
    */
    .contenedor-estrellas {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-evenly;
    padding: 10px 0;
    }

    .icono-estrella {
    font-size: 32px;
    color: #FFBF00;
    cursor: pointer;
    padding: 0 5px;
    transition: transform 0.1s ease-in-out;
    }

    .icono-estrella:hover {
    transform: scale(1.2);
    }

</style>