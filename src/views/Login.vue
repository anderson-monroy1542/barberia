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
                <ion-input v-model="Correo" type="email" required></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Contraseña</ion-label>
                <ion-input v-model="Contrasena" type="password" required></ion-input>
              </ion-item>


              <div class="actions">
                <ion-button expand="block" type="submit" class="btn-primary">
                  Iniciar sesión
                </ion-button>
              </div>

              <div class="register-link">
                <span>¿No tienes cuenta? </span>
                <router-link to="/Registro">Regístrate</router-link>
              </div>
            </form>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- 
        Añadí el IonToast de tu ejemplo para mostrar errores.
      -->
      <ion-toast
          :is-open="isOpen"
          :message="msgToast"
          :duration="5000"
          color="danger"
          @did-dismiss="setOpen(false)"
      ></ion-toast>
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
  useIonRouter,
  IonToast,
} from '@ionic/vue';

import UserService from '@/api/UserService';
import User from '@/interface/User'; 

const Correo = ref('');
const Contrasena = ref('');

const router = useIonRouter();
const userService = new UserService();
const isOpen = ref(false);
const msgToast = ref("");

const setOpen = (value: boolean) => {
  isOpen.value = value
}

const login = async () => {
  try {
    if (Correo.value.length > 0 && Contrasena.value.length > 0) {
      
      const userAccount: User = await userService.login(Correo.value, Contrasena.value);
      
      if (userAccount && userAccount.Id_usuario) {
        
        localStorage.setItem('user', JSON.stringify(userAccount));
        
        // aqui redirijo al incio segun el rol
        switch (userAccount.Id_rol) {
          case 1: // Admin
            router.push('/Tabs/gestioncitas');
            break;
          case 2: // Barbero
            router.push('/Tabs/barberocitas');
            break;
          case 3: // Cliente
            router.push('/Tabs/inicio');
            break;
          default: 
            router.push('/login');
        }

      } else {
        msgToast.value = "Credenciales incorrectas";
        setOpen(true);
      }

    } else {
      msgToast.value = "Complete los campos";
      setOpen(true);
    }

  } catch (error) {
    console.error(error);
    msgToast.value = "Credenciales incorrectas";
    setOpen(true);
  }
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