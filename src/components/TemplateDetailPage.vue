<template>
    <v-dialog v-model="opened" @click:outside="hola()" fullscreen hide-overlay transition="scale-transition">
      <v-card>
        <v-app>
          <v-app-bar color="deep-orange" flat fixed>
            <v-btn icon dark @click="closeActivity()">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="headline">Plantilla</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <v-toolbar-items>
              <v-btn dark text @click="saveChanges()">Guardar</v-btn>
            </v-toolbar-items>
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
            <v-row justify="center" class="pa-5">
              <div class="headline text--secondary" align="center">{{templateData.nombre}}</div>
            </v-row>
            <v-divider class="mx-4"></v-divider>
            <v-row class="pa-1"/>
            <div class="title text--secondary">Campos</div>
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
            <v-row class="pa-2"/>
            <div class="title text--secondary">Pasos</div>
              <div class="scrolling-wrapper"
                v-for="paso in templateData.pasos"
                :key="paso.idPlantillaPaso">
                  <div class="card">
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
                                  <v-list-item-subtitle>{{paso.datos_Pasos.length}}</v-list-item-subtitle>
                              </v-list-item-content>
                          </v-list-item>
                          <v-card-actions align="center">
                            <v-layout row class="ma-0" justify-center>
                              <v-btn icon>
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
    </v-dialog>
</template>
<script>

export default {
  data: ()=>({
    templateData:Object,
    opened:false,
    snackbar:false,
    isLoaded:false,
    templateSnackbar:{
    style:String,
    active:false,
    timeout:6000,
    text:String
}
  }),
  props: ['visible'],
  computed: {
      show: {
          get () {
              return this.visible
          },
          set (value) {
              if (!value) {
                  this.$emit('close')
              }
          }
      }
  },
  methods:{
    closeActivity(){
      this.opened=false;
      this.$emit('close');
      this.$router.go(-1);
    },
    saveChanges(){
      this.opened=false;
      this.$emit('close');
      this.$router.go(-1);
    },
    hola(){
      this.opened=false;
      this.$emit('close');
      this.$router.go(-1);
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
      await this.loadTemplate();
      this.isLoaded=true;
    }
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