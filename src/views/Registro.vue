<template>
    <ion-page>
        <ion-header>
        <ion-toolbar>
            <ion-title>Registro</ion-title>

        </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" id="cont-login">

            <div class="cont-login">
                <ion-card class="login-card">
                    <ion-card-header>
                        <ion-card-title class="card-title">Crear cuenta</ion-card-title>
                    </ion-card-header>

                    <ion-card-content>
                        <form @submit.prevent="onSubmit">
                            <ion-item>
                                <ion-label position="stacked">Nombre</ion-label>
                                <ion-input v-model="Nombre" required></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Apellido</ion-label>
                                <ion-input v-model="Apellido" required></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Correo electrónico</ion-label>
                                <ion-input v-model="Correo" type="email" required></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Contraseña</ion-label>
                                <ion-input v-model="Contrasena" type="password" required></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Confirmar contraseña</ion-label>
                                <ion-input v-model="ConfirmarContrasena" type="password" required></ion-input>
                            </ion-item>

                            <div class="actions">
                                <ion-button 
                                    type="submit" 
                                    expand="block" 
                                    class="btn-primary"
                                    :disabled="isSubmitting"
                                >
                                    {{ isSubmitting ? 'Registrando...' : 'Registrarse' }}
                                </ion-button>
                            </div>
                        </form>
                    </ion-card-content>
                </ion-card>
            </div>

            <ion-toast
                :is-open="isOpen"
                message="Es necesario llenar todos los campos obligatorios"
                :duration="5000"
                @did-dismiss="setToast(false)"
            ></ion-toast>
            <ion-alert
                :is-open="isOpenAlert"
                header="Informacion"
                message="Cuenta creada correctamente"
                :buttons="alertButtons"
            ></ion-alert>

        </ion-content>
    </ion-page>
    </template>


<script setup lang="ts">
import { ref } from 'vue';
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
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,

    IonToast,
    IonAlert,
    useIonRouter
} from '@ionic/vue';


import UserService from '@/api/UserService';
import User from '@/interface/User';


const Nombre = ref('');
const Apellido = ref('');
const Correo = ref('');
const Contrasena = ref(''); 
const ConfirmarContrasena = ref('');
const Id_rol = ref(3); 

const isSubmitting = ref(false); // Para deshabilitar el botón

const userService = new UserService();
const router = useIonRouter();

var isOpen = ref(false);
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

// Funciones para mostrar alertas
const setToast = (value: boolean) => {
    isOpen.value = value;
}

const setAlert = (value: boolean) => {
    isOpenAlert.value = value;
}


const onSubmit = async () => {
    //Si ya se está enviando, no hacer nada
    if (isSubmitting.value) return;

    //Validar contraseñas
    if (Contrasena.value !== ConfirmarContrasena.value) {
        alert('Las contraseñas no coinciden'); 
        return;
    }

    // 2. Validar campos
    if (Nombre.value.length > 0
        && Apellido.value.length > 0
        && Correo.value.length > 0
        && Contrasena.value.length > 0
    ) {

        //deshabilita el boton
        isSubmitting.value = true;

        const userToSave: User = {
            Nombre: Nombre.value,
            Apellido: Apellido.value,
            Correo: Correo.value,
            Contrasena: Contrasena.value, 
            Id_rol: Id_rol.value
        };


        try {
            const response = await userService.add(userToSave);

            if (response && response.insertId) {
                // Mostrar alerta de éxito
                setAlert(true);
            } else {
                // Mostrar error si la API falla
                alert('Error al guardar. Intente de nuevo.');
            }

        } catch (error: any) { 
            console.error(error);
            
            // Muestra si es correo duplicado
            if (error.response && error.response.data) {
                alert(`Error: ${error.response.data}`);
            } else {
                alert('Error de conexión con la API.');
            }
        } finally {
            //habilita el botón nuevamente
            isSubmitting.value = false;
        }
        
    } else {
        // Mostrar error de campos vacíos
        setToast(true);
    }
};
</script>


<style scoped>
@import "../theme/styles.css";

ion-item {
  --background: transparent;
  margin-bottom: 16px;
}

ion-label {
  color: #E6FFFA !important;
  font-weight: 500;
  opacity: 1 !important;
}

ion-input, ion-select {
  --color: #E6FFFA !important;
  --placeholder-color: rgba(230, 255, 250, 0.7) !important;
}

ion-select::part(text) {
  color: #E6FFFA;
}

ion-select::part(icon) {
  color: #E6FFFA;
}

.card-title {
  color: #E6FFFA !important;
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>