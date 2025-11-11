<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true" id="cont-login">
      <div class="cont-login">
        <ion-card class="login-card">
          <ion-card-header>
            <ion-card-title class="card-title">Iniciar Sesión</ion-card-title>
          </ion-card-header>
          
          <ion-card-content>
            <form @submit.prevent="login">
              <ion-item>
                <ion-label position="stacked">Correo electrónico</ion-label>
                <ion-input v-model="email" type="email" required></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Contraseña</ion-label>
                <ion-input v-model="password" type="password" required></ion-input>
              </ion-item>

              <ion-item lines="none">
                <ion-checkbox v-model="remember" slot="start"></ion-checkbox>
                <ion-label>Recordarme</ion-label>
              </ion-item>

              <div class="forgot-password">
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>

              <div class="actions">
                <ion-button expand="block" type="submit" class="btn-primary">
                  Iniciar sesión
                </ion-button>
              </div>

              <div class="register-link">
                <span>¿No tienes cuenta? </span>
                <a href="/registro">Regístrate</a>
              </div>
            </form>
          </ion-card-content>
        </ion-card>
      </div>
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
  IonCheckbox
} from '@ionic/vue';

const email = ref('');
const password = ref('');
const remember = ref(false);

const login = () => {
  // Aquí irá la lógica de login
  console.log('Login attempt', { email: email.value, password: password.value });
}
</script>

<style scoped>
@import "../theme/styles.css";

.card-title {
  color: #E6FFFA !important;
  text-align: center;
}

ion-card {
  --background: linear-gradient(180deg, rgba(45, 55, 72, 0.88) 0%, rgba(6, 24, 15, 0.55) 100%);
  margin: 0;
}

.remember-section {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #E6FFFA;
}

.forgot-password {
  text-align: right;
  margin-top: 10px;
}

.forgot-password a {
  color: #38B2AC;
  text-decoration: none;
  font-size: 14px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #E6FFFA;
}

.register-link a {
  color: #38B2AC;
  text-decoration: none;
  font-weight: bold;
}

ion-item {
  --highlight-color: #38B2AC;
  --highlight-height: 2px;
  margin-bottom: 10px;
}

ion-item::part(native) {
  background: transparent;
}

ion-label {
  color: #E6FFFA !important;
}

ion-input {
  color: #E6FFFA !important;
  --placeholder-color: rgba(230, 255, 250, 0.7);
}

.btn-primary {
  margin-top: 20px;
  --background: #38B2AC;
  --color: white;
  --border-radius: 25px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}
</style>
