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
                                                    ref="menu"
                                                    v-model="menu"
                                                    :close-on-content-click="false"
                                                    :return-value.sync="date"
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    min-width="290px"
                                                >
                                                    <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                        v-model="paso.fechaInicio"
                                                        label="Picker in menu"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                    ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="paso.fechaInicio" no-title scrollable>
                                                    <div class="flex-grow-1"></div>
                                                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                                                    </v-date-picker>
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
                                        <v-select
                                            item-color="deep-orange lighten-2"
                                            solo
                                            color="deep-orange"
                                            v-model="paso.usuarios"
                                            :items="usersData"
                                            label="Seleccione usuarios"
                                            item-text="nombres"
                                            item-value="idUsuario"
                                            multiple
                                            chips
                                            deletable-chips
                                            return-object
                                        ></v-select>
                                        <v-select
                                            item-color="deep-orange lighten-2"
                                            solo
                                            color="deep-orange"
                                            v-model="paso.datos_pasos"
                                            :items="JSON.parse(JSON.stringify(selectedTemplateInstance.datos))"
                                            label="Seleccione campos"
                                            item-text="nombreCampo"
                                            item-value="idInstanciaPlantillaDato"
                                            multiple
                                            chips
                                            deletable-chips
                                            return-object
                                        ></v-select>
                                        <div class="body-2 text--secondary" align="center">Marque los campos que no serán editables</div>
                                        <v-list rounded>
                                            <v-list-item-group
                                                v-model="model"
                                                multiple
                                            >
                                                <template v-for="(dato) in paso.datos_pasos">
                                                <v-list-item
                                                    class="ma-0"
                                                    :key="dato.idInstanciaPlantillaDato"
                                                    :value="dato"
                                                    active-class="deep-orange lighten-3--text text--accent-4"
                                                >
                                                    <template v-slot:default="{ active, toggle }">
                                                    <v-list-item-content>
                                                        <v-list-item-title v-text="dato.nombreCampo"></v-list-item-title>
                                                    </v-list-item-content>

                                                    <v-list-item-action>
                                                        <v-checkbox
                                                        :input-value="dato.soloLectura=active"
                                                        :true-value="dato.soloLectura"
                                                        color="dark"
                                                        @click="toggle"
                                                        ></v-checkbox>
                                                    </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                </template>
                                            </v-list-item-group>
                                        </v-list>
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
                            <v-btn icon large>
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
        loaderCard:null,
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
            },error=>{

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