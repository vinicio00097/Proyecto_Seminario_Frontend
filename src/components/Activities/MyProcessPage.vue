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
            max-width="350"
            :persistent="true"
            >
                <v-card :loading="loaderCard" class="hola">
                    <v-card-title class="headline">Inicio de proceso</v-card-title>
                    <v-card-text>
                        <div class="title text--secondary">Información de proceso</div>
                        <v-row class="pa-1"></v-row>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Nombre proceso</v-list-item-title>
                                <v-spacer/>
                                <v-list-item-subtitle>{{selectedTemplateInstance.nombre}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Descripción</v-list-item-title>
                                <v-spacer/>
                                <v-list-item-subtitle>{{selectedTemplateInstance.descripcion}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-form
                        ref="processInstanceForm"
                        >
                            <v-divider></v-divider>
                            <div class="title text--secondary">Campos de información</div>
                            <v-row class="pa-1"></v-row>
                            <v-list>
                                <v-list-item class="pa-0"
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
                                    <v-dialog
                                        v-if="campo.tipoDato==3"
                                        ref="inputDateDialog"
                                        v-model="inputDateDialog"
                                        :return-value.sync="campo.datoDate"
                                        persistent
                                        full-width
                                        width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            solo
                                            v-model="campo.datoDate"
                                            :label="campo.nombreCampo"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="campo.datoDate" scrollable>
                                        <div class="flex-grow-1"></div>
                                        <v-btn text @click="inputDateDialog = false">Cancel</v-btn>
                                        <v-btn text @click="closeInputDateDialog(campo.datoDate)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-list-item>
                            </v-list>
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

                        <v-btn text color="light-green accent-3" @click="startProcess(selectedTemplateInstance)">
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
                    <v-col class="pa-0" :lg="template.iniciada=='0'?9:null" :cols="template.iniciada=='0'?9:null">
                        <v-card-title>{{template.nombre}}</v-card-title>
                    </v-col>
                    <v-col class="pa-0" v-if="template.iniciada=='0'">
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
                                :value="getPorcentageComplete(template.pasos)"
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
                        <v-layout row class="ma-0" align-center>
                            <v-btn @click="dialog=true;selectedTemplateInstance=template" v-if="template.iniciada=='0'&&template.estado=='0'" text icon color="light-green accent-3">
                                <v-icon>mdi-play</v-icon>
                            </v-btn>
                            <v-progress-circular
                                v-if="template.iniciada=='1'&&template.estado=='0'"
                                indeterminate
                                color="light-green accent-3"
                                width="3"
                                size="20"
                            ></v-progress-circular>
                            <v-progress-circular
                                v-if="template.iniciada=='1'&&template.estado=='1'"
                                value="100"
                                color="light-green accent-3"
                                width="3"
                                size="20"
                            ></v-progress-circular>
                            <v-divider vertical class="mx-1 transparent"></v-divider>
                        <v-btn icon @click="goDetails(template)">
                            <v-icon>visibility</v-icon>
                        </v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <router-view />
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
        inputDateDialog:false,
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
            if(this.$refs.processInstanceForm.validate()){
                this.loaderCard="deep-orange"

                await this.$axios.put(
                    this.$webServicesBaseURL+"Home/InstanciasPlantillas/Edit/"+this.selectedTemplateInstance.idInstanciaPlantilla,
                    templateToStart,
                    { withCredentials: true }
                ).then(response=>{
                    if(response.status==200){
                        if(response.data.code==23){
                            templateToStart.iniciada=response.data.data.iniciada;
                            templateToStart.datos=response.data.data.datos;
                            templateToStart.pasos=response.data.data.pasos;

                            this.showSnackbar(templateToStart.nombre,"success",1);
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
            }
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
        goDetails(process){
            console.log(process);
            this.$router.push({ name:'Proceso', params: { idInstanciaPlantilla: process.idInstanciaPlantilla } });
        },
        getPorcentageComplete(pasos){
            var pasosCompletos=pasos.filter(item=>item.estado==1).length;
            
            return pasosCompletos==0?0:100/pasosCompletos;
        },
        closeInputDateDialog(date){
            this.$refs.inputDateDialog[0].save(date)
        },
        async initializeAll(){
            await this.loadTemplatesIntances();
            this.isLoaded=true;
        }
    },
    created(){
        this.initializeAll();     
    } 
}
</script>
<style scoped>

</style>