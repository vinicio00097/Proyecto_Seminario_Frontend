<template>
    <v-dialog persistent v-model="opened" @click:outside="hola()" fullscreen hide-overlay transition="scale-transition">
      <v-card>
        <v-app>
          <v-app-bar color="deep-orange" flat fixed>
            <v-btn icon @click="closeActivity()">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="headline">Proceso</v-toolbar-title>
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
            <v-row class="pa-1"/>
            <v-row justify="center" class="headline text--secondary">Estados del paso/proceso</v-row>
            <v-row justify="center">
                <div v-for="(statusIcon,index) in statusIcons" :key="index" class="statusIcon_item">
                    <v-btn icon>
                        <v-icon>
                            {{statusIcon.icon}}
                        </v-icon>
                    </v-btn>
                    {{statusIcon.text}}
                    <div class="pl-4"/>
                </div>
            </v-row>
            <v-row class="pa-3"/>
            <v-divider class="mx-4"/>
            <v-row class="pa-3"/>
            <v-row justify="center" class="headline text--secondary">Detalles y estado del proceso</v-row>
            <v-row class="pa-1"/>
            <v-row :justify="localWidth>=960?'center':'left'" class="pl-2 pr-2 pt-2">
            <DatosDialog v-model="showDatosDialog" v-bind:arrayDatos="processData.datos"></DatosDialog>
                <v-card max-width="300">
                    <v-card-title>{{processData.nombre}}</v-card-title>
                    <v-card-text class="pb-0 pt-4">
                        <div class="subtitle-1 text--primary">Descripción</div>
                        {{processData.descripcion}}
                    </v-card-text>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-btn icon @click="showDatosDialog=true;">
                                <v-icon>
                                    list
                                </v-icon>
                            </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Cantidad de datos</v-list-item-title>
                            <v-list-item-subtitle>{{processData.datos.length}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-btn icon>
                                <v-icon>
                                    linear_scale
                                </v-icon>
                            </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Pasos aprobados</v-list-item-title>
                            <v-list-item-subtitle>{{processData.pasos.filter(item=>item.estado==1).length}}/{{processData.pasos.length}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-row class="pa-0 ma-0" justify="end">
                        <v-btn icon v-if="processData.iniciada=='0'&&processData.estado=='0'">
                            <v-icon>
                                info
                            </v-icon>
                        </v-btn>
                        <v-btn icon v-if="processData.iniciada=='1'&&processData.estado=='0'">
                            <v-icon>
                                brightness_1
                            </v-icon>
                        </v-btn>
                        <v-btn icon v-if="processData.iniciada=='1'&&processData.estado=='1'">
                            <v-icon>
                                check
                            </v-icon>
                        </v-btn>
                    </v-row>
                </v-card>
            </v-row>
            <ParticipantsDialog v-model="showParticipantsDialog" v-bind:step="selectedStep" from="paso"></ParticipantsDialog>
            <v-timeline :dense="$vuetify.breakpoint.smAndDown">
                <v-timeline-item
                v-for="(step,index) in processData.pasos"
                :key="step.idPlantillaPasoDetalle"
                :color="step.color='light-blue darken-2'/*colorsArray[Math.floor(Math.random() * colorsArray.length)]*/"
                fill-dot
                :right="index%2==0"
                :left="index%2==1"
                >
                <template v-slot:icon>
                    <v-icon v-if="step.estado==null&&step.usuarioAccion==null">info</v-icon>
                    <v-icon v-if="step.estado==null&&step.usuarioAccion!=null">brightness_1</v-icon>
                    <v-icon v-if="step.estado==1&&step.usuarioAccion!=null">check</v-icon>
                    <v-icon v-if="step.estado==21&&step.usuarioAccion!=null">warning</v-icon>
                    <v-icon v-if="step.estado==22&&step.usuarioAccion==null">keyboard_return</v-icon>
                    <v-icon v-if="step.estado==23&&step.usuarioAccion!=null">swap_horiz</v-icon>
                </template>
                <v-card>
                    <v-card-title :class="step.color">
                    <h3 class="headline light--text">{{step.nombre}}</h3>
                    </v-card-title>
                    <v-row class="pa-1"/>
                    <v-row class="pl-3 pr-3 ma-0" v-if="step.fechaInicio!=null">
                        <div class="body-2 text--secondary">{{getDatetimeParsed(step.fechaInicio)}} inicio</div>
                    </v-row>
                    <v-row>
                        <v-col class="pa-0">
                            <v-list-item >
                                <v-list-item-icon>
                                    <v-btn icon>
                                        <v-icon>
                                            receipt
                                        </v-icon>
                                    </v-btn>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Descripción</v-list-item-title>
                                    <v-list-item-subtitle>{{step.descripcion}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                        <v-col class="pa-0">
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-btn icon @click="showParticipantsDialog=true;selectedStep=step;">
                                        <v-icon>
                                            people
                                        </v-icon>
                                    </v-btn>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Participantes</v-list-item-title>
                                    <v-list-item-subtitle>{{step.usuarios.length}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                    </v-row>
                    <v-row class="pl-3 pr-3 ma-0" v-if="step.fechaFin!=null">
                        <v-spacer/>
                        <div class="body-2 text--secondary">{{getDatetimeParsed(step.fechaFin)}} fin</div>
                    </v-row>
                </v-card>
                </v-timeline-item>
            </v-timeline>
          </div>
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
      </v-card>
    </v-dialog>
</template>
<script>
import DatosDialog from './DatosDialog'
import ParticipantsDialog from './ParticipantsDialog'
export default {
    data:()=>({
        colorsArray:[
            "pink lighten-1",
            "blue lighten-1",
            "purple lighten-2",
            "amber",
            "cyan lighten-1",
            "red lighten-1",
            "green lighten-1",
            "deep-orange lighten-1",
            "teal lighten-1"
        ],
        statusIcons:[
            {icon:"info",text:"Pendiente de iniciar"},
            {icon:"brightness_1",text:"En curso"},
            {icon:"check",text:"Aprobado/terminado"},
            {icon:"warning",text:"Rechazado"},
            {icon:"keyboard_return",text:"Regresado"},
            {icon:"swap_horiz",text:"Redireccionado"},
        ],
        showDatosDialog:false,
        showParticipantsDialog:false,
        selectedStep:Object,
        processData:Object,
        localWidth:0,
        opened:false,
        isLoaded:false,
        onlyNestedDialogs:true,
        processSnackbar:{
            style:String,
            active:false,
            timeout:6000,
            text:String,
        },
    }),
    components:{
        DatosDialog,
        ParticipantsDialog
    },
    methods:{
        async loadProcess(){
            await this.$axios.get(
                this.$webServicesBaseURL+"Home/InstanciasPlantillas/Details/"+this.$route.params.idInstanciaPlantilla,
                {withCredentials:true}
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==21){
                        this.processData=response.data.data;

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
        },
        closeActivity(){
            this.opened=false;
            this.$emit('close');
            this.$router.go(-1);
        },
        hola(){
            if(!this.onlyNestedDialogs){
                this.opened=false;
                this.$emit('close');
                this.$router.go(-1);
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
        getDatetimeParsed(date){
            var readableDatetime=new Date(date);
            
            return readableDatetime.getDate()+" "+
            readableDatetime.toLocaleString('default', { month: 'long' }).substring(0,3)+" "+
            readableDatetime.getUTCFullYear()+" "+date.split("T")[1];
        },
        async initializeAll(){
            await this.loadProcess();
            this.isLoaded=true;
        }
    },
    created(){
        this.initializeAll();
    },
    mounted(){
        this.opened=true;
        this.localWidth=window.innerWidth;

        window.onresize = () => {
            this.localWidth=window.innerWidth;
        }
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
    .statusIcon_item{
        display:flex;
        flex-direction:row;
        align-items:center;
    }
</style>
