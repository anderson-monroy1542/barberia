<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mi Cuenta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-card>
        <ion-card-header>
          <ion-card-title>Perfil del usuario</ion-card-title>
        </ion-card-header>

        <ion-card-content>

         
          <div class="edit-row">
            <ion-item class="edit-item">
              <ion-label position="stacked">Nombre</ion-label>
              <ion-input 
                :readonly="campoEditando !== 'Nombre'"
                v-model="usuario.Nombre"
              ></ion-input>
            </ion-item>

            <ion-button fill="clear" @click="toggleEdit('Nombre')" class="icon-btn">
              <ion-icon :icon="pencil"></ion-icon>
            </ion-button>
          </div>

         
          <div class="edit-row">
            <ion-item class="edit-item">
              <ion-label position="stacked">Apellido</ion-label>
              <ion-input 
                :readonly="campoEditando !== 'Apellido'"
                v-model="usuario.Apellido"
              ></ion-input>
            </ion-item>

            <ion-button fill="clear" @click="toggleEdit('Apellido')" class="icon-btn">
              <ion-icon :icon="pencil"></ion-icon>
            </ion-button>
          </div>

         
          <div class="edit-row">
            <ion-item class="edit-item">
              <ion-label position="stacked">Correo</ion-label>
              <ion-input 
                :readonly="campoEditando !== 'Correo'"
                v-model="usuario.Correo"
              ></ion-input>
            </ion-item>

            <ion-button fill="clear" @click="toggleEdit('Correo')" class="icon-btn">
              <ion-icon :icon="pencil"></ion-icon>
            </ion-button>
          </div>

         
          <div class="edit-row">
            <ion-item class="edit-item">
              <ion-label position="stacked">Contraseña</ion-label>
              <ion-input 
                type="password"
                :readonly="campoEditando !== 'Contrasena'"
                v-model="usuario.Contrasena"
              ></ion-input>
            </ion-item>

            <ion-button fill="clear" @click="toggleEdit('Contrasena')" class="icon-btn">
              <ion-icon :icon="pencil"></ion-icon>
            </ion-button>
          </div>

          <!-- ROL -->
          <ion-item>
            <ion-label position="stacked">Rol</ion-label>
            <ion-input :value="usuario.Id_rol" readonly></ion-input>
          </ion-item>

         
          <ion-button expand="block" color="success" @click="guardarCambios" class="btn-save">
            Guardar cambios
          </ion-button>

          
          <ion-button expand="block" color="danger" @click="logout" class="btn-logout">
            Cerrar sesión
          </ion-button>

        </ion-card-content>
      </ion-card>

      <!-- TOAST -->
      <ion-toast
        :is-open="toastOpen"
        :message="toastMsg"
        :duration="2500"
        color="success"
        @did-dismiss="toastOpen = false"
      ></ion-toast>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonIcon, IonToast, useIonRouter, onIonViewWillEnter
} from "@ionic/vue";

import axios from "axios";
import { pencil } from "ionicons/icons";

const router = useIonRouter();

const API_URL = "http://localhost:3000/usuarios";

const usuario = ref({
  Id_usuario: "",
  Nombre: "",
  Apellido: "",
  Correo: "",
  Contrasena: "",
  Id_rol: ""
});

const campoEditando = ref(null);
const toastOpen = ref(false);
const toastMsg = ref("");

const mostrarToast = (msg) => {
  toastMsg.value = msg;
  toastOpen.value = true;
};

const toggleEdit = (campo) => {
  campoEditando.value = campo;
};


const guardarCambios = async () => {
  try {
    const id = usuario.value.Id_usuario;

    await axios.put(`${API_URL}/${id}`, usuario.value);

    localStorage.setItem("user", JSON.stringify(usuario.value));

    mostrarToast("Datos actualizados correctamente");
    campoEditando.value = null;

  } catch (error) {
    console.error(error);
    mostrarToast("Error al guardar cambios");
  }
};


onIonViewWillEnter(async () => {
  try {
    const data = localStorage.getItem("user");

    if (!data) return;

    const userLocal = JSON.parse(data);
    const id = userLocal.Id_usuario;

    
    let resp;

    try {
      resp = await axios.get(`${API_URL}/${id}`);
    } catch (e) {
      console.warn(" La API no tiene GET /usuarios/:id — Usando datos locales");
      usuario.value = userLocal;
      return;
    }

    let datos = resp.data;

    if (Array.isArray(datos)) datos = datos[0];

    if (!datos) return;

    usuario.value = datos;

    localStorage.setItem("user", JSON.stringify(usuario.value));

  } catch (error) {
    console.error("Error cargando usuario:", error);
  }
});


const logout = () => {
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<style scoped>
ion-card {
  border-radius: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.edit-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.edit-item {
  flex: 1;
}

.icon-btn {
  margin-left: 6px;
  --color: #38B2AC;
}

ion-label {
  font-weight: bold;
  color: #2D3748;
}

.btn-save {
  margin-top: 20px;
}

.btn-logout {
  margin-top: 20px;
}
</style>