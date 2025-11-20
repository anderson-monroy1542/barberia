<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Mis Citas</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="logout()">
                        <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
                        Cerrar Sesión
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="contenedor-principal">
                <!-- Filtro por fecha -->
                <div class="controles-superiores">
                    <div class="contenedor-busqueda">
                        <ion-input 
                            v-model="fechaBusqueda" 
                            type="date" 
                            placeholder="Buscar por fecha"
                            class="barra-busqueda-personalizada"
                        ></ion-input>
                        <ion-icon :icon="searchOutline" class="icono-busqueda"></ion-icon>
                        <ion-button color="success" class="boton-accion-busqueda" @click="filtrarPorFecha">
                            <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                        </ion-button>
                        <ion-button color="medium" class="boton-accion-busqueda" @click="limpiarFiltro">
                            <ion-icon :icon="closeOutline"></ion-icon>
                        </ion-button>
                    </div>
                </div>

                <!-- Tabla de citas -->
                <div class="table-container" v-if="!loading && citasFiltradas.length > 0">
                    <table>
                        <thead>
                            <tr>
                                <th>Servicio</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Barbero</th>
                                <th>Estado</th>
                                <th>Reseña</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cita in citasFiltradas" :key="cita.Id_cita">
                                <td>{{ cita.Servicio }}</td>
                                <td>{{ formatearFecha(cita.Fecha) }}</td>
                                <td>{{ cita.Hora }}</td>
                                <td>{{ cita.BarberoNombre }}</td>
                                <td>
                                    <ion-badge :color="getColorEstado(cita.EstadoC)">
                                        {{ cita.EstadoC }}
                                    </ion-badge>
                                </td>
                                <td>
                                    <!-- Botón de reseña para citas completadas -->
                                    <ion-button 
                                        v-if="cita.tieneResena"
                                        size="small" 
                                        color="success" 
                                        class="boton-resena"
                                        disabled
                                    >
                                        <ion-icon :icon="checkmarkCircleOutline" slot="start"></ion-icon>
                                        Reseña enviada
                                    </ion-button>
                                    <ion-button 
                                        v-else-if="cita.EstadoC === 'Completada'"
                                        size="small" 
                                        color="warning" 
                                        class="boton-resena"
                                        @click="abrirModalResena(cita)"
                                    >
                                        <ion-icon :icon="starOutline" slot="start"></ion-icon>
                                        Dejar Reseña
                                    </ion-button>
                                    
                                    <!-- Botón de cancelar para citas pendientes -->
                                    <ion-button 
                                        v-else-if="cita.EstadoC === 'Pendiente'"
                                        size="small" 
                                        color="danger" 
                                        class="boton-cancelar"
                                        @click="confirmarCancelacion(cita)"
                                    >
                                        <ion-icon :icon="closeCircleOutline" slot="start"></ion-icon>
                                        Cancelar Cita
                                    </ion-button>
                                    
                                    <ion-button 
                                        v-else
                                        size="small" 
                                        color="medium" 
                                        class="boton-resena"
                                        disabled
                                    >
                                        <ion-icon :icon="starOutline" slot="start"></ion-icon>
                                        No disponible
                                    </ion-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Estado de carga -->
                <div v-if="loading" class="estado-vacio">
                    <ion-spinner></ion-spinner>
                    <p>Cargando tus citas...</p>
                </div>

                <!-- Sin citas -->
                <div v-if="!loading && citasFiltradas.length === 0" class="estado-vacio">
                    <ion-icon :icon="calendarOutline" class="icono-vacio"></ion-icon>
                    <p>No tienes citas {{ fechaBusqueda ? 'en esta fecha' : 'registradas' }}</p>
                </div>
            </div>

            <!-- Modal de Reseña -->
            <ion-modal :is-open="mostrarModal">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Dejar Reseña</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="cerrarModal">Cerrar</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>

                <ion-content class="ion-padding">
                    <div v-if="citaSeleccionada" class="modal-content">
                        <!-- Información de la cita -->
                        <div class="info-cita">
                            <h3>{{ citaSeleccionada.Servicio }}</h3>
                            <p><strong>Fecha:</strong> {{ formatearFecha(citaSeleccionada.Fecha) }}</p>
                            <p><strong>Barbero:</strong> {{ citaSeleccionada.BarberoNombre }}</p>
                            <p><strong>Precio:</strong> ${{ citaSeleccionada.Precio }}</p>
                        </div>

                        <!-- Calificación con estrellas -->
                        <div class="seccion-calificacion">
                            <ion-label>
                                <h2>Calificación</h2>
                                <p>¿Qué te pareció el servicio?</p>
                            </ion-label>
                            <div class="estrellas-container">
                                <ion-icon 
                                    v-for="n in 5" 
                                    :key="n"
                                    :icon="n <= calificacion ? star : starOutline"
                                    :class="['estrella', { 'estrella-activa': n <= calificacion }]"
                                    @click="seleccionarCalificacion(n)"
                                ></ion-icon>
                            </div>
                            <p class="texto-calificacion">{{ getTextoCalificacion() }}</p>
                        </div>

                        <!-- Comentario -->
                        <ion-item>
                            <ion-label position="stacked">
                                <h2>Comentario</h2>
                                <p>Cuéntanos tu experiencia (opcional)</p>
                            </ion-label>
                            <ion-textarea
                                v-model="comentario"
                                placeholder="Escribe tu opinión sobre el servicio..."
                                :rows="4"
                                :maxlength="230"
                                class="textarea-comentario"
                            ></ion-textarea>
                        </ion-item>
                        <p class="contador-caracteres">{{ comentario.length }}/230 caracteres</p>

                        <!-- Botón enviar -->
                        <ion-button 
                            expand="block" 
                            color="warning" 
                            @click="enviarResena"
                            :disabled="calificacion === 0 || enviando"
                        >
                            <ion-icon :icon="sendOutline" slot="start"></ion-icon>
                            {{ enviando ? 'Enviando...' : 'Enviar Reseña' }}
                        </ion-button>
                    </div>
                </ion-content>
            </ion-modal>

            <!-- Modal de Confirmación de Cancelación -->
            <ion-modal :is-open="mostrarModalCancelar">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Confirmar Cancelación</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="cerrarModalCancelar">Cerrar</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>

                <ion-content class="ion-padding">
                    <div v-if="citaACancelar" class="modal-content">
                        <div class="alerta-cancelacion">
                            <ion-icon :icon="warningOutline" class="icono-alerta"></ion-icon>
                            <h2>¿Estás seguro?</h2>
                            <p>Esta acción no se puede deshacer</p>
                        </div>

                        <div class="info-cita">
                            <h3>{{ citaACancelar.Servicio }}</h3>
                            <p><strong>Fecha:</strong> {{ formatearFecha(citaACancelar.Fecha) }}</p>
                            <p><strong>Hora:</strong> {{ citaACancelar.Hora }}</p>
                            <p><strong>Barbero:</strong> {{ citaACancelar.BarberoNombre }}</p>
                        </div>

                        <ion-button 
                            expand="block" 
                            color="danger" 
                            @click="cancelarCita"
                            :disabled="cancelando"
                        >
                            <ion-icon :icon="closeCircleOutline" slot="start"></ion-icon>
                            {{ cancelando ? 'Cancelando...' : 'Sí, Cancelar Cita' }}
                        </ion-button>

                        <ion-button 
                            expand="block" 
                            fill="outline" 
                            @click="cerrarModalCancelar"
                        >
                            Volver
                        </ion-button>
                    </div>
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonBadge,
    IonButtons,
    IonModal,
    IonItem,
    IonLabel,
    IonTextarea,
    IonSpinner,
    useIonRouter,
    toastController
} from '@ionic/vue';
import {
    checkmarkCircleOutline,
    searchOutline,
    starOutline,
    star,
    logOutOutline,
    calendarOutline,
    sendOutline,
    closeOutline,
    closeCircleOutline,
    warningOutline
} from 'ionicons/icons';
import axios from 'axios';

// Configuración
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const router = useIonRouter();

// Estado
const citas = ref<any[]>([]);
const loading = ref(false);
const fechaBusqueda = ref('');
const mostrarModal = ref(false);
const mostrarModalCancelar = ref(false);
const citaSeleccionada = ref<any>(null);
const citaACancelar = ref<any>(null);
const calificacion = ref(0);
const comentario = ref('');
const enviando = ref(false);
const cancelando = ref(false);

// Computed
const citasFiltradas = computed(() => {
    if (!fechaBusqueda.value) {
        return citas.value;
    }
    return citas.value.filter(cita => {
        const fechaCita = new Date(cita.Fecha).toISOString().split('T')[0];
        return fechaCita === fechaBusqueda.value;
    });
});

// Funciones
async function cargarCitas() {
    loading.value = true;
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.navigate('/login', 'back', 'replace');
            return;
        }

        const user = JSON.parse(userStr);
        const response = await axios.get(`${API_URL}/citas/get/usuario/${user.Id_usuario}`);
        
        // Verificar qué citas tienen reseña
        const citasConReseñas = await Promise.all(
            response.data.map(async (cita: any) => {
                try {
                    const resenasResponse = await axios.get(`${API_URL}/resenas/get/all`);
                    const tieneResena = resenasResponse.data.some((r: any) => r.Id_cita === cita.Id_cita);
                    return { ...cita, tieneResena };
                } catch {
                    return { ...cita, tieneResena: false };
                }
            })
        );
        
        citas.value = citasConReseñas;
    } catch (error: any) {
        console.error('Error al cargar citas:', error);
        mostrarToast('Error al cargar las citas', 'danger');
    } finally {
        loading.value = false;
    }
}

function filtrarPorFecha() {
    if (!fechaBusqueda.value) {
        mostrarToast('Selecciona una fecha', 'warning');
    }
}

function limpiarFiltro() {
    fechaBusqueda.value = '';
}

function abrirModalResena(cita: any) {
    citaSeleccionada.value = cita;
    calificacion.value = 0;
    comentario.value = '';
    mostrarModal.value = true;
}

function cerrarModal() {
    mostrarModal.value = false;
    citaSeleccionada.value = null;
    calificacion.value = 0;
    comentario.value = '';
}

function confirmarCancelacion(cita: any) {
    citaACancelar.value = cita;
    mostrarModalCancelar.value = true;
}

function cerrarModalCancelar() {
    mostrarModalCancelar.value = false;
    citaACancelar.value = null;
}

async function cancelarCita() {
    if (!citaACancelar.value) return;

    cancelando.value = true;
    try {
        // Actualizar el estado de la cita a "Cancelada" (Id_estadoC = 3)
        const citaActualizada = {
            Id_cita: citaACancelar.value.Id_cita,
            Fecha: citaACancelar.value.Fecha,
            Dia: citaACancelar.value.Dia,
            Hora: citaACancelar.value.Hora,
            Id_Barbero: citaACancelar.value.Id_Barbero,
            Id_servicio: citaACancelar.value.Id_servicio,
            Id_estadoC: 3, // 3 = Cancelada
            Id_usuario: citaACancelar.value.Id_cliente // ← CORRECCIÓN AQUÍ
        };

        console.log('Enviando datos:', citaActualizada); // Debug

        await axios.put(`${API_URL}/citas/update`, citaActualizada);
        
        mostrarToast('Cita cancelada correctamente', 'success');
        cerrarModalCancelar();
        cargarCitas(); // Recargar las citas
    } catch (error: any) {
        console.error('Error completo:', error.response || error);
        mostrarToast('Error al cancelar la cita', 'danger');
    } finally {
        cancelando.value = false;
    }
}

function seleccionarCalificacion(n: number) {
    calificacion.value = n;
}

function getTextoCalificacion() {
    const textos = [
        '',
        'Muy malo',
        'Malo',
        'Regular',
        'Bueno',
        'Excelente'
    ];
    return textos[calificacion.value];
}

async function enviarResena() {
    if (calificacion.value === 0) {
        mostrarToast('Selecciona una calificación', 'warning');
        return;
    }

    enviando.value = true;
    try {
        const resena = {
            Comentario: comentario.value || 'Sin comentario',
            Puntuacion: calificacion.value,
            Id_cita: citaSeleccionada.value.Id_cita
        };

        await axios.post(`${API_URL}/resenas/add`, resena);
        
        mostrarToast('¡Reseña enviada con éxito!', 'success');
        cerrarModal();
        cargarCitas(); // Recargar para actualizar el estado
    } catch (error: any) {
        console.error('Error al enviar reseña:', error);
        mostrarToast('Error al enviar la reseña', 'danger');
    } finally {
        enviando.value = false;
    }
}

function formatearFecha(fecha: string) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getColorEstado(estado: string) {
    const colores: any = {
        'Completada': 'success',
        'Pendiente': 'warning',
        'Cancelada': 'danger'
    };
    return colores[estado] || 'medium';
}

async function mostrarToast(message: string, color: string = 'primary') {
    const toast = await toastController.create({
        message,
        duration: 2000,
        color,
        position: 'top'
    });
    await toast.present();
}

const logout = () => {
    localStorage.removeItem('user');
    router.navigate('/login', 'back', 'replace');
};

// Lifecycle
onMounted(() => {
    cargarCitas();
});
</script>

<style scoped>
ion-header {
    --background: #2A2A2A;
    --color: #E6FFFA;
}

ion-content {
    --background: #1E1E1E;
    --color: #E6FFFA;
}

.contenedor-principal {
    padding: 16px;
}

.controles-superiores {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

.contenedor-busqueda {
    display: flex;
    align-items: center;
    background: #2A2A2A;
    border-radius: 8px;
    padding: 0 5px;
    gap: 8px;
    flex: 1;
}

.barra-busqueda-personalizada {
    --background: transparent;
    --color: #E6FFFA;
    --placeholder-color: #A0AEC0;
    flex: 1;
}

.boton-accion-busqueda {
    --border-radius: 8px;
    height: 40px;
    min-width: 40px;
}

.table-container {
    width: 100%;
    overflow-x: auto;
    background: #2A2A2A;
    border-radius: 8px;
    padding: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    color: #E6FFFA;
    min-width: 600px;
}

thead th {
    background-color: #2A2A2A;
    padding: 12px 15px;
    text-align: left;
    border-bottom: 2px solid #38B2AC;
    font-weight: bold;
    color: #4FD1C5;
}

tbody td {
    padding: 12px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

tbody tr:last-child td {
    border-bottom: none;
}

.boton-resena {
    --border-radius: 8px;
    font-weight: bold;
}

.boton-cancelar {
    --border-radius: 8px;
    font-weight: bold;
    --background: #E53E3E;
}

.estado-vacio {
    text-align: center;
    padding: 60px 20px;
    color: #A0AEC0;
}

.icono-vacio {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
}

/* Modal */
.modal-content {
    padding: 16px;
}

.info-cita {
    background: #2A2A2A;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.info-cita h3 {
    margin: 0 0 12px 0;
    color: #4FD1C5;
}

.info-cita p {
    margin: 8px 0;
}

.seccion-calificacion {
    margin: 20px 0;
    text-align: center;
}

.estrellas-container {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 16px 0;
}

.estrella {
    font-size: 48px;
    color: #A0AEC0;
    cursor: pointer;
    transition: all 0.2s;
}

.estrella-activa {
    color: #FFD700;
    transform: scale(1.1);
}

.texto-calificacion {
    font-size: 18px;
    font-weight: bold;
    color: #4FD1C5;
    margin-top: 8px;
}

.textarea-comentario {
    --background: #2A2A2A;
    --color: #E6FFFA;
    --padding-start: 12px;
    --padding-top: 12px;
    border-radius: 8px;
    margin-top: 8px;
}

.contador-caracteres {
    text-align: right;
    font-size: 12px;
    color: #A0AEC0;
    margin-top: 4px;
}

.alerta-cancelacion {
    text-align: center;
    padding: 24px;
    background: rgba(229, 62, 62, 0.1);
    border-radius: 8px;
    margin-bottom: 20px;
}

.icono-alerta {
    font-size: 64px;
    color: #E53E3E;
    margin-bottom: 12px;
}

.alerta-cancelacion h2 {
    margin: 12px 0 8px 0;
    color: #E53E3E;
}

.alerta-cancelacion p {
    color: #A0AEC0;
    margin: 0;
}

@media (max-width: 768px) {
    .table-container {
        padding: 5px;
    }
    
    table {
        font-size: 14px;
    }
    
    thead th,
    tbody td {
        padding: 8px 10px;
    }
}
</style>