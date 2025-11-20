<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Horarios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <h2 class="ion-text-center">Horarios disponibles</h2>

      <!--boton solo para admin-->
      <ion-item v-if="servicioSeleccionadoDesdeRuta" lines="none" class="info-card ion-margin-bottom">
        <ion-label>
          <p class="ion-no-margin">Servicio a Agendar:</p>
          <h3 class="ion-no-margin">
            <strong>{{ servicioSeleccionadoDesdeRuta }}</strong>
          </h3>
        </ion-label>
      </ion-item>
      <ion-button
        v-if="userRole === 'admin'"
        expand="block"
        color="warning"
        class="ion-margin-bottom"
        @click="abrirGestionHorarios"
      >
        Gestionar horarios
      </ion-button>

      <ion-grid>
        <ion-row class="ion-text-center ion-text-bold">
          <ion-col size="3">Día</ion-col>
          <ion-col size="3">Fecha</ion-col>
          <ion-col size="2">Hora</ion-col>
          <ion-col size="2">Barbero</ion-col>
          <ion-col size="2">Acción</ion-col>
        </ion-row>

        <!--datos-->
        <ion-row
          v-for="(horario, index) in horarios"
          :key="index"
          class="ion-text-center"
        >
          <ion-col size="3">{{ horario.dia }}</ion-col>
          <ion-col size="3">{{ formatFechaParaMostrar(horario.fecha) }}</ion-col>
          <ion-col size="2">{{ horario.hora }}</ion-col>
          <ion-col size="2">{{ horario.barbero }}</ion-col>
          <ion-col size="2">
            <ion-button color="primary" @click="abrirAgendar(horario)">
              Agendar
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!--modal para agendar-->
      <ion-modal :is-open="modalAgendar" @did-dismiss="cerrarModalAgendar">
        <ion-header>
          <ion-toolbar>
            <ion-title>Agendar cita</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Servicio</ion-label>
            <ion-input v-model="servicioParaAgendar" readonly></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Día</ion-label>
            <ion-input v-model="horarioSeleccionado.dia" readonly></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Fecha</ion-label>
            <ion-input :value="formatFechaParaMostrar(horarioSeleccionado.fecha)" readonly></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Hora</ion-label>
            <ion-input v-model="horarioSeleccionado.hora" readonly></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Barbero</ion-label>
            <ion-input v-model="horarioSeleccionado.barbero" readonly></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Tu Nombre</ion-label>
            <ion-input v-model="nombreCliente" placeholder="Ingresa tu nombre"></ion-input>
          </ion-item>
          <ion-button expand="block" color="success" @click="confirmarAgendar">
            Confirmar cita
          </ion-button>
          <ion-button expand="block" fill="outline" @click="cerrarModalAgendar">
            Cancelar
          </ion-button>
        </ion-content>
      </ion-modal>
      
      <!--modal gestion de horarios, se oculta hasta que 'modalGestion' sea true-->
      <ion-modal :is-open="modalGestion" @did-dismiss="cerrarGestionHorarios">
        <ion-header>
          <ion-toolbar>
            <ion-title>Gestión de horarios</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Fecha</ion-label>
            <input 
              type="date"
              v-model="nuevoHorario.fecha"
              @change="onFechaChange"
              class="native-input"
            />
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Día de la semana</ion-label>
            <ion-input v-model="nuevoHorario.dia" readonly></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Hora</ion-label>
            <input 
              type="time"
              v-model="nuevoHorario.hora"
              step="900" 
              class="native-input"
            />
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Barbero</ion-label>
            <ion-input v-model="nuevoHorario.barbero" placeholder="Nombre del barbero"></ion-input>
          </ion-item>
          <ion-button expand="block" color="success" @click="agregarHorario">
            Agregar horario
          </ion-button>
          <ion-button expand="block" fill="outline" @click="cerrarGestionHorarios">
            Cerrar
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent,  ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonItem,
  IonLabel,
  IonInput
} from '@ionic/vue';

export default defineComponent({
  name: 'HorariosBasico',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonModal,
    IonItem,
    IonLabel,
    IonInput
  },
  setup() {
    const route = useRoute(); // Inicializar useRoute
    const servicioSeleccionadoDesdeRuta = ref('');
    const servicioParaAgendar = ref(''); 
    onMounted(() => {
        const servicio = route.query.nombreServicio;
        if (servicio) {
            servicioSeleccionadoDesdeRuta.value = String(servicio);
            servicioParaAgendar.value = String(servicio);
        }
    });
    const userRole = ref('admin');
    const horarios = ref([
      { dia: 'Lunes', fecha: '2025-11-05', hora: '09:00', barbero: 'Carlos' },
      { dia: 'Martes', fecha: '2025-11-06', hora: '10:00', barbero: 'Luis' },
      { dia: 'Martes', fecha: '2025-11-06', hora: '11:00', barbero: 'Luis' },
    ]);

    //estado del modal
    const modalAgendar = ref(false);
    const horarioSeleccionado = ref<any>({});
    const nombreCliente = ref('');

    const abrirAgendar = (horario: any) => {
      horarioSeleccionado.value = { ...horario };
      servicioParaAgendar.value = servicioSeleccionadoDesdeRuta.value; 
      modalAgendar.value = true;
    };

    const cerrarModalAgendar = () => {
      modalAgendar.value = false;
      nombreCliente.value = '';
    };

    const confirmarAgendar = () => {
      console.log('Cita agendada:', {
        ...horarioSeleccionado.value,
        servicio: servicioParaAgendar.value,
        cliente: nombreCliente.value
      });
      
      cerrarModalAgendar();
      console.log('¡Cita agendada exitosamente!');
    };
    
    //mostrar/ocultar el modal de gestión
    const modalGestion = ref(false);
    
    const nuevoHorario = ref({
      dia: '',
      fecha: '',
      hora: '',
      barbero: ''
    });

    //Abre el modal de gestión
    const abrirGestionHorarios = () => {
      modalGestion.value = true;
    };

    const cerrarGestionHorarios = () => {
      modalGestion.value = false;
      //se limpia nuevohorario'
      nuevoHorario.value = { dia: '', fecha: '', hora: '', barbero: '' };
    };

    const agregarHorario = () => {
      if (
        nuevoHorario.value.fecha &&
        nuevoHorario.value.hora &&
        nuevoHorario.value.barbero
      ) {
        horarios.value.push({
          dia: nuevoHorario.value.dia,
          fecha: nuevoHorario.value.fecha,
          hora: nuevoHorario.value.hora,
          barbero: nuevoHorario.value.barbero
        });
        
        cerrarGestionHorarios();
        console.log('Horario agregado correctamente');
      } else {
        console.warn('Por favor completa todos los campos (fecha, hora y barbero)');
      }
    };

    //obetener el día segun la fecha
    const onFechaChange = () => {
      const val = nuevoHorario.value.fecha;
      if (val) {
        nuevoHorario.value.dia = deriveDayNameFromDate(val);
      } else {
        nuevoHorario.value.dia = '';
      }
    };

    function deriveDayNameFromDate(isoDateString: string): string {
      try {
        const dateOnly = isoDateString.split('T')[0];
        const d = new Date(dateOnly + 'T12:00:00'); 
        const weekday = d.toLocaleDateString('es-ES', { weekday: 'long' });
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
      } catch (e) {
        return ''; //devuelve vacío si la fecha es inválida
      }
    }

    /**
     * Helper para formatear la fecha en la lista (ej: '2025-11-05' -> '05/11/2025')
     */
    function formatFechaParaMostrar(isoDateString: string): string {
      if (!isoDateString) return '';
      try {
        const dateOnly = isoDateString.split('T')[0];
        const d = new Date(dateOnly + 'T12:00:00');
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (e) {
        return isoDateString;
      }
    }

    //retorno de lo que usa el template
    return {
      userRole,

      servicioSeleccionadoDesdeRuta,
      servicioParaAgendar,
      
      //datos lista
      horarios,

      modalAgendar,
      horarioSeleccionado,
      nombreCliente,
      abrirAgendar,
      cerrarModalAgendar,
      confirmarAgendar,
      
      modalGestion,
      abrirGestionHorarios,
      cerrarGestionHorarios,
      nuevoHorario,
      agregarHorario,
      onFechaChange,


      formatFechaParaMostrar
    };
  }
});
</script>

<style>
.info-card {
    --background: #1e1e1e; /* Fondo oscuro */
    --color: #ffd700; /* Color dorado/amarillo para resaltar */
    border-left: 5px solid #ffd700;
    margin-bottom: 20px;
    border-radius: 4px;
    padding-top: 5px;
    padding-bottom: 5px;
}
.native-input {
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  background: transparent;
  color: inherit;
  border: none;
  font-size: 1em;
}

@media (prefers-color-scheme: dark) {
  .native-input {
    color-scheme: dark;
  }
}
</style>