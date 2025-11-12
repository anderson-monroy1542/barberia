<template>
    <ion-page>
        <ion-header>
        <ion-toolbar>
            <ion-title>Inicio</ion-title>
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
                        
                        <th>Estado</th>
                        <th>Reseña</th>
                        
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Juan Pérez</td>
                        <td>Corte Degradado</td>
                        <td>2025-11-10</td>
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
                    
                    <tr>
                        <td>Ana Gómez</td>
                        <td>Barba Completa</td>
                        <td>2025-11-11</td>
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
                        <td>
                        
                        </td>
                    </tr>

                    <tr>
                        <td>Luis Castro</td>
                        <td>Corte Clásico</td>
                        <td>2025-11-12</td>
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

<script setup lang="ts">
    import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonBadge,
    IonButtons
    } from '@ionic/vue';
    import {
    checkmarkCircleOutline,
    addOutline,
    documentTextOutline,
    searchOutline,
    starOutline,
    createOutline,
    trashOutline
    } from 'ionicons/icons';

    const nuevaCita = () => {
    console.log('Navegar a nueva cita');
    };

    const generarReporte = () => {
    console.log('Generar reporte');
    };

</script>

<style scoped>
    /* Estilos con colores "quemados" (hardcoded).
    Ignoramos 'variables.css'.
    */

    /* Establecemos los fondos y colores principales 
    directamente en los componentes.
    */
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

    .icono-encabezado {
    font-size: 24px;
    margin-right: 10px;
    color: #38B2AC; /* Tu verde primario */
    }

    .contenedor-principal {
    padding: 16px;
    }

    /* Estilos para los controles superiores */
    .controles-superiores {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
    }







    .contenedor-busqueda {
    display: flex;
    align-items: center;
    background: #2A2A2A; /* Fondo de componente */
    border-radius: 8px;
    padding: 0 5px;
    position: relative;
    }

    .barra-busqueda-personalizada {
    --background: transparent;
    --color: #E6FFFA; /* Texto verde claro */
    --placeholder-color: #A0AEC0; /* Gris para placeholder */
    --border-radius: 8px;
    padding: 0;
    }



    .barra-busqueda-personalizada .searchbar-input-container {
    padding-left: 40px !important;
    }

    .boton-accion-busqueda {
    --background: #38B2AC; /* Verde primario */
    --border-radius: 8px;
    height: 40px;
    width: 40px;
    margin-inline-end: 5px;
    }

    /* Estilos de la tabla */
    .table-container {
    width: 100%;
    overflow-x: auto;
    background: #2A2A2A; /* Fondo de componente */
    border-radius: 8px;
    padding: 10px;
    align-items: center;
    justify-content: center;
    display: flex;
    }

    table {
    width: 100%;
    border-collapse: collapse;
    color: #E6FFFA; /* Texto verde claro */
    min-width: 600px;
    }

    thead th {
    background-color: #2A2A2A; /* Fondo de componente */
    padding: 12px 15px;
    text-align: left;
    border-bottom: 2px solid #38B2AC; /* Borde verde primario */
    font-weight: bold;
    color: #4FD1C5; /* Verde secundario */
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

    /* Estilo para los badges de estado */
    ion-badge {
    padding: 5px 10px;
    border-radius: 12px;
    font-weight: bold;
    text-transform: capitalize;
    }

    /* Colores hardcoded para los badges */
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