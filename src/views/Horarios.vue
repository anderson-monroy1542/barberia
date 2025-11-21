<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Horarios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <h2 class="ion-text-center">Horarios disponibles</h2>

      <ion-button
        v-if="userRole === 1 || userRole === 3"
        expand="block"
        color="warning"
        class="ion-margin-bottom"
        @click="abrirModalAgendarCliente"
      >
        AGENDAR CITA
      </ion-button>

      <ion-grid class="horarios-grid">
        <ion-row class="header-row">
          <ion-col :size="userRole === 1 ? '3' : '4'">DÍA</ion-col>
          <ion-col :size="userRole === 1 ? '3' : '4'">APERTURA</ion-col>
          <ion-col :size="userRole === 1 ? '3' : '4'">CIERRE</ion-col>
          
          <ion-col size="3" v-if="userRole === 1">ACCIÓN</ion-col>
        </ion-row>

        <ion-row
          v-for="(horario, index) in horariosSemana"
          :key="index"
          class="data-row"
        >
          <ion-col :size="userRole === 1 ? '3' : '4'">{{ horario.dia }}</ion-col>
          <ion-col :size="userRole === 1 ? '3' : '4'">{{ horario.apertura || 'Cerrado' }}</ion-col>
          <ion-col :size="userRole === 1 ? '3' : '4'">{{ horario.cierre || '-' }}</ion-col>
          
          <ion-col size="3" v-if="userRole === 1">
            <ion-button size="small" color="primary" @click="abrirModalEditarAdmin(horario)">
              Editar
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-modal :is-open="modalAgendarCliente" @did-dismiss="cerrarModalAgendarCliente">
        <ion-header>
          <ion-toolbar>
            <ion-title>Agendar nueva cita</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cerrarModalAgendarCliente">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          
          <ion-item 
              v-if="userRole === 1"
              button 
              @click="abrirBuscadorClientes" 
              :detail="true"
          >
            <ion-label position="stacked">Cliente</ion-label>
            <ion-input 
              readonly 
              :value="nombreClienteSeleccionado" 
              placeholder="Toque para buscar cliente"
            ></ion-input>
          </ion-item>
          
          <div v-if="userRole === 3" class="ion-padding-bottom ion-text-center">
            <ion-label color="medium">Agendando cita para ti: <strong>{{ nombreUsuarioActual }}</strong></ion-label>
          </div>

          <ion-item>
            <ion-label position="stacked">Barbero</ion-label>
            <ion-select v-model="nuevaCita.barbero" placeholder="Selecciona">
              <ion-select-option v-for="b in barberos" :key="b.Id_usuario" :value="b.Id_usuario">
                {{ b.Nombre }} {{ b.Apellido }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Servicio</ion-label>
            <ion-select v-model="nuevaCita.servicio" placeholder="Selecciona">
              <ion-select-option v-for="s in servicios" :key="s.Id_servicio" :value="s.Id_servicio">
                {{ s.Servicio }} (${{ s.Precio }})
              </ion-select-option>
            </ion-select>
          </ion-item>
          
          <ion-item>
              <ion-label position="stacked">Fecha</ion-label>
              <input type="date" v-model="nuevaCita.fecha" @change="onFechaChange" class="native-input" />
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Día</ion-label>
            <ion-input v-model="nuevaCita.dia" readonly></ion-input>
          </ion-item>
          <ion-item>
              <ion-label position="stacked">Hora</ion-label>
              <input type="time" v-model="nuevaCita.hora" :step="1800" class="native-input" />
          </ion-item>

          <ion-button expand="block" color="success" @click="confirmarCitaCliente" class="ion-margin-top">
            Confirmar cita
          </ion-button>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="modalEditarAdmin" @did-dismiss="cerrarModalEditarAdmin">
        <ion-header>
          <ion-toolbar>
            <ion-title>Editar Horario</ion-title>
              <ion-buttons slot="end">
              <ion-button @click="cerrarModalEditarAdmin">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <h3 class="ion-text-center">{{ horarioParaEditar.dia }}</h3>
          <ion-item>
            <ion-label position="stacked">Apertura</ion-label>
            <input type="time" v-model="horarioParaEditar.apertura" class="native-input" />
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Cierre</ion-label>
            <input type="time" v-model="horarioParaEditar.cierre" class="native-input" />
          </ion-item>
          <ion-button expand="block" color="success" @click="guardarCambiosHorario" class="ion-margin-top">
            Guardar Cambios
          </ion-button>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="mostrarBuscadorClientes" @did-dismiss="cerrarBuscadorClientes">
        <ion-header>
          <ion-toolbar>
            <ion-title>Seleccionar Cliente</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cerrarBuscadorClientes">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
          <ion-toolbar>
            <ion-searchbar 
              placeholder="Buscar por nombre..." 
              @ionInput="filtrarClientes($event)"
              :debounce="300"
            ></ion-searchbar>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item 
              button 
              v-for="cliente in listaClientesFiltrada" 
              :key="cliente.Id_usuario" 
              @click="seleccionarClienteDeLista(cliente)"
            >
              <ion-label>
                <h2>{{ cliente.Nombre }} {{ cliente.Apellido }}</h2>
              </ion-label>
            </ion-item>
              <ion-item v-if="listaClientesFiltrada.length === 0" lines="none">
                <ion-label class="ion-text-center" color="medium">No se encontraron clientes</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonGrid, IonRow, IonCol, IonModal,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButtons, alertController, IonSearchbar, IonList
} from '@ionic/vue';

export default defineComponent({
  name: 'HorariosBasico',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonGrid, IonRow, IonCol, IonModal,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButtons, IonSearchbar, IonList
  },
  setup() {
    
    const userRole = ref(0);//id del rol
    const currentUserId = ref(0);//ID usuario
    const nombreUsuarioActual = ref('');
    //guarda el usre
    const usuarioActual = ref<any>(null); 

    const baseURL = 'http://localhost:3000';

    //datos
    const horariosSemana = ref<any[]>([]);
    const barberos = ref<any[]>([]);
    const clientes = ref<any[]>([]);
    const servicios = ref<any[]>([]);

    const fechaMinima = computed(() => {
        const hoy = new Date();
        const manana = new Date(hoy);
        manana.setDate(hoy.getDate() + 1); //fecha de ahora +1

        return manana.toISOString().split('T')[0];
    });

    onMounted(() => {
        //user del local storage
        const datosGuardados = localStorage.getItem('user');
        
        if (datosGuardados) {
            try {
                usuarioActual.value = JSON.parse(datosGuardados);
                
                userRole.value = usuarioActual.value.Id_rol;
                currentUserId.value = usuarioActual.value.Id_usuario;
                nombreUsuarioActual.value = usuarioActual.value.Nombre;

                console.log("Usuario detectado:", usuarioActual.value.Nombre, "Rol:", userRole.value);
            } catch (e) {
                console.error("Error al leer datos del usuario:", e);
            }
        } else {
            console.log("No hay usuario logueado en localStorage");
        }

        //desde la api
        cargarHorarios();   
        cargarBarberos();   
        cargarServicios();  
        
        if (userRole.value === 1) {
            cargarClientes();
        }
    });
    //funcion admin buscar clientes
    const mostrarBuscadorClientes = ref(false);
    const textoBusqueda = ref('');
    const clienteObjSeleccionado = ref<any>(null);

    const nombreClienteSeleccionado = computed(() => {
        if (clienteObjSeleccionado.value) {
            return `${clienteObjSeleccionado.value.Nombre} ${clienteObjSeleccionado.value.Apellido}`;
        }
        return '';
    });

    const listaClientesFiltrada = computed(() => {
        if (!textoBusqueda.value) return clientes.value; 
        const texto = textoBusqueda.value.toLowerCase();
        return clientes.value.filter((c: any) => {
            const nombreCompleto = `${c.Nombre} ${c.Apellido}`.toLowerCase();
            return nombreCompleto.includes(texto);
        });
    });

    const abrirBuscadorClientes = () => { mostrarBuscadorClientes.value = true; textoBusqueda.value = ''; };
    const cerrarBuscadorClientes = () => { mostrarBuscadorClientes.value = false; };
    const filtrarClientes = (event: any) => { textoBusqueda.value = event.target.value; };
    const seleccionarClienteDeLista = (cliente: any) => {
        nuevaCita.value.cliente = cliente.Id_usuario;
        clienteObjSeleccionado.value = cliente;
        cerrarBuscadorClientes();
    };

    const cargarHorarios = async () => {
      try {
        const response = await fetch(`${baseURL}/horariodias/get/all`);
        if (!response.ok) throw new Error('Error al cargar horarios');
        horariosSemana.value = (await response.json()).map((h: any) => ({
          id: h.Id_HorarioDia, dia: h.Dia, apertura: h.inicio, cierre: h.fin
        }));
      } catch (error) { console.error(error); }
    };
    const cargarBarberos = async () => {
        try { const res = await fetch(`${baseURL}/usuarios/barberos`); barberos.value = await res.json(); } catch(e) { console.error(e); }
    };
    const cargarClientes = async () => {
        try { const res = await fetch(`${baseURL}/usuarios/clientes`); clientes.value = await res.json(); } catch(e) { console.error(e); }
    };
    const cargarServicios = async () => {
        try { const res = await fetch(`${baseURL}/servicios/get/all`); servicios.value = await res.json(); } catch(e) { console.error(e); }
    };

    const modalAgendarCliente = ref(false);
    const nuevaCita = ref({
      cliente: null, barbero: null, servicio: null,
      fecha: '', dia: '', hora: ''
    });

    const abrirModalAgendarCliente = () => { modalAgendarCliente.value = true; };
    const cerrarModalAgendarCliente = () => {
      modalAgendarCliente.value = false;
      nuevaCita.value = { cliente: null, barbero: null, servicio: null, fecha: '', dia: '', hora: '' };
      clienteObjSeleccionado.value = null;
    };

    const mostrarAlerta = async (header: string, message: string) => {
      const alert = await alertController.create({ header, message, buttons: ['OK'] });
      await alert.present();
    };

    const confirmarCitaCliente = async () => {
      let idClienteFinal;

      if (userRole.value === 1) {
          idClienteFinal = nuevaCita.value.cliente;
      } else {
          idClienteFinal = currentUserId.value;
      }

      if (!nuevaCita.value.fecha || !nuevaCita.value.hora || !nuevaCita.value.barbero || !nuevaCita.value.servicio) {
          await mostrarAlerta('Faltan datos', 'Completa fecha, hora, barbero y servicio.');
          return;
      }
      if (userRole.value === 1 && !idClienteFinal) {
          await mostrarAlerta('Falta cliente', 'Debes seleccionar un cliente.');
          return;
      }

      const bodyParaAPI = {
          Fecha: nuevaCita.value.fecha,
          Dia: nuevaCita.value.dia,
          Hora: nuevaCita.value.hora,
          Id_Barbero: nuevaCita.value.barbero,
          Id_servicio: nuevaCita.value.servicio,
          Id_usuario: idClienteFinal
      };

      try {
        const response = await fetch(`${baseURL}/citas/add`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyParaAPI),
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Error al guardar');
        }
        const data = await response.json();
        await mostrarAlerta('Éxito', 'Cita agendada correctamente.');
        cerrarModalAgendarCliente();
      } catch (error: any) {
          await mostrarAlerta('No se pudo agendar', error.message); 
      }
    };

    const onFechaChange = () => {
      const val = nuevaCita.value.fecha;
      if (val) nuevaCita.value.dia = deriveDayNameFromDate(val);
      else nuevaCita.value.dia = '';
    };
    function deriveDayNameFromDate(isoDateString: string): string {
      try {
        const dateOnly = isoDateString.split('T')[0];
        const d = new Date(dateOnly + 'T12:00:00'); 
        const weekday = d.toLocaleDateString('es-ES', { weekday: 'long' });
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
      } catch (e) { return ''; }
    }

    const modalEditarAdmin = ref(false);
    const horarioParaEditar = ref<any>({}); 
    const abrirModalEditarAdmin = (horario: any) => {
      horarioParaEditar.value = { ...horario }; 
      modalEditarAdmin.value = true;
    };
    const cerrarModalEditarAdmin = () => { modalEditarAdmin.value = false; };
    const guardarCambiosHorario = async () => {
      try {
        const bodyParaAPI = {
          Id_HorarioDia: horarioParaEditar.value.id,
          inicio: horarioParaEditar.value.apertura,
          fin: horarioParaEditar.value.cierre
        };
        await fetch(`${baseURL}/horariodias/update`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyParaAPI),
        });
        const index = horariosSemana.value.findIndex((h) => h.id === horarioParaEditar.value.id);
        if (index !== -1) horariosSemana.value[index] = { ...horarioParaEditar.value };
        cerrarModalEditarAdmin();
      } catch (error) { console.error(error); }
    };

    return {
      userRole, currentUserId, nombreUsuarioActual,
      horariosSemana, barberos, clientes, servicios, 
      modalEditarAdmin, horarioParaEditar, abrirModalEditarAdmin, cerrarModalEditarAdmin, guardarCambiosHorario,
      modalAgendarCliente, nuevaCita, abrirModalAgendarCliente, cerrarModalAgendarCliente, confirmarCitaCliente, 
      onFechaChange,
      mostrarBuscadorClientes, abrirBuscadorClientes, cerrarBuscadorClientes, filtrarClientes, listaClientesFiltrada, seleccionarClienteDeLista, nombreClienteSeleccionado,fechaMinima
    };
  }
});
</script>

<style scoped>
  .native-input {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    background: transparent;
    color: inherit;
    border: none;
    font-size: 1em;
  }

  .horarios-grid {
    border-radius: 8px;
    overflow: hidden;
    margin-top: 15px;
    background-color: var(--ion-item-background, #1e1e1e);
  }

  .header-row {
    background-color: #3880ff;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9em;
    padding: 10px 0;
  }

  .header-row ion-col {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .data-row {
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
    display: flex;
    align-items: center;
    padding: 8px 0;
  }

  .data-row ion-col {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    .native-input {
      color-scheme: dark;
    }
  }
</style>