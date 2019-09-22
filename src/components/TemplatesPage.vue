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
            v-model="newTemplateDialog"
            max-width="450"
            :persistent="true"
            >
                <v-card :loading="loaderCard" class="hola">
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
                            <v-row justify="center">
                                <v-badge color="teal">
                                    <template v-slot:badge>{{newTemplate.Campos.length}}</template>
                                    <v-btn outlined rounded @click="addFields()">Agregar campo
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
                                                <v-btn icon @click="deleteField(campo)">
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
                                    </v-card>
                                </div>
                                <div class="card"></div>
                            </div>
                        </v-form>
                        <v-row class="pa-2"></v-row>
                        <v-divider></v-divider>
                        <div class="title text--secondary">Pasos</div>
                        <v-dialog
                        v-model="newStepDialog"
                        max-width="300"
                        scrollable
                        >
                            <v-card :loading="loaderCard">
                                <v-card-title class="headline">Nuevo paso</v-card-title>

                                <v-card-text>
                                <v-form ref="newStepForm">
                                    <v-row>
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
                                    </v-row>
                                    <v-row>
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
                                    </v-row>
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
                                    ></v-select>
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
                                    <div class="body-2 text--secondary" align="center">Marque los campos que no serán editables</div>
                                    <v-list rounded>
                                        <v-list-item-group
                                            v-model="model"
                                            multiple
                                        >
                                            <template v-for="(dato) in newStep.datos_pasos">
                                            <v-list-item
                                                class="ma-0"
                                                :key="dato.idPlantillaDato"
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
                                </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <div class="flex-grow-1"></div>
                                    <v-btn
                                        text
                                        @click="addSteps()"
                                    >
                                        Agregar
                                    </v-btn>
                                </v-card-actions>                              
                            </v-card>
                        </v-dialog>
                            <v-row justify="center">
                                <v-badge color="teal">
                                    <template v-slot:badge>{{newTemplate.Pasos.length}}</template>
                                    <v-btn outlined rounded @click="newStepDialog=true;">Agregar paso
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
                                                <v-btn icon @click="deleteStep(paso)">
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
                        v-if="actionDialog=='createProcess'"
                        text
                        @click="crear_proceso(selectedTemplate)"
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
                        <v-btn color="deep-orange" @click="dialog=true;selectedTemplate=template;actionDialog='createProcess'" rounded>Crear</v-btn>
                        <v-btn icon @click="goDetails(template)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon>
                            <v-icon>visibility</v-icon>
                        </v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <router-view @close="console.log('hola');"/>
        <v-fab-transition>
            <v-btn
            color="deep-orange"
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
        templatesData:[],
        usersData:[],
        fieldTypeData:[
            {idTipoDato:1,nombre:"Texto"},
            {idTipoDato:2,nombre:"Numérico"},
            {idTipoDato:3,nombre:"Fecha"}
        ],
        templatesSnackbar:{
            style:String,
            active:false,
            timeout:6000,
            text:String
        },
        isLoaded:false,
        loaderCard: null,
        dialog:false,
        actionDialog:"",
        newTemplateDialog:false,
        newStepDialog:false,
        testDialogComponent:false,
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
            usuarios:[],
        },
        fieldsTable:{
            headers:[
                { text: 'Nombre campo', value: 'nombreCampo' },
                { text: 'Tipo', value: 'nombreTipo' },
            ],
            viewItems:[]
        }
    }),
    components:{
        TemplateDetailPage
    },
    methods:{
        async crear_proceso(plantilla){
            this.loaderCard="deep-orange"

            await this.$axios.post(
                this.$webServicesBaseURL+"Home/InstanciasPlantillas",
                plantilla,
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==22){
                        this.showSnackbar(plantilla.nombre,"success",1000);
                    }
                }
            }).catch(error=>{
                if(error.status==404){
                    if(error.data!=null){
                        if(error.data.code==20){
                            this.templatesData.splice(this.templatesData.indexOf(plantilla),1);    
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
        addFields(){
            if(this.$refs.newFieldForm.validate()){
                var campo={
                    idorder:this.newTemplate.Campos.length+1,
                    nombreCampo:this.newField.nombreCampo,
                    tipoDato:this.newField.tipoDatoNavigation.idTipoDato,
                    tipoDatoNavigation:this.newField.tipoDatoNavigation
                };


                var viewCampo={
                    nombreCampo:this.newField.nombreCampo,
                    nombreTipo:this.newField.tipoDatoNavigation.nombre
                };

                this.newTemplate.Campos.push(campo);

                this.fieldsTable.viewItems.push(viewCampo);

                this.$refs.newFieldForm.reset();

            }
        },
        deleteField(field){
            this.newTemplate.Campos.splice(this.newTemplate.Campos.indexOf(field),1);
        },
        addSteps(){
            if(this.$refs.newStepForm.validate()){
                var step={
                    nombre:this.newStep.nombre,
                    descripcion:this.newStep.descripcion,
                    datos_pasos:this.newStep.datos_pasos,
                    usuarios:this.newStep.usuarios
                };


                this.newTemplate.Pasos.push(step);


                this.$refs.newStepForm.reset();
                this.newStepDialog=false;
            }
        },
        deleteStep(step){
            this.newTemplate.Pasos.splice(this.newTemplate.Pasos.indexOf(step),1);
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
                            console.log(response.data);
                        }
                    }
                }).catch(error=>{
                    if(error.status==404){
                        if(error.data!=null){
                            this.showSnackbar(error.data.message,"error",1000);
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
                if(error.status==404){
                    if(error.data!=null){
                        if(error.data.code==10){
                            this.templatesData.splice(this.templatesData.indexOf(template),1);    
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
        onCancelDialog(){
            this.$refs.newTemplateForm.reset();
            this.$refs.newFieldForm.reset();
            //this.$refs.newStepForm.reset();
            this.newTemplateDialog = false;
        },
        goDetails(plantilla){
            this.$router.push({ name:'Plantilla', params: { idPlantilla: plantilla.idPlantilla } });
            console.log(this.$route.matched[0].name);
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
            this.isLoaded=true;
        }
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