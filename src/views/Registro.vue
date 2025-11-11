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
                    <ibon-card-content>
                        <form @submit.prevent="onSubmit">
                            <ion-item>
                                <ion-label position="stacked">Nombre</ion-label>
                                <ion-input v-model="name" required></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Correo electrónico</ion-label>
                                <ion-input v-model="email" type="email" required></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Contraseña</ion-label>
                                <ion-input v-model="password" type="password" required></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Confirmar contraseña</ion-label>
                                <ion-input v-model="confirmPassword" type="password" required></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Tipo de usuario</ion-label>
                                <ion-select v-model="role">
                                    <ion-select-option value="cliente">Cliente</ion-select-option>
                                    <ion-select-option value="barbero">Barbero</ion-select-option>
                                </ion-select>
                            </ion-item>

                            <div class="actions">
                                <ion-button type="submit" expand="block" class="btn-primary">Registrarse</ion-button>
                            </div>
                        </form>
                    </ibon-card-content>
                </ion-card>
            </div>

        </ion-content>
    </ion-page>
    </template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
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
    IonSelectOption
} from '@ionic/vue';

export default defineComponent({
    name: 'Registro',
    components: {
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
        IonSelectOption
    },
    setup() {
        const name = ref('');
        const email = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const role = ref('cliente');

        const onSubmit = () => {
            if (password.value !== confirmPassword.value) {
                // alerta simple; en producción usar un componente de feedback
                alert('Las contraseñas no coinciden');
                return;
            }
            // Aquí enviarías los datos a tu API o manejarías el login/registro
            console.log('Formulario enviado', {
                name: name.value,
                email: email.value,
                password: password.value,
                role: role.value
            });
        };

        return { name, email, password, confirmPassword, role, onSubmit };
    }
});
</script>

<style scoped>
@import "../theme/styles.css";

/* Agregar estos estilos específicos */
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