<template>
    <v-app>
        <v-row v-if="!isLoaded" align="center">
            <v-col align="center">
                <v-progress-circular
                :size="70"
                :width="7"
                color="deep-orange"
                indeterminate
                ></v-progress-circular>
            </v-col>
        </v-row>
        <v-row v-if="isLoaded" class="ma-0">
            <v-dialog v-model="showTakeitDialog" max-width="325">
                <v-card :loading="loaderCard">
                    <v-card-title>Confirmación</v-card-title>
                    <v-card-text>
                        Desea iniciar la tarea "{{selectedTask.nombre}}" y ser el actual responsable de la tarea ?
                        <br>
                        <br>
                        <div class="subtitle-1 text--primary">
                            Nota
                        </div>
                        Despues de aceptar puede redireccionar la tarea a cualquiera de 
                        los otros participantes de la tarea.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text @click="showTakeitDialog=false;">Cancelar</v-btn>
                        <v-btn text @click="startTask(selectedTask)">Aceptar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="showApproveDialog" max-width="325">
                <v-card :loading="loaderCard">
                    <v-card-title>Confirmación</v-card-title>
                    <v-card-text>
                        Desea aprobar la tarea "{{selectedTask.nombre}}" ?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text @click="showApproveDialog=false;">Cancelar</v-btn>
                        <v-btn text @click="approveTask(selectedTask)">Aceptar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <ParticipantsDialog v-model="showParticipantsDialog" v-bind:step="selectedTask" from="tarea"></ParticipantsDialog>
            <TaskDatosDialog v-model="showTaskDatosDialog" v-bind:task="selectedTask"></TaskDatosDialog>
            <v-col 
                v-for="task in tasksData"
                :key="task.idPlantillaPasoDetall" xs="12"
                sm="6" md="4" lg="3" xl="2" cols="12">
                <v-card          
                max-width="400"
                class="mx-auto"
                hover
                >
                <v-overlay
                absolute
                :value="task.usuarioAccion==null"
                >
                    <v-btn
                        color="teal lighten-1"
                        @click="showTakeitDialog=true;selectedTask=task;"
                    >
                        Iniciar
                    </v-btn>
                </v-overlay>
                <v-overlay
                absolute
                :value="overlayApproveCondition(task)"
                >
                    <v-btn
                        color="green"
                    >
                        Aprobado
                    </v-btn>
                </v-overlay>
                <v-row class="ma-0">
                    <v-card-title>{{task.nombre}}</v-card-title>
                </v-row>
                    <v-card-text>
                        <div class="subtitle-1 text--primary">Descripción</div>
                        {{task.descripcion}}
                    </v-card-text>
                    <v-list-item>
                        <v-list-item-icon>
                        <v-btn icon @click="()=>{
                                showParticipantsDialog=true;
                                selectedTask=task;
                            }">
                            <v-icon>linear_scale</v-icon>
                        </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Participantes</v-list-item-title>
                            <v-list-item-subtitle>{{task.usuarios.length}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                        <v-btn icon @click="()=>{
                                showTaskDatosDialog=true;
                                selectedTask=task;
                            }">
                            <v-icon>list</v-icon>
                        </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Cant. de datos</v-list-item-title>
                            <v-list-item-subtitle>{{task.datos_Pasos.length}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions v-if="task.usuarioAccion==session_claims.user_id">
                        <v-layout row class="ma-0">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="()=>{
                                            showApproveDialog=true;
                                            selectedTask=task;
                                        }">
                                        <v-icon>check</v-icon>
                                    </v-btn>
                                </template>
                                <span>Aprobar</span>
                            </v-tooltip>
                            <div class="pl-2"/>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on">
                                        <v-icon>warning</v-icon>
                                    </v-btn>
                                </template>
                                <span>Rechazar</span>
                            </v-tooltip>
                            <div class="pl-2"/>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on">
                                        <v-icon>
                                            keyboard_return
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>Regresar</span>
                            </v-tooltip>
                            <div class="pl-2"/>
                            <v-tooltip bottom v-if="task.usuarios.length>1">
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on">
                                        <v-icon>
                                            swap_horiz
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>Redireccionar</span>
                            </v-tooltip>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-snackbar
        :color="processSnackbar.style"
        v-model="processSnackbar.active"
        :timeout="processSnackbar.timeout"
        >
        {{ processSnackbar.text }}
            <v-btn
            text
            @click="processSnackbar.active = false"
            >
            Cerrar
            </v-btn>
        </v-snackbar>
    </v-app>
</template>
<script>
import ParticipantsDialog from './ParticipantsDialog'
import TaskDatosDialog from './TaskDatosDialog'
export default {
    data:()=>({
        showParticipantsDialog:false,
        showTaskDatosDialog:false,
        session_claims:Object,
        selectedTask:Object,
        showTakeitDialog:false,
        showApproveDialog:false,
        confirmOverlay:true,
        tasksData:[],
        isLoaded:false,
        loaderCard:null,
        processSnackbar:{
            text:String,
            active:false,
            style:String,
            timeout:6000
        }
    }),
    components:{
        ParticipantsDialog,
        TaskDatosDialog
    },
    methods:{
        async loadTasks(){
            await this.$axios.get(
                this.$webServicesBaseURL+"Home/Tareas",
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==41){
                        this.tasksData=response.data.data;
                    }
                }
            });
        },
        async startTask(task){
            this.loaderCard="deep-orange";

            await this.$axios.put(
                this.$webServicesBaseURL+"Home/Tareas/Edit/Start/"+task.idPlantillaPasoDetalle,
                task,
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==43){
                        task.usuarioAccion=response.data.data.usuarioAccion;
                        task.usuarioAccionNavigation=response.data.data.usuarioAccionNavigation;
                    }
                }
            }).catch(error=>{
                if(error.response!=null){
                    if(error.response.status==404){
                        if(error.response.data!=null){
                            this.showSnackbar(error.response.data.message,"error",1000);
                        }else{
                            this.showSnackbar(error,"error",1000);
                        }
                    }else{
                        this.showSnackbar(error,"error",1000)
                    }
                }else{
                    this.showSnackbar(error,"error",1000);
                }
            });

            this.loaderCard=false;
            this.showTakeitDialog=false;
        },
        async approveTask(task){
            this.loaderCard="deep-orange";

            await this.$axios.put(
                this.$webServicesBaseURL+"Home/Tareas/Edit/Approve/"+task.idPlantillaPasoDetalle,
                task,
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==43){
                        console.log(response.data);
                        task.estado=response.data.data.estado;
                        task.estadoNavigation=response.data.data.estadoNavigation;
                    }
                }
            }).catch(error=>{
                if(error.response!=null){
                    if(error.response.status==404){
                        if(error.response.data!=null){
                            this.showSnackbar(error.response.data.message,"error",1000);
                        }else{
                            this.showSnackbar(error,"error",1000);
                        }
                    }else{
                        this.showSnackbar(error,"error",1000)
                    }
                }else{
                    this.showSnackbar(error,"error",1000);
                }
            });

            this.loaderCard=false;
            this.showApproveDialog=false;
        },
        overlayApproveCondition(task){
            if(task.estadoNavigation!=null){
                return task.estadoNavigation.nombre=="Aprobar"|task.estadoNavigation.nombre=="Aprobado";
            }else{
                return false;
            }
        },
        showSnackbar(text,style,indexAction){
            this.processSnackbar.active=false;
            
            switch(indexAction){
                case 1:{
                    this.processSnackbar.text="Proceso \""+text+"\" iniciado.";
                }break;
                case 2:{
                    this.processSnackbar.text="Proceso \""+text+"\" eliminado.";
                }break;
                /*case 3:{
                    this.templatesSnackbar.text="Proceso \""+text+"\" actualizada.";
                }break;*/
                default:{
                    this.processSnackbar.text=text;
                }break;
            }

            this.processSnackbar.active=true;
            this.processSnackbar.style=style;
        },
        async initializeAll(){
            await this.loadTasks();
            this.isLoaded=true;
        }
    },
    created(){
        this.initializeAll();
    },
    mounted(){
        this.session_claims=JSON.parse(atob(this.$cookies.get("session_token").split('.')[1]));
    }
}
</script>
<style scoped>

</style>