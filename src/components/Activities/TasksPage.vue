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
                        <v-btn text @click="startTask(selectedTask)">Iniciar</v-btn>
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
                        <v-btn text color="green" @click="approveTask(selectedTask)">Aprobar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="showRejectDialog" max-width="325">
                <v-card :loading="loaderCard">
                    <v-card-title>Confirmación</v-card-title>
                    <v-card-text>
                        Desea rechazar la tarea "{{selectedTask.nombre}}" ?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text @click="showApproveDialog=false;">Cancelar</v-btn>
                        <v-btn text color="red" @click="rejectTask(selectedTask)">Rechazar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="showReturnDialog" max-width="325">
                <v-card :loading="loaderCard">
                    <v-card-title>Confirmación</v-card-title>
                    <v-card-text>
                        Desea regresar la tarea "{{selectedTask.nombre}}" ?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text @click="showApproveDialog=false;">Cancelar</v-btn>
                        <v-btn text color="amber" @click="returnTask(selectedTask)">Regresar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="showRedirectDialog" max-width="325">
                <v-card :loading="loaderCard">
                    <v-card-title>Confirmación</v-card-title>
                    <v-card-text>
                        Desea redireccionar la tarea "{{selectedTask.nombre}}" a otro participante ?
                        <v-row class="pt-3"/>
                        <v-form ref="newUserRedirect">
                            <v-select
                            color="white"
                            item-color="orange"
                            :items="selectedTask.usuarios!=null?
                            selectedTask.usuarios.filter(item=>item.idUsuario!=$session_token.user_id):[]"
                            label="Seleccione participante"
                            item-text="nombres"
                            item-value="idUsuario"
                            :rules="[v => !!v || 'Participante es requerido']"
                            v-model="newUserRedirect"
                            solo
                            return-object
                            >
                                <template slot='item' slot-scope='{ item }'>
                                    {{ item.nombres }} {{ item.apellidos }}
                                </template>
                            </v-select>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text @click="showApproveDialog=false;">Cancelar</v-btn>
                        <v-btn text color="blue darken-1" @click="redirectTask(selectedTask)">Redireccionar</v-btn>
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
                z-index="4"
                absolute
                :value="overlayStartCondition(task)"
                >
                    <v-btn
                        outlined
                        color="white"
                        @click="showTakeitDialog=true;selectedTask=task;"
                    >
                        Iniciar
                    </v-btn>
                </v-overlay>
                <v-overlay
                z-index="4"
                absolute
                :value="overlayApproveCondition(task)"
                >
                    <v-btn
                        color="green"
                    >
                        Aprobado
                    </v-btn>
                </v-overlay>
                <v-overlay
                z-index="4"
                absolute
                :value="overlayRejectCondition(task)"
                >
                    <v-btn
                        color="red"
                    >
                        rechazado
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
                    <v-card-actions v-if="task.usuarioAccion==$session_token.user_id">
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
                                    <v-btn icon v-on="on" @click="()=>{
                                            showRejectDialog=true;
                                            selectedTask=task;
                                        }">
                                        <v-icon>warning</v-icon>
                                    </v-btn>
                                </template>
                                <span>Rechazar</span>
                            </v-tooltip>
                            <div class="pl-2"/>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="()=>{
                                            showReturnDialog=true;
                                            selectedTask=task;
                                        }">
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
                                    <v-btn icon v-on="on" @click="()=>{
                                            showRedirectDialog=true;
                                            selectedTask=task;
                                        }">
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
        <v-fab-transition >
            <v-btn
            color="white"
            dark
            fixed
            large
            bottom
            right
            fab
            v-show="isLoaded"
            @click="onRefresh()"
            >
                <v-icon v-if="!isRefreshing" color="black">refresh</v-icon>
                <v-progress-circular
                v-if="isRefreshing"
                color="black"
                indeterminate
                ></v-progress-circular>
            </v-btn>
        </v-fab-transition>
        <v-snackbar
        :color="taskSnackbar.style"
        v-model="taskSnackbar.active"
        :timeout="taskSnackbar.timeout"
        >
        {{ taskSnackbar.text }}
            <v-btn
            text
            @click="taskSnackbar.active = false"
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
        selectedTask:Object,
        showTakeitDialog:false,
        showApproveDialog:false,
        showRejectDialog:false,
        showReturnDialog:false,
        showRedirectDialog:false,
        newUserRedirect:null,
        confirmOverlay:true,
        tasksData:[],
        isLoaded:false,
        isRefreshing:false,
        loaderCard:null,
        taskSnackbar:{
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
        async onRefresh(){
            this.isRefreshing=true;
            await this.loadTasks();
            this.isRefreshing=false;
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

                        this.showSnackbar(task.nombre,"success",1);
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

                        this.showSnackbar(task.nombre,"success",2);
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
        async rejectTask(task){
            this.loaderCard="deep-orange";

            await this.$axios.put(
                this.$webServicesBaseURL+"Home/Tareas/Edit/Reject/"+task.idPlantillaPasoDetalle,
                task,
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==43){
                        console.log(response.data);
                        task.estado=response.data.data.estado;
                        task.estadoNavigation=response.data.data.estadoNavigation;

                        this.showSnackbar(task.nombre,"success",3);
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
            this.showRejectDialog=false;
        },
        async returnTask(task){
            this.loaderCard="deep-orange";

            await this.$axios.put(
                this.$webServicesBaseURL+"Home/Tareas/Edit/Return/"+task.idPlantillaPasoDetalle,
                task,
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==43){
                        console.log(response.data);
                        task.estado=response.data.data.estado;
                        task.estadoNavigation=response.data.data.estadoNavigation;
                        task.usuarioAccion=null;
                        task.usuarioAccionNavigation=null;

                        this.showSnackbar(task.nombre,"success",4);
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
            this.showReturnDialog=false;
        },
        async redirectTask(task){
            if(this.$refs.newUserRedirect.validate()){
                this.loaderCard="deep-orange";

                await this.$axios.put(
                    this.$webServicesBaseURL+"Home/Tareas/Edit/Redirect/"+task.idPlantillaPasoDetalle,
                    {
                        idPlantillaPasoDetalle:task.idPlantillaPasoDetalle,
                        idPasoinstancia:task.idPasoinstancia,
                        instanciaPlantilla:task.instanciaPlantilla,
                        nombre:task.nombre,
                        descripcion:task.descripcion,
                        fechaInicio:task.fechaInicio,
                        fechaFin:task.fechaFin,
                        estado:task.estado,
                        estadoNavigation:task.estadoNavigation,
                        usuarioAccion:this.newUserRedirect.idUsuario,
                        usuarioAccionNavigation:this.newUserRedirect,
                        usuarios:task.usuarios,
                        datos_Pasos:task.datos_Pasos
                    },
                    { withCredentials: true }
                ).then(response=>{
                    if(response.status==200){
                        if(response.data.code==43){
                            console.log(response.data);
                            task.estado=response.data.data.estado;
                            task.estadoNavigation=response.data.data.estadoNavigation;
                            task.usuarioAccion=response.data.data.usuarioAccion;
                            task.usuarioAccionNavigation=response.data.data.usuarioAccionNavigation;
                            this.$refs.newUserRedirect.reset();

                            this.showSnackbar(task.nombre,"success",5);
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
                this.showRedirectDialog=false;
            }
        },
        overlayStartCondition(task){
            return task.usuarioAccion==null;
            /*if(task.usuarioAccion!=null){
                if(task.estadoNavigation==null){
                    return true;
                }else{
                    console.log(task.estadoNavigation.nombre=="Regresado"|
                    task.estadoNavigation.nombre=="Regresar");
                    return task.estadoNavigation.nombre=="Regresado"|
                    task.estadoNavigation.nombre=="Regresar";
                }
            }*/
        },
        overlayApproveCondition(task){
            if(task.estadoNavigation!=null){
                return task.estadoNavigation.nombre=="Aprobar"|task.estadoNavigation.nombre=="Aprobado";
            }else{
                return false;
            }
        },
        overlayRejectCondition(task){
            if(task.estadoNavigation!=null){
                return task.estadoNavigation.nombre=="Rechazar"|task.estadoNavigation.nombre=="Rechazado";
            }else{
                return false;
            }
        },
        showSnackbar(text,style,indexAction){
            this.taskSnackbar.active=false;
            
            switch(indexAction){
                case 1:{
                    this.taskSnackbar.text="Tarea \""+text+"\" iniciado.";
                }break;
                case 2:{
                    this.taskSnackbar.text="Tarea \""+text+"\" aprobada.";
                }break;
                case 3:{
                    this.taskSnackbar.text="Tarea \""+text+"\" rechazada.";
                }break;
                case 4:{
                    this.taskSnackbar.text="Tarea \""+text+"\" regresada.";
                }break;
                case 5:{
                    this.taskSnackbar.text="Tarea \""+text+"\" redireccionada.";
                }break;
                default:{
                    this.taskSnackbar.text=text;
                }break;
            }
            this.taskSnackbar.active=true;
            this.taskSnackbar.style=style;
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
        
    }
}
</script>
<style scoped>

</style>