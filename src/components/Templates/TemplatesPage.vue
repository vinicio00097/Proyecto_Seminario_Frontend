<template>
    <v-app>
        <v-app-bar 
        app
        flat
        color="deep-orange"
        >
            <v-app-bar-nav-icon @click="$emit('openClose')"></v-app-bar-nav-icon>
            <v-toolbar-title class="headline">
                <span>{{this.$route.matched[0].name}}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon >
                <v-icon>search</v-icon>
            </v-btn>
            <v-menu
                origin="center center"
                transition="scale-transition"
            >
                <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                </template>

                <v-list>
                <v-list-item
                    v-for="action in $app_bar_actions"
                    :key="action.index"
                    @click="() => {}"
                >
                    <v-list-item-title>{{ action.title }}</v-list-item-title>
                </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
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
            v-model="newTemplateDialog"
            max-width="450"
            persistent
            >
                <v-card :loading="loaderCard">
                    <v-card-title class="headline">Nueva plantilla</v-card-title>
                    <v-card-text>
                        <div class="title text--secondary">Información de plantilla</div>
                        <v-row class="pa-1"></v-row>
                        <v-form ref="newTemplateForm">
                            <v-text-field
                            outlined
                            color="deep-orange"
                            v-model="newTemplate.nombre"
                            :counter="50"
                            :rules="newTemplate.nombreRules"
                            label="Nombre"
                            autocomplete="off"
                            required
                            ></v-text-field>
                            <v-text-field
                            outlined
                            color="deep-orange"
                            v-model="newTemplate.descripcion"
                            :counter="50"
                            :rules="newTemplate.descripcionRules"
                            label="Descripción"
                            autocomplete="off"
                            required
                            ></v-text-field>
                        </v-form>
                        <v-divider></v-divider>
                        <div class="title text--secondary">Campos de información</div>
                        <v-row class="pa-1"></v-row>
                        <v-dialog
                        v-model="newFieldDialog"
                        max-width="300"
                        scrollable
                        >
                            <v-card>
                                <v-card-title class="headline" v-if="newFieldDialogAction=='add'">Nuevo campo</v-card-title>
                                <v-card-title class="headline" v-if="newFieldDialogAction=='edit'">Edición campo</v-card-title>
                                <v-card-title class="headline" v-if="newFieldDialogAction=='delete'">Confirmación</v-card-title>
                                <v-card-text v-if="newFieldDialogAction!='delete'">
                                    <v-form ref="newFieldForm">
                                        <v-text-field
                                        solo
                                        color="deep-orange"
                                        v-model="newField.nombreCampo"
                                        :counter="50"
                                        :rules="newField.nombreCampoRules"
                                        label="Nombre de campo"
                                        autocomplete="off"
                                        required
                                        ></v-text-field>
                                        <v-select
                                        solo
                                        item-color="deep-orange lighten-2"
                                        color="deep-orange"
                                        v-model="newField.tipoDatoNavigation"
                                        :items="fieldTypeData"
                                        item-text="nombre"
                                        item-value="idTipoDato"
                                        :rules="newField.tipoDatoNavigationRules"
                                        label="Tipo de campo"
                                        autocomplete="off"
                                        required
                                        return-object
                                        ></v-select>
                                    </v-form>
                                </v-card-text>
                                <v-card-text v-if="newFieldDialogAction=='delete'">
                                    Desea eliminar el campo "{{selectedField.nombreCampo}}"?
                                </v-card-text>
                                <v-card-actions>
                                    <div class="flex-grow-1"></div>
                                    <v-btn
                                        v-if="newFieldDialogAction=='add'"
                                        text
                                        @click="addFields()"
                                    >
                                        Agregar
                                    </v-btn>
                                    <v-btn
                                        v-if="newFieldDialogAction=='edit'"
                                        text
                                        @click="updateField()"
                                    >
                                        Guardar
                                    </v-btn>
                                    <v-btn
                                        v-if="newFieldDialogAction=='delete'"
                                        text
                                        @click="deleteField(selectedField)"
                                    >
                                        Eliminar
                                    </v-btn>
                                </v-card-actions>                              
                            </v-card>
                        </v-dialog>
                        <v-row justify="center">
                            <v-badge color="teal">
                                <template v-slot:badge>{{newTemplate.Campos.length}}</template>
                                <v-btn outlined rounded @click="openFieldDialog('add')">Agregar campo
                                </v-btn>
                            </v-badge>
                        </v-row>
                        <v-row class="pa-2"></v-row>
                        <div class="scrolling-wrapper" >
                            <div class="card" 
                                v-for="campo in newTemplate.Campos"
                                :key="campo.idPlantillaCampo">
                                <v-card          
                                width="300"
                                class="mx-auto flex-row"
                                hover
                                >
                                    <v-row class="ma-0">
                                        <v-col class="pa-0" lg="9" cols="9">
                                            <v-card-title>{{campo.nombreCampo}}</v-card-title>
                                        </v-col>
                                        <v-col class="pa-0">
                                            <v-row class="ma-0">
                                                <v-spacer/>
                                                <v-btn icon @click="openFieldDialog('delete',campo)">
                                                    <v-icon>
                                                        clear
                                                    </v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-card-text>
                                        <div class="subtitle-1 text--primary">Tipo de campo</div>
                                        {{campo.tipoDatoNavigation.nombre}}
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-layout row class="ma-0" justify-center>
                                            <v-btn icon @click="openFieldDialog('edit',campo)">
                                                <v-icon>edit</v-icon>
                                            </v-btn>
                                        </v-layout>
                                    </v-card-actions>
                                </v-card>
                            </div>
                            <div class="card"></div>
                        </div>
                        <v-row class="pa-2"></v-row>
                        <v-divider></v-divider>
                        <div class="title text--secondary">Pasos</div>
                        <v-row class="pa-1"></v-row>
                        <v-dialog
                        v-model="newStepDialog"
                        max-width="325"
                        scrollable
                        >
                            <v-card :loading="loaderCard">
                                <v-card-title class="headline" v-if="newStepDialogAction=='add'">Nuevo paso</v-card-title>
                                <v-card-title class="headline" v-if="newStepDialogAction=='edit'">Edición paso</v-card-title>
                                <v-card-title class="headline" v-if="newStepDialogAction=='delete'">Confirmación</v-card-title>
                                <v-card-text v-if="newStepDialogAction!='delete'">
                                <v-form ref="newStepForm">
                                    <v-text-field
                                        solo
                                        color="deep-orange"
                                        v-model="newStep.nombre"
                                        :counter="50"
                                        :rules="newStep.nombreRules"
                                        label="Nombre paso"
                                        autocomplete="off"
                                        required
                                        ></v-text-field>
                                    <v-text-field
                                        solo
                                        color="deep-orange"
                                        v-model="newStep.descripcion"
                                        :counter="50"
                                        :rules="newStep.descripcionRules"
                                        label="Descripción paso"
                                        autocomplete="off"
                                        required
                                        ></v-text-field>
                                    <div class="subtitle-1">Datos del paso</div>
                                    <v-row class="pa-1"></v-row>
                                    <v-select
                                        item-color="deep-orange lighten-2"
                                        solo
                                        color="deep-orange"
                                        v-model="newStep.usuarios"
                                        :items="usersData"
                                        label="Seleccione usuarios"
                                        item-text="nombres"
                                        item-value="idUsuario"
                                        multiple
                                        chips
                                        deletable-chips
                                        return-object
                                    >
                                    </v-select>
                                    <v-select
                                        item-color="deep-orange lighten-2"
                                        solo
                                        color="deep-orange"
                                        v-model="newStep.datos_pasos"
                                        :items="JSON.parse(JSON.stringify(newTemplate.Campos))"
                                        label="Seleccione campos"
                                        item-text="nombreCampo"
                                        item-value="idInstanciaPlantillaDato"
                                        multiple
                                        chips
                                        deletable-chips
                                        return-object
                                    ></v-select>
                                    <div class="body-2 text--secondary" align="center">
                                        Seleccione los campos que no serán editables de la lista de abajo
                                    </div>
                                    <v-select
                                        item-color="deep-orange lighten-2"
                                        solo
                                        color="deep-orange"
                                        v-model="newStep.read_only_datos"
                                        :items="newStep.datos_pasos"
                                        label="Seleccione campos"
                                        item-text="nombreCampo"
                                        item-value="idInstanciaPlantillaDato"
                                        multiple
                                        chips
                                        deletable-chips
                                        return-object
                                    ></v-select>
                                </v-form>
                                </v-card-text>
                                <v-card-text v-if="newStepDialogAction=='delete'">
                                    Desea eliminar el paso "{{selectedStep.nombre}}"?
                                </v-card-text>
                                <v-card-actions>
                                    <div class="flex-grow-1"></div>
                                    <v-btn
                                        v-if="newStepDialogAction=='add'"
                                        text
                                        @click="addSteps()"
                                    >
                                        Agregar
                                    </v-btn>
                                    <v-btn
                                        v-if="newStepDialogAction=='edit'"
                                        text
                                        @click="updateStep()"
                                    >
                                        Guardar
                                    </v-btn>
                                    <v-btn
                                        v-if="newStepDialogAction=='delete'"
                                        text
                                        @click="deleteStep(selectedStep)"
                                    >
                                        Eliminar
                                    </v-btn>
                                </v-card-actions>                              
                            </v-card>
                        </v-dialog>
                            <v-row justify="center">
                                <v-badge color="teal">
                                    <template v-slot:badge>{{newTemplate.Pasos.length}}</template>
                                    <v-btn outlined rounded @click="openStepDialog('add')">Agregar paso
                                    </v-btn>
                                </v-badge>
                            </v-row>
                            <v-row class="pa-2"></v-row>
                            <div class="scrolling-wrapper" >
                                <div class="card" 
                                    v-for="paso in newTemplate.Pasos"
                                    :key="paso.idPlantillaPaso">
                                    <v-card          
                                    width="300"
                                    class="mx-auto flex-row"
                                    hover
                                    >
                                    <v-row class="ma-0">
                                        <v-col class="pa-0" lg="9" cols="9">
                                            <v-card-title>{{paso.nombre}}</v-card-title>
                                        </v-col>
                                        <v-col class="pa-0">
                                            <v-row class="ma-0">
                                                <v-spacer/>
                                                <v-btn icon @click="openStepDialog('delete',paso)">
                                                    <v-icon>
                                                        clear
                                                    </v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                        <v-card-text>
                                            <div class="subtitle-1 text--primary">Descripción</div>
                                            {{paso.descripcion}}
                                        </v-card-text>
                                            <v-list-item>
                                                <v-list-item-icon>
                                                    <v-btn icon>
                                                        <v-icon>people</v-icon>
                                                    </v-btn>
                                                </v-list-item-icon>
                                                <v-list-item-content>
                                                    <v-list-item-title>Cant. de usuarios</v-list-item-title>
                                                    <v-list-item-subtitle>{{paso.usuarios.length}}</v-list-item-subtitle>
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
                                                    <v-list-item-subtitle>{{paso.datos_pasos.length}}</v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        <v-card-actions>
                                            <v-layout row class="ma-0" justify-center>
                                                <v-btn icon @click="openStepDialog('edit',paso)">
                                                    <v-icon>edit</v-icon>
                                                </v-btn>
                                            </v-layout>
                                        </v-card-actions>
                                    </v-card>
                                </div>
                                <div class="card"></div>
                            </div>
                    </v-card-text>
                    <v-card-actions>
                        <div class="flex-grow-1"></div>

                        <v-btn
                            text
                            @click="onCancelDialog()"
                        >
                            Cancelar
                        </v-btn>

                        <v-btn text @click="addTemplate()">
                            Guardar
                        </v-btn>
                    </v-card-actions>  
                </v-card>
            </v-dialog>
            <v-dialog
            v-model="dialog"
            max-width="325"
            >
                <v-card :loading="loaderCard">
                    <v-card-title class="headline">Confirmación</v-card-title>

                    <v-card-text v-if="actionDialog=='createProcess'">
                        Desea crear un proceso de la plantilla "{{selectedTemplate.nombre}}"?
                    </v-card-text>
                    <v-card-text v-if="actionDialog=='createStartProcess'">
                        Desea crear e inciar un proceso de la plantilla "{{selectedTemplate.nombre}}"?
                    </v-card-text>
                    <v-card-text v-if="actionDialog=='deleteTemplate'">
                        Desea eliminar la plantilla "{{selectedTemplate.nombre}}"?
                    </v-card-text>
                    <v-card-actions>
                    <div class="flex-grow-1"></div>

                    <v-btn
                        text
                        @click="dialog = false"
                    >
                        No
                    </v-btn>

                    <v-btn
                        v-if="actionDialog=='createProcess'||actionDialog=='createStartProcess'"
                        text
                        @click="()=>{
                            actionDialog=='createProcess'?
                                crear_proceso(selectedTemplate):
                                fieldsProcessDialog=true;
                                dialog=false;
                        }"
                    >
                        Si
                    </v-btn>
                    <v-btn
                        v-if="actionDialog=='deleteTemplate'"
                        text
                        @click="deleteTemplate(selectedTemplate)"
                    >
                        Si
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog
            scrollable
            v-model="fieldsProcessDialog"
            max-width="350"
            :persistent="true"
            >
                <v-card :loading="loaderCard">
                    <v-card-title class="headline">Inicio de proceso</v-card-title>
                    <v-card-text>
                        <div class="title text--secondary">Información de proceso</div>
                        <v-row class="pa-1"></v-row>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Nombre proceso</v-list-item-title>
                                <v-spacer/>
                                <v-list-item-subtitle>{{selectedTemplate.nombre}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Descripción</v-list-item-title>
                                <v-spacer/>
                                <v-list-item-subtitle>{{selectedTemplate.descripcion}}</v-list-item-subtitle>
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
                                v-for="campo in selectedTemplate.campos"
                                :key="campo.idPlantillaDato"
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
                                        <v-date-picker v-model="campo.datoDate" color="orange"> 
                                        <div class="flex-grow-1"></div>
                                        <v-btn text @click="inputDateDialog = false">Cancel</v-btn>
                                        <v-btn text @click="()=>{
                                                $refs.inputDateDialog[0].save(campo.datoDate)
                                            }">OK</v-btn>
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
                            @click="fieldsProcessDialog = false"
                        >
                            Cancelar
                        </v-btn>

                        <v-btn text @click="doCreateStartProcess(selectedTemplate)">
                            Crear e iniciar
                        </v-btn>
                    </v-card-actions>  
                </v-card>
            </v-dialog>
            <v-col 
                v-for="template in templatesData"
                :key="template.idPlantilla" xs="12"
                sm="6" md="4" lg="3" xl="2" cols="12">
                <v-card          
                max-width="400"
                class="mx-auto rounded-5"
                hover
                >
                <v-row class="ma-0">
                    <v-col class="pa-0" lg="9" cols="9">
                        <v-card-title>{{template.nombre}}</v-card-title>
                    </v-col>
                    <v-col class="pa-0">
                        <v-row class="ma-0">
                            <v-spacer/>
                            <v-btn icon @click="dialog=true;selectedTemplate=template;actionDialog='deleteTemplate';" large>
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
                            <v-list-item-subtitle>{{template.campos.length}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-layout row class="ma-0">
                        <v-menu
                        origin="center center"
                        transition="fade-transition"
                        offset-x
                        offset-y
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on">
                                <v-icon>more_horiz</v-icon>
                                </v-btn>
                            </template>

                            <v-list>
                                <v-list-item @click="createProcessDialog(template)">
                                    <v-list-item-title>Crear</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="createStartProcessDialog(template)">
                                    <v-list-item-title>Crear e iniciar</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <v-divider vertical class="mx-1 transparent"></v-divider>
                        <v-btn icon @click="goDetails(template,'edit')">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon @click="goDetails(template,'see')">
                            <v-icon>visibility</v-icon>
                        </v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <router-view @close="updateModifiedTemplate" :readOnly="readOnlyDetails"/>
        <v-fab-transition>
            <v-btn
            color="deep-orange"
            v-show="isLoaded"
            dark
            fixed
            large
            bottom
            right
            fab
            @click="newTemplateDialog=true;"
            >
                <v-icon>add</v-icon>    
            </v-btn>
        </v-fab-transition>
        <v-snackbar
        :color="templatesSnackbar.style"
        v-model="templatesSnackbar.active"
        :timeout="templatesSnackbar.timeout"
        >
        {{ templatesSnackbar.text }}
            <v-btn
            text
            @click="templatesSnackbar.active = false"
            >
            Cerrar
            </v-btn>
        </v-snackbar>
    </v-app>
</template>
<script>
import TemplateDetailPage from './TemplateDetailPage'

export default {
    data:()=>({
        readOnlyDetails:false,
        templatesData:[],
        usersData:[],
        fieldTypeData:[],
        templatesSnackbar:{
            style:String,
            active:false,
            timeout:6000,
            text:String
        },
        isLoaded:false,
        inputDateDialog:false,
        loaderCard: null,
        dialog:false,
        actionDialog:"",
        fieldsProcessDialog:false,
        newTemplateDialog:false,
        newFieldDialog:false,
        newFieldDialogAction:"",
        selectedField:Object,
        newStepDialog:false,
        newStepDialogAction:"",
        selectedStep:Object,
        selectedTemplate:Object,
        newTemplate:{
            nombre:"",
            nombreRules:[
                v => !!v || 'Nombre es requerido',
                v => (v && v.length <= 50) || 'Nombre debe ser menor o igual a 50',
            ],
            descripcion:"",
            descripcionRules:[
                v => !!v || 'Descripción es requerido',
                v => (v && v.length <= 50) || 'Descripción debe ser menor o igual a 50',
            ],
            Campos:[],
            Pasos:[]
        },
        newField:{
            nombreCampo:"",
            nombreCampoRules:[
                v => !!v || 'Nombre de campo es requerido',
                v => (v && v.length <= 50) || 'Nombre de campo debe ser menor o igual a 50',
            ],
            tipoDatoNavigation:"",
            tipoDatoNavigationRules:[v => !!v || 'Tipo de campo es requerido']
        },
        newStep:{
            nombre:"",
            nombreRules:[
                v => !!v || 'Nombre paso es requerido',
                v => (v && v.length <= 50) || 'Nombre paso debe ser menor o igual a 50',
            ],
            descripcion:"",
            descripcionRules:[
                v => !!v || 'Descripción paso es requerido',
                v => (v && v.length <= 50) || 'Descripción paso debe ser menor o igual a 50',
            ],
            datos_pasos:[],
            read_only_datos:[],
            usuarios:[],
        },
    }),
    components:{
        TemplateDetailPage
    },
    methods:{
        async loadTemplates(){
            await this.$axios.get(
                this.$webServicesBaseURL+"Home/Plantillas",
                { withCredentials: true }
            ).then(response=>{
                    if(response.status==200){
                        if(response.data.code==11){
                            this.templatesData=response.data.data;
                        }
                    }
            });
        },
        async loadDataTypes(){
            await this.$axios.get(
                this.$webServicesBaseURL+"DataTypes",
                { withCredentials: true }
            ).then(response=>{
                    if(response.status==200){
                        if(response.data.code==51){
                            this.fieldTypeData=response.data.data;
                        }
                    }
            });
        },
        async crear_proceso(plantilla){
            this.loaderCard="deep-orange"

            var procesoCreado=await this.$axios.post(
                this.$webServicesBaseURL+"Home/InstanciasPlantillas",
                plantilla,
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==22){
                        this.showSnackbar(plantilla.nombre,"success",4);
                        return response.data.data;
                    }
                }
            }).catch(error=>{
                if(error.response!=null){
                    if(error.response.status==404){
                        if(error.response.data!=null){
                            if(error.response.data.code==20){
                                this.templatesData.splice(this.templatesData.indexOf(plantilla),1);    
                            }
                            this.showSnackbar(error.response.data.message,"error",1000);
                        }else{
                            this.showSnackbar(error,"error",1000);
                        }
                    }else{
                        this.showSnackbar(error,"error",1000);
                    }
                }
            });

            this.loaderCard=false;
            this.dialog=false;
            return procesoCreado;
        },
        async startProcess(templateToStart){
            if(this.$refs.processInstanceForm.validate()){
                this.loaderCard="deep-orange"

                await this.$axios.put(
                    this.$webServicesBaseURL+"Home/InstanciasPlantillas/Edit/"+templateToStart.idInstanciaPlantilla,
                    templateToStart,
                    { withCredentials: true }
                ).then(response=>{
                    if(response.status==200){
                        if(response.data.code==23){
                            this.showSnackbar(templateToStart.nombre,"success",5);
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
                            this.showSnackbar(error,"error",1000);
                        }
                    }else{
                        this.showSnackbar(error,"error",1000);
                    }
                });

                this.loaderCard=false;
                this.fieldsProcessDialog=false;
            }
        },
        async doCreateStartProcess(template){
            var procesoRetornado=await this.crear_proceso(template);

            for(var iteradorDatos=0;iteradorDatos<procesoRetornado.datos.length;iteradorDatos++){
                procesoRetornado.datos[iteradorDatos].datoDate=template.campos[iteradorDatos].datoDate;
                procesoRetornado.datos[iteradorDatos].datoInteger=template.campos[iteradorDatos].datoInteger;
                procesoRetornado.datos[iteradorDatos].datoString=template.campos[iteradorDatos].datoString;
            }

            await this.startProcess(procesoRetornado);
        },
        createProcessDialog(template){
            this.dialog=true;
            this.selectedTemplate=template;
            this.actionDialog='createProcess';
        },
        createStartProcessDialog(template){
            this.dialog=true;
            this.selectedTemplate=template;
            this.actionDialog='createStartProcess';
        },
        updateModifiedTemplate(newTemplate){
            if(newTemplate!=null){
                let selectedTemplate=this.templatesData.find(template=>template.idPlantilla==newTemplate.idPlantilla);
            
                selectedTemplate.nombre=newTemplate.nombre;
                selectedTemplate.descripcion=newTemplate.descripcion;
                selectedTemplate.campos=newTemplate.campos;
                selectedTemplate.pasos=newTemplate.pasos;
            }
        },
        addFields(){
            if(this.$refs.newFieldForm.validate()){
                var campo={
                    idorder:new Date().getTime(),
                    nombreCampo:this.newField.nombreCampo,
                    soloLectura:"0",
                    tipoDato:this.newField.tipoDatoNavigation.idTipoDato,
                    tipoDatoNavigation:this.newField.tipoDatoNavigation
                };

                this.newTemplate.Campos.push(campo);

                this.$refs.newFieldForm.reset();
                this.newFieldDialog=false;
            }
        },
        openFieldDialog(action,field){
            this.newFieldDialogAction=action;
            this.selectedField=field;

            if(action=="edit"){
                this.newField.nombreCampo=field.nombreCampo;
                this.newField.tipoDatoNavigation=field.tipoDatoNavigation;
            }else{
                this.newField.nombreCampo="";
                this.newField.tipoDatoNavigation="";
            }

            this.newFieldDialog=true;
        },
        deleteField(field){
            let deletedField=this.newTemplate.Campos.splice(this.newTemplate.Campos.indexOf(field),1);

            this.newTemplate.Pasos.forEach(element=>{
                element.datos_pasos.forEach(dato_paso=>{
                    if(dato_paso.idorder==deletedField[0].idorder){
                        element.datos_pasos.splice(element.datos_pasos.indexOf(dato_paso),1);
                    }
                });
            });
            
            this.newFieldDialog=false;
        },
        updateField(){
            if(this.$refs.newFieldForm.validate()){
                this.selectedField.nombreCampo=this.newField.nombreCampo;
                this.selectedField.tipoDatoNavigation=this.newField.tipoDatoNavigation;

                this.$refs.newFieldForm.reset();
                this.newFieldDialog=false;
            }
        },
        addSteps(){
            if(this.$refs.newStepForm.validate()){
                var step={
                    nombre:this.newStep.nombre,
                    descripcion:this.newStep.descripcion,
                    datos_pasos:this.newStep.datos_pasos,
                    usuarios:this.newStep.usuarios
                };

                this.newStep.read_only_datos.forEach(element => {
                    element.soloLectura="1";
                });

                this.newTemplate.Pasos.push(step);


                this.$refs.newStepForm.reset();
                this.newStepDialog=false;
            }
        },
        openStepDialog(action,step){
            this.newStepDialogAction=action;
            this.selectedStep=step;

            if(action=="edit"){
                this.newStep.nombre=step.nombre;
                this.newStep.descripcion=step.descripcion;
                this.newStep.datos_pasos=step.datos_pasos;

                this.newStep.read_only_datos=[];
                this.newStep.datos_pasos.forEach(element=>{
                    if(element.soloLectura||element.soloLectura=="1"){
                        this.newStep.read_only_datos.push(element);
                    }
                });
                this.newStep.usuarios=step.usuarios;
            }else{
                this.newStep.nombre="";
                this.newStep.descripcion="";
                this.newStep.datos_pasos=[];
                this.newStep.usuarios=[];
            }

            this.newStepDialog=true;
        },
        updateStep(){
            if(this.$refs.newStepForm.validate()){
                this.selectedStep.nombre=this.newStep.nombre;
                this.selectedStep.descripcion=this.newStep.descripcion;
                this.selectedStep.datos_pasos=this.newStep.datos_pasos;
                this.selectedStep.usuarios=this.newStep.usuarios;
                this.selectedStep.read_only_datos=this.newStep.read_only_datos;

                this.selectedStep.datos_pasos.forEach(element=>{
                    element.soloLectura="0";
                });

                this.selectedStep.read_only_datos.forEach(element => {
                    element.soloLectura="1";
                });

                this.$refs.newStepForm.reset();
                this.newStepDialog=false;
            }
        },
        deleteStep(step){
            this.newTemplate.Pasos.splice(this.newTemplate.Pasos.indexOf(step),1);
            this.newStepDialog=false;
        },
        async addTemplate(){
            if(this.$refs.newTemplateForm.validate()){
                this.loaderCard="deep-orange";

                let newTemplate={
                    nombre:this.newTemplate.nombre,
                    descripcion: this.newTemplate.descripcion,
                    campos:this.newTemplate.Campos,
                    pasos:this.newTemplate.Pasos
                };

                await this.$axios.post(
                    this.$webServicesBaseURL+"Home/Plantillas/Create",
                    newTemplate,
                    {withCredentials:true}
                ).then(response=>{
                    if(response.status==200){
                        if(response.data.code==12){
                            this.templatesData.push(response.data.data);

                            this.showSnackbar(newTemplate.nombre,"success",1);
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
                            this.showSnackbar(error,"error",1000);
                        }
                    }else{
                        this.showSnackbar(error,"error",1000);
                    }
                });

                this.loaderCard=false;
                this.newTemplateDialog=false;
            }
        },
        async deleteTemplate(template){
            this.loaderCard="deep-orange";

            await this.$axios.delete(
                this.$webServicesBaseURL+"Home/Plantillas/Delete/"+template.idPlantilla,
                {withCredentials:true}
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==19){
                        this.templatesData.splice(this.templatesData.indexOf(template),1);

                        this.showSnackbar(template.nombre,"success",2);
                    }
                }
            }).catch(error=>{
                if(error.response!=null){
                    if(error.response.status==404){
                        if(error.response.data!=null){
                            if(error.response.data.code==10){
                                this.templatesData.splice(this.templatesData.indexOf(template),1);    
                            }
                            this.showSnackbar(error.response.data.message,"error",1000);
                        }else{
                            this.showSnackbar(error,"error",1000);
                        }
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
        onCancelDialog(){
            this.$refs.newTemplateForm.reset();
            //this.$refs.newFieldForm.reset();
            //this.$refs.newStepForm.reset();
            this.newTemplateDialog = false;
        },
        goDetails(plantilla,action){
            if(action=="edit"){
                this.readOnlyDetails=false;
                this.$router.push({ name:'Plantilla', params: { idPlantilla: plantilla.idPlantilla } });
            }else{
                this.readOnlyDetails=true;
                this.$router.push({ name:'Plantilla', params: { idPlantilla: plantilla.idPlantilla } });
            }
        },
        showSnackbar(text,style,indexAction){
            this.templatesSnackbar.active=false;
            
            switch(indexAction){
                case 1:{
                    this.templatesSnackbar.text="Plantilla \""+text+"\" agregada.";
                }break;
                case 2:{
                    this.templatesSnackbar.text="Plantilla \""+text+"\" eliminada.";
                }break;
                case 3:{
                    this.templatesSnackbar.text="Plantilla \""+text+"\" actualizada.";
                }break;
                case 4:{
                    this.templatesSnackbar.text="Proceso \""+text+"\" creado.";
                }break;
                case 5:{
                    this.templatesSnackbar.text="Proceso \""+text+"\" iniciado.";
                }break;
                default:{
                    this.templatesSnackbar.text=text;
                }break;
            }

            this.templatesSnackbar.active=true;
            this.templatesSnackbar.style=style;
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
            await this.loadTemplates();
            await this.loadUsers();
            await this.loadDataTypes();
            this.isLoaded=true;
        },
    },
    created(){
        this.initializeAll();
    },
}
</script>
<style scoped>
 .scrolling-wrapper {
    display: flex;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
}
  .card {
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 20px;
    display: inline-block;
  }
</style>