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
                        <div class="title text--primary">Información de plantilla</div>
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
                        <div class="title text--primary">Campos de información</div>
                        <v-form ref="newFieldForm">
                            <v-row>
                                <v-col>
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
                                </v-col>
                                <v-col>
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
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-btn rounded @click="addFields()">Agregar campo
                                </v-btn>
                            </v-row>
                            <v-row class="pa-2"></v-row>
                            <v-expansion-panels multiple>
                                <v-expansion-panel
                                >
                                    <v-expansion-panel-header v-text="'Campos - '+newTemplate.PlantillasCamposDetalle.length"></v-expansion-panel-header>
                                    <v-expansion-panel-content class="pa-0 ma-0">
                                        <v-data-table
                                            hide-default-footer
                                            :headers="fieldsTable.headers"
                                            :items="fieldsTable.viewItems"
                                        ></v-data-table>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-form>
                        <v-row class="pa-1"></v-row>
                        <v-divider></v-divider>
                        <div class="title text--primary">Pasos</div>
                        <v-form ref="newStepForm">
                            <v-row>
                                <v-col>
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
                                </v-col>
                                <v-col>
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
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-btn rounded @click="addSteps()">Agregar paso
                                </v-btn>
                            </v-row>
                            <v-row class="pa-2"></v-row>
                            <v-expansion-panels multiple>
                                <v-expansion-panel
                                v-for="paso in newTemplate.PlantillasPasosDetalle"
                                :key="paso.idPlantillaCampo"
                                >
                                    <v-expansion-panel-header>{{paso.pasoNavigation.nombre}}</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-card-text class="pa-0 pl-2 pr-2 ma-0">
                                            <div class="subtitle-1 text--primary">Descripción</div>
                                            <div class="body-2 text--secondary">{{paso.pasoNavigation.descripcion}}</div>
                                        </v-card-text>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-form>

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
                class="mx-auto rounded-0"
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
                            <v-list-item-subtitle>{{template.plantillasPasosDetalle.length}}</v-list-item-subtitle>
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
                            <v-list-item-subtitle>{{template.plantillasCamposDetalle.length}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-layout row class="ma-0">
                        <v-btn color="deep-orange" @click="dialog=true;selectedTemplate=template;actionDialog='createProcess'" rounded>Crear</v-btn>
                        <v-btn icon>
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
export default {
    data:()=>({
        templatesData:[],
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
            PlantillasCamposDetalle:[],
            PlantillasPasosDetalle:[]
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
            ]
        },
        fieldsTable:{
            headers:[
                { text: 'Nombre campo', value: 'nombreCampo' },
                { text: 'Tipo', value: 'nombreTipo' },
            ],
            viewItems:[]
        }
    }),
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
                    nombreCampo:this.newField.nombreCampo,
                    tipoDato:this.newField.tipoDatoNavigation.idTipoDato,
                };


                var viewCampo={
                    nombreCampo:this.newField.nombreCampo,
                    nombreTipo:this.newField.tipoDatoNavigation.nombre
                };

                this.newTemplate.PlantillasCamposDetalle.push(campo);

                this.fieldsTable.viewItems.push(viewCampo);

                this.$refs.newFieldForm.reset();

            }
        },
        addSteps(){
            if(this.$refs.newStepForm.validate()){
                var step={
                    pasoNavigation:{
                        nombre:this.newStep.nombre,
                        descripcion:this.newStep.descripcion
                    }
                };


                this.newTemplate.PlantillasPasosDetalle.push(step);


                this.$refs.newStepForm.reset();
            }
        },
        async addTemplate(){
            this.loaderCard="deep-orange";

            if(this.$refs.newTemplateForm.validate()){
                let newTemplate={
                    nombre:this.newTemplate.nombre,
                    descripcion: this.newTemplate.descripcion,
                    plantillasCamposDetalle:this.newTemplate.PlantillasCamposDetalle,
                    plantillasPasosDetalle:this.newTemplate.PlantillasPasosDetalle
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
            this.$refs.newStepForm.reset();
            this.newTemplateDialog = false;
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
        async initializeAll(){
            await this.loadTemplates();
            this.isLoaded=true;
        }
    },
    created(){
        this.initializeAll();
    },
}
</script>