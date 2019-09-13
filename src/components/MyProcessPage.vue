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
            <v-dialog
            scrollable
            v-model="dialog"
            max-width="450"
            :persistent="true"
            >
                <v-card :loading="loaderCard" class="hola">
                    <v-card-title class="headline">Inicio de proceso</v-card-title>
                    <v-card-text>
                        <div class="title text--primary">Información de proceso</div>
                        <v-row class="pa-1"></v-row>
                        <v-row>
                            <v-col>
                                <div class="subtitle-1 text--primary">Nombre proceso</div>
                                {{selectedTemplateInstance.nombre}}
                            </v-col>
                            <v-col>
                                <div class="subtitle-1 text--primary">Descripción</div>
                                {{selectedTemplateInstance.descripcion}}
                            </v-col>
                        </v-row>
                        <v-form
                        ref="processInstanceForm"
                        >
                            <v-divider></v-divider>
                            <div class="title text--primary">Campos de información</div>
                            <v-row class="pa-1"></v-row>
                            <v-list>
                                <v-list-item 
                                v-for="campo in selectedTemplateInstance.datos"
                                :key="campo.idInstanciaPlantillaDato"
                                >
                                    <v-text-field
                                        v-if="campo.tipoDato==1"
                                        type="text"
                                        outlined
                                        color="deep-orange"
                                        :counter="50"
                                        :label="campo.nombreCampo"
                                        v-model="campo.datoString"
                                        autocomplete="off"
                                        required
                                    ></v-text-field>
                                    <v-text-field
                                        v-if="campo.tipoDato==2"
                                        type="number"
                                        outlined
                                        color="deep-orange"
                                        :counter="50"
                                        :label="campo.nombreCampo"
                                        v-model="campo.datoInteger"
                                        autocomplete="off"
                                        required
                                    ></v-text-field>
                                    <v-menu
                                        v-if="campo.tipoDato==3"
                                        v-model="dateInput1"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            outlined
                                            color="deep-orange"
                                            v-model="campo.datoDate"
                                            :label="campo.nombreCampo"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="campo.datoDate" @input="dateInput1 = false"></v-date-picker>
                                    </v-menu>
                                </v-list-item>
                            </v-list>
                            <v-divider></v-divider>
                            <div class="title text--primary">Pasos</div>
                            <v-row class="pa-1"></v-row>
                            <v-expansion-panels multiple>
                                <v-expansion-panel
                                v-for="paso in selectedTemplateInstance.pasos"
                                :key="paso.idPlantillaPasoDetalle"
                                >
                                    <v-expansion-panel-header>{{paso.nombre}}</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-card-text class="pa-3 ma-0">
                                            <div class="subtitle-1 text--primary">Descripción</div>
                                            <div class="body-2 text--secondary">{{paso.descripcion}}</div>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <div class="subtitle-1">Datos del paso</div>
                                        <v-row class="pa-1"></v-row>
                                        <div class="body-2 text--secondary" align="center">Seleccione fecha de inicio y fecha de finalización para este paso</div>
                                        <v-row>
                                            <v-col>
                                                <v-menu
                                                v-model="dateInput2"
                                                :nudge-right="40"
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                min-width="290px">
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field
                                                            solo
                                                            color="deep-orange"
                                                            v-model="paso.fechaInicio"
                                                            label="Fecha inicio"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="paso.fechaFin" @input="dateInput2 = false"></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col>
                                                <v-menu
                                                    v-model="dateInput3"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field
                                                            solo
                                                            color="deep-orange"
                                                            v-model="paso.fechaFin"
                                                            label="Fecha fin"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="paso.fechaFin" @input="dateInput3 = false"></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <div class="flex-grow-1"></div>

                        <v-btn
                            text
                            @click="dialog = false"
                        >
                            Cancelar
                        </v-btn>

                        <v-btn text color="green" @click="startProcess(selectedTemplateInstance)">
                            <v-icon left>mdi-play</v-icon> Iniciar
                        </v-btn>
                    </v-card-actions>  
                </v-card>
            </v-dialog>
            <v-dialog
            v-model="deleteDialog"
            max-width="325"
            >
                <v-card :loading="loaderCard">
                    <v-card-title class="headline">Confirmación</v-card-title>
                    <v-card-text>
                        Desea eliminar el proceso "{{selectedTemplateInstance.nombre}}"?
                    </v-card-text>
                    <v-card-actions>
                    <div class="flex-grow-1"></div>

                    <v-btn
                        text
                        @click="deleteDialog = false"
                    >
                        No
                    </v-btn>
                    <v-btn
                        text
                        @click="deleteTemplateInstance(selectedTemplateInstance)"
                    >
                        Si
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-col 
                v-for="template in templatesInstancesData"
                :key="template.idInstanciaplantilla" xs="12"
                sm="6" md="4" lg="3" xl="2" cols="12">
                <v-card          
                max-width="400"
                class="mx-auto"
                hover
                >
                <v-row class="ma-0">
                    <v-col class="pa-0" lg="9" cols="9">
                        <v-card-title>{{template.nombre}}</v-card-title>
                    </v-col>
                    <v-col class="pa-0">
                        <v-row class="ma-0">
                            <v-spacer/>
                            <v-btn icon @click="deleteDialog=true;selectedTemplateInstance=template;" large>
                                <v-icon>
                                    clear
                                </v-icon>
                            </v-btn>
                        </v-row>
                    </v-col>
                </v-row>
                    <v-card-text>
                        <div class="subtitle-1 text--primary">Descripción</div>
                        {{template.descripcion}}
                    </v-card-text>
                    <v-list-item>
                        <v-list-item-icon>
                        <v-btn icon>
                            <v-icon>linear_scale</v-icon>
                        </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Cant. de pasos</v-list-item-title>
                            <v-list-item-subtitle>{{template.pasos.length}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                        <v-btn icon>
                            <v-icon>list</v-icon>
                        </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Cant. de campos de info.</v-list-item-title>
                            <v-list-item-subtitle>{{template.datos.length}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-row class="ma-0" justify="center">
                        <div>
                            <div d-block>
                                <v-progress-circular
                                :size="100"
                                :width="10"
                                :value="0"
                                color="white"
                                >
                                0%
                                </v-progress-circular>
                            </div>
                            <v-card-text class="pa-0 ma-0">
                                0/{{template.pasos.length}}
                            </v-card-text>
                        </div>
                    </v-row>
                    <v-card-actions>
                        <v-layout row class="ma-0">
                            <v-btn @click="dialog=true;selectedTemplateInstance=template" v-if="template.iniciada=='0'" text icon color="green">
                                <v-icon>mdi-play</v-icon>
                            </v-btn>
                            <v-btn v-if="template.iniciada=='1'" text icon color="red">
                                <v-icon>mdi-stop</v-icon>
                            </v-btn>
                        <v-btn icon>
                            <v-icon>visibility</v-icon>
                        </v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-snackbar
        :color="templatesInstancesSnackbar.style"
        v-model="templatesInstancesSnackbar.active"
        :timeout="templatesInstancesSnackbar.timeout"
        >
        {{ templatesInstancesSnackbar.text }}
            <v-btn
            text
            @click="templatesInstancesSnackbar.active = false"
            >
            Cerrar
            </v-btn>
        </v-snackbar>
    </v-app>
</template>
<script>
export default {
    data:()=>({
        templatesInstancesData:[],
        selectedTemplateInstance:Object,
        usersData:[],
        isLoaded:false,
        dialog:false,
        deleteDialog:false,
        loaderCard:null,
        templatesInstancesSnackbar:{
            text:String,
            active:false,
            style:String,
            timeout:6000
        }
    }),
    methods:{
        async loadTemplatesIntances(){
            await this.$axios.get(
                this.$webServicesBaseURL+"Home/InstanciasPlantillas",
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==21){
                        this.templatesInstancesData=response.data.data;
                    }
                }
            });
        },
        async deleteTemplateInstance(templateInstance){
            this.loaderCard="deep-orange"

            await this.$axios.delete(
                this.$webServicesBaseURL+"Home/InstanciasPlantillas/Delete/"+templateInstance.idInstanciaPlantilla,
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==29){
                        this.templatesInstancesData.splice(this.templatesInstancesData.indexOf(templateInstance),1);

                        this.showSnackbar(templateInstance.nombre,"success",2);
                    }
                }
            }).catch(error=>{
                if(error.status==404){
                    if(error.data!=null){
                        if(error.data.code==20){
                            this.templatesInstancesData.splice(this.templatesInstancesData.indexOf(templateInstance),1);    
                        }
                        this.showSnackbar(error.data.message,"error",1000);
                    }else{
                        this.showSnackbar(error,"error",1000);
                    }
                }else{
                    this.showSnackbar(error,"error",1000);
                }
            });

            this.loaderCard=false;
            this.deleteDialog=false;
        },
        async startProcess(templateToStart){
            this.loaderCard="deep-orange"

            await this.$axios.put(
                this.$webServicesBaseURL+"Home/InstanciasPlantillas/Edit/"+this.selectedTemplateInstance.idInstanciaPlantilla,
                templateToStart,
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==23){
                        console.log(response);
                    }
                }
            }).catch(error=>{
                if(error.status==404){
                    if(error.data!=null){
                        if(error.data.code==20){
                            this.templatesInstancesData.splice(this.templatesInstancesData.indexOf(templateInstance),1);    
                        }
                        this.showSnackbar(error.data.message,"error",1000);
                    }else{
                        this.showSnackbar(error,"error",1000);
                    }
                }else{
                    this.showSnackbar(error,"error",1000);
                }
            });

            this.loaderCard=false;
            this.dialog=false;
        },
        async loadUsers(){
            await this.$axios.get(
                this.$webServicesBaseURL+"Home/Usuarios",
                {withCredentials:true}
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==31){
                        this.usersData=response.data.data;
                    }
                }
            });
        },
        showSnackbar(text,style,indexAction){
            this.templatesInstancesSnackbar.active=false;
            
            switch(indexAction){
                case 1:{
                    this.templatesInstancesSnackbar.text="Proceso \""+text+"\" iniciado.";
                }break;
                case 2:{
                    this.templatesInstancesSnackbar.text="Proceso \""+text+"\" eliminado.";
                }break;
                /*case 3:{
                    this.templatesSnackbar.text="Proceso \""+text+"\" actualizada.";
                }break;*/
                default:{
                    this.templatesInstancesSnackbar.text=text;
                }break;
            }

            this.templatesInstancesSnackbar.active=true;
            this.templatesInstancesSnackbar.style=style;
        },
        async initializeAll(){
            await this.loadTemplatesIntances();
            await this.loadUsers();
            this.isLoaded=true;
        }
    },
    created(){
        this.initializeAll();     
    } 
}
</script>
<style scoped>
    .hola::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    .hola::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }
    
    /* Handle */
    .hola::-webkit-scrollbar-thumb {
        background: #888; 
    }

    /* Handle on hover */
    .hola::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
</style>