<template>
    <ion-page>
        <ion-header>
        <ion-toolbar>
            <ion-title>Inicio</ion-title>
            
            
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
                
                <div class="controles-superiores">
                

                <div class="contenedor-busqueda">
                    <ion-input type="date" placeholder="Buscar por fecha" class="barra-busqueda-personalizada"></ion-input>
                    
                    <ion-icon :icon="searchOutline" class="icono-busqueda"></ion-icon>
                    <ion-button color="success" class="boton-accion-busqueda">
                        <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                    </ion-button>
                </div>
                </div>

                <div class="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Servicio</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Barbero</th>
                        <th>Estado</th>
                        <th>Reseña</th>
                        
                    </tr>
                    </thead>
                    <tbody>
                    <!-- Fila Manual 1 -->
                    <tr>
                        <td>Juan Pérez</td>
                        <td>Corte Degradado</td>
                        <td>2025-11-10</td>
                        <td>10:00</td>
                        <td>Barbero Carlos</td>
                        <td>
                        <ion-badge color="success">
                            Completada
                        </ion-badge>
                        </td>
                        <td>
                        <ion-button 
                            size="small" 
                            color="warning" 
                            class="boton-resena"
                        >
                            <ion-icon :icon="starOutline" slot="start"></ion-icon>
                            Reseña
                        </ion-button>
                        </td>
                        
                    </tr>
                    
                    <!-- Fila Manual 2 -->
                    <tr>
                        <td>Ana Gómez</td>
                        <td>Barba Completa</td>
                        <td>2025-11-11</td>
                        <td>11:30</td>
                        <td>Barbero Luis</td>
                        <td>
                        <ion-badge color="warning">
                            Cancelada
                        </ion-badge>
                        </td>
                        <td>
                        <ion-button 
                            size="small" 
                            color="warning" 
                            class="boton-resena"
                        >
                            <ion-icon :icon="starOutline" slot="start"></ion-icon>
                            Reseña
                        </ion-button>
                        </td>
                    </tr>

                    <!-- Fila Manual 3 -->
                    <tr>
                        <td>Luis Castro</td>
                        <td>Corte Clásico</td>
                        <td>2025-11-12</td>
                        <td>14:00</td>
                        <td>Barbero Carlos</td>
                        <td>
                        <ion-badge color="medium">
                            Pendiente
                        </ion-badge>
                        </td>
                        <td>
                            <ion-button 
                                size="small" 
                                color="warning" 
                                class="boton-resena"
                                disabled
                            >
                            <ion-icon :icon="starOutline" slot="start"></ion-icon>
                                Reseña
                            </ion-button>
                        </td>
                    </tr>

                    </tbody>
                </table>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

    <!-- 
    SCRIPT MODIFICADO
    -->
<script setup lang="ts">
    import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    /* IonSearchbar */
    IonInput, 
    IonBadge,
    IonButtons,
    useIonRouter
    } from '@ionic/vue';
    import {
    checkmarkCircleOutline,
    addOutline,
    documentTextOutline,
    searchOutline,
    starOutline,
    createOutline,
    trashOutline,
    logOutOutline
    } from 'ionicons/icons';

    //logout
    const router = useIonRouter();

    const logout = () => {
        localStorage.removeItem('user');
        router.navigate('/login', 'back', 'replace');
    };
    // -----------------------

    const nuevaCita = () => {
        console.log('Navegar a nueva cita');
    };

    const generarReporte = () => {
        console.log('Generar reporte');
    };

</script>


<style scoped>
    
    ion-header {
    --background: #2A2A2A; /* Fondo de header */
    --color: #E6FFFA; /* Texto de header */
    }

    ion-content {
    --background: #1E1E1E; /* Fondo principal oscuro */
    --color: #E6FFFA; /* Texto principal */
    }

    ion-title {
    font-weight: bold;
    }
    
    /* Estilo para el botón de logout */
    ion-buttons[slot="end"] ion-button {
      --color: #E6FFFA; 
    }

    .icono-encabezado {
    font-size: 24px;
    margin-right: 10px;
    color: #38B2AC; 
    }

    .contenedor-principal {
    padding: 16px;
    }


    .controles-superiores {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
    }







    .contenedor-busqueda {
    display: flex;
    align-items: center;
    background: #2A2A2A; 
    border-radius: 8px;
    padding: 0 5px;
    position: relative;
    }

    .barra-busqueda-personalizada {
    --background: transparent;
    --color: #E6FFFA; 
    --placeholder-color: #A0AEC0; 
    --border-radius: 8px;
    padding: 0;
    }



    .barra-busqueda-personalizada .searchbar-input-container {
    padding-left: 40px !important;
    }

    .boton-accion-busqueda {
    --background: #38B2AC; 
    --border-radius: 8px;
    height: 40px;
    width: 40px;
    margin-inline-end: 5px;
    }

    /* Estilos de la tabla */
    .table-container {
    width: 100%;
    overflow-x: auto;
    background: #2A2A2A; 
    border-radius: 8px;
    padding: 10px;
    align-items: center;
    justify-content: center;
    display: flex;
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
    position: sticky;
    top: 0;
    z-index: 1;
    }

    tbody td {
    padding: 12px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Borde sutil */
    }

    tbody tr:last-child td {
    border-bottom: none;
    }


    ion-badge {
    padding: 5px 10px;
    border-radius: 12px;
    font-weight: bold;
    text-transform: capitalize;
    }

    ion-badge[color="success"] {
    --background: #38B2AC;
    --color: #000000;
    }
    ion-badge[color="warning"] {
    --background: #FFBF00;
    --color: #000000;
    }
    ion-badge[color="medium"] {
    --background: #A0AEC0;
    --color: #000000;
    }


    /* Botón de reseña */
    .boton-resena {
    --background: #FFBF00; /* Amarillo */
    --color: #000000; /* Texto negro */
    --border-radius: 8px;
    --box-shadow: none;
    font-weight: bold;
    }





    @media (max-width: 768px) {
    
    }
    .botones-accion {
        flex-direction: column;
        width: 100%;
    }
    .botones-accion ion-button {
        width: 100%;
    }
    .contenedor-busqueda {
        width: 100%;
    }
    
</style>