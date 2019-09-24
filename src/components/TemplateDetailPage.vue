<template>
    <v-dialog persistent v-model="opened" @click:outside="hola()" fullscreen hide-overlay transition="scale-transition">
      <v-card>
        <v-app>
          <v-app-bar color="deep-orange" flat fixed>
            <v-btn icon @click="closeActivity()">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="headline">Plantilla</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <!--<v-toolbar-items>
              <v-btn dark text @click="saveChanges()" disabled>Guardar</v-btn>
            </v-toolbar-items>-->
          </v-app-bar>
          <div v-if="!isLoaded" class="body">
            <v-row v-if="!isLoaded" align="center" class="pa-0 ma-0">
                <v-col align="center">
                    <v-progress-circular
                    :size="70"
                    :width="7"
                    color="deep-orange"
                    indeterminate
                    ></v-progress-circular>
                </v-col>
            </v-row>
          </div>
          <div class="body2" v-if="isLoaded">
            <v-dialog v-model="editInfoTemplateDialog" width="300">
              <v-card :loading="confirmSaveDialogLoader">
                <v-card-title class="headline">
                  Edición de plantilla
                </v-card-title>
                <v-card-text>
                  <v-row class="pa-2"/>
                  <v-form ref="infoTemplate">
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
                </v-card-text>
                <v-card-actions>
                  <div class="flex-grow-1"></div>
                  <v-btn text @click="editInfoTemplateDialog=false;">
                    Cancelar
                  </v-btn>
                  <v-btn text @click="saveChangeInfo()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-row class="pa-5" align="center">
              <div class="title text--secondary">Información de plantilla</div>
              <div class="pl-2" />
              <v-btn icon x-large @click="openEditInfoDialog()">
                <v-icon>edit</v-icon>
              </v-btn>
            </v-row>
            <v-row justify="center" class="pl-5 pr-5 pt-5">
              <div class="headline text" align="center">{{templateData.nombre}}</div>
              <div class="pl-2"/>
            </v-row>
            <v-row justify="center" class="pa-5">
              <div class="headline  text--secondary" align="center">{{templateData.descripcion}}</div>
              <div class="pl-2"/>
            </v-row>
            <v-divider class="mx-4"></v-divider>
            <v-row class="pa-1"/>
            <div class="title text--secondary">Campos</div>
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
            <v-row class="pa-2"></v-row>
            <v-row class="pl-8" justify="left">
              <v-btn outlined rounded @click="openFieldDialog('add')">
                Agregar
              </v-btn>
            </v-row>
            <div class="scrolling-wrapper" >
              <div class="card" 
                  v-for="campo in templateData.campos"
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
            <v-row class="pa-2"/>
            <div class="title text--secondary">Pasos</div>
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
                      ></v-select>
                      <v-select
                          item-color="deep-orange lighten-2"
                          solo
                          color="deep-orange"
                          v-model="newStep.datos_pasos"
                          :items="JSON.parse(JSON.stringify(templateData.campos))"
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
            <v-row class="pa-2"></v-row>
            <v-row class="pl-8" justify="left">
              <v-btn outlined rounded @click="openStepDialog('add')">
                Agregar
              </v-btn>
            </v-row>
            <div class="scrolling-wrapper">
                <div class="card"
                  v-for="paso in templateData.pasos"
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
                                <v-list-item-subtitle>{{paso.datos_Pasos.length}}</v-list-item-subtitle>
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
          </div>
          <v-snackbar
          :color="templateSnackbar.style"
          v-model="templateSnackbar.active"
          :timeout="templateSnackbar.timeout"
          >
          {{ templateSnackbar.text }}
              <v-btn
              text
              @click="templateSnackbar.active = false"
              >
              Cerrar
              </v-btn>
          </v-snackbar>
        </v-app>
      </v-card>
      <v-dialog v-model="confirmSaveDialog" width="300">
        <v-card :loading="confirmSaveDialogLoader">
          <v-card-title class="headline">
            Confirmación
          </v-card-title>
          <v-card-text>
            Desea guardar los cambios en esta plantilla ?
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn text @click="confirmSaveDialog=false;">
              Cancelar
            </v-btn>
            <v-btn text @click="commitChanges()">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-fab-transition>
            <v-btn
            v-show="canSave"
            color="white"
            light
            fixed
            large
            bottom
            right
            fab
            @click="confirmSaveDialog=true;"
            >
                <v-icon>check</v-icon>    
            </v-btn>
        </v-fab-transition>
    </v-dialog>
</template>
<script>

export default {
  data: ()=>({
    fieldTypeData:[
      {idTipoDato:1,nombre:"Texto"},
      {idTipoDato:2,nombre:"Numérico"},
      {idTipoDato:3,nombre:"Fecha"}
    ],
    usersData:[],
    sheet:false,
    templateData:Object,
    canSave:false,
    onlyNestedDialogs:true,
    opened:false,
    snackbar:false,
    isLoaded:false,
    editInfoTemplateDialog:false,
    confirmSaveDialog:false,
    confirmSaveDialogLoader:false,
    newFieldDialog:false,
    newFieldDialogAction:"",
    selectedField:Object,
    newStepDialog:false,
    newStepDialogAction:"",
    selectedStep:Object,
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
    templateSnackbar:{
      style:String,
      active:false,
      timeout:6000,
      text:String,
    },
  }),
  methods:{
    closeActivity(){
      this.opened=false;
      this.$emit('close');
      this.$router.go(-1);
    },
    saveChanges(updatedTemplate){
      this.opened=false;
      this.canSave=false;
      this.$emit('close',updatedTemplate);
      this.$router.go(-1);
    },
    hola(){
      if(!this.onlyNestedDialogs){
        console.log(this.$route);
        this.opened=false;
        this.$emit('close');
        this.$router.go(-1);
      }
    },
    async loadTemplate(){
      await this.$axios.get(
        this.$webServicesBaseURL+"Home/Plantillas/Details/"+this.$route.params.idPlantilla,
        {withCredentials:true}
      ).then(response=>{
        if(response.status==200){
            if(response.data.code==11){
              this.templateData=response.data.data;

              console.log(this.templateData);
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
    openEditInfoDialog(){
      this.newTemplate.nombre=this.templateData.nombre;
      this.newTemplate.descripcion=this.templateData.descripcion;
      this.editInfoTemplateDialog=true;
    },
    saveChangeInfo(){
      if(this.$refs.infoTemplate.validate()){
        this.templateData.nombre=this.newTemplate.nombre;
        this.templateData.descripcion=this.newTemplate.descripcion;

        this.editInfoTemplateDialog=false;
        this.canSave=true;
      }
    },
    addFields(){
        if(this.$refs.newFieldForm.validate()){
            var campo={
                idorder:new Date().getTime(),
                nombreCampo:this.newField.nombreCampo,
                tipoDato:this.newField.tipoDatoNavigation.idTipoDato,
                tipoDatoNavigation:this.newField.tipoDatoNavigation
            };


            var viewCampo={
                nombreCampo:this.newField.nombreCampo,
                nombreTipo:this.newField.tipoDatoNavigation.nombre
            };

            this.templateData.campos.push(campo);

            this.$refs.newFieldForm.reset();
            this.newFieldDialog=false;
            this.canSave=true;
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
        let deletedField=this.templateData.campos.splice(this.templateData.campos.indexOf(field),1);

        this.templateData.pasos.forEach(element=>{
          element.datos_Pasos.forEach(dato_paso=>{
            if(dato_paso.idPlantillaCampo==deletedField[0].idPlantillaCampo){
              element.datos_Pasos.splice(element.datos_Pasos.indexOf(dato_paso),1);
            }
          });
        });

        this.newFieldDialog=false;
        this.canSave=true;
    },
    updateField(){
        if(this.$refs.newFieldForm.validate()){
            this.selectedField.nombreCampo=this.newField.nombreCampo;
            this.selectedField.tipoDatoNavigation=this.newField.tipoDatoNavigation;

            this.$refs.newFieldForm.reset();
            this.newFieldDialog=false;
            this.canSave=true;
        }
    },
    addSteps(){
        if(this.$refs.newStepForm.validate()){
            var step={
                nombre:this.newStep.nombre,
                descripcion:this.newStep.descripcion,
                datos_Pasos:this.newStep.datos_pasos,
                usuarios:this.newStep.usuarios
            };

            this.newStep.read_only_datos.forEach(element => {
                element.soloLectura="1";
            });

            console.log(step);

            this.templateData.pasos.push(step);


            this.$refs.newStepForm.reset();
            this.newStepDialog=false;
            this.canSave=true;
        }
    },
    openStepDialog(action,step){
        this.newStepDialogAction=action;
        this.selectedStep=step;

        if(action=="edit"){
            this.newStep.nombre=step.nombre;
            this.newStep.descripcion=step.descripcion;
            this.newStep.datos_pasos=step.datos_Pasos;
            
            let realFields=[];
            this.newStep.read_only_datos=[];
            this.newStep.datos_pasos.forEach(element=>{
              if(element.idPlantillaCampo!=null){
                realFields.push(this.templateData.campos.find(item=>item.idPlantillaCampo==element.idPlantillaCampo));
                if(element.soloLectura|element.soloLectura=="1"){
                  this.newStep.read_only_datos.push(this.templateData.campos.find(item=>item.idPlantillaCampo==element.idPlantillaCampo));
                }
              }else{
                realFields.push(this.templateData.campos.find(item=>item.idorder==element.idorder));
                if(element.soloLectura|element.soloLectura=="1"){
                  this.newStep.read_only_datos.push(this.templateData.campos.find(item=>item.idorder==element.idorder));
                }
              }
            });

            this.newStep.datos_pasos=realFields;
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
            this.selectedStep.datos_Pasos=this.newStep.datos_pasos;
            this.selectedStep.usuarios=this.newStep.usuarios;
            this.selectedStep.read_only_datos=this.newStep.read_only_datos;

            this.selectedStep.datos_Pasos.forEach(element=>{
                element.soloLectura="0";
            });

            this.selectedStep.read_only_datos.forEach(element => {
                element.soloLectura="1";
            });

            this.$refs.newStepForm.reset();
            this.newStepDialog=false;
            this.canSave=true;
        }
    },
    deleteStep(step){
        this.templateData.pasos.splice(this.templateData.pasos.indexOf(step),1);
        this.newStepDialog=false;
        this.canSave=true;
    },
    async commitChanges(){
      this.confirmSaveDialogLoader="deep-orange";

      await this.$axios.put(
        this.$webServicesBaseURL+"Home/Plantillas/Edit/"+this.$route.params.idPlantilla,
        this.templateData,
        {withCredentials:true}
      ).then(response=>{
        if(response.status==200){
          if(response.data.code==13){
              this.canSave=false;
              this.saveChanges(response.data.data);
          }
        }
      }).catch(error=>{

      });

      this.confirmSaveDialogLoader=false;
      this.confirmSaveDialog=false;
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
      await this.loadUsers();
      await this.loadTemplate();
      this.isLoaded=true;
    },
  },
  mounted(){
    this.opened=true;
    this.initializeAll();
  }
}
</script>
<style scoped>
  .body{
    padding: 12px;
    display: flex;
    flex-direction: row;
    align-content: center;
    margin-top: 55px;
    height: 100vh;
  }
  .body2{
    padding: 12px;
    display: flex;
    flex-direction: column;
    margin-top: 55px;
    height: auto;
  }

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