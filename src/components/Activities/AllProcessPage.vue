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
                    <v-card-title>{{template.nombre}}</v-card-title>
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
                                :value="getPorcentageComplete(template)"
                                color="white"
                                >
                                {{template.porcentageValue}}%
                                </v-progress-circular>
                            </div>
                            <v-card-text class="pa-0 ma-0">
                                {{template.pasos.filter(item=>item.estado==1).length}}/{{template.pasos.length}}
                            </v-card-text>
                        </div>
                    </v-row>
                    <v-card-actions>
                        <v-layout row class="ma-0" align-center>
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
        isLoaded:false,
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
                this.$webServicesBaseURL+"Home/InstanciasPlantillas/List",
                { withCredentials: true }
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==21){
                        this.templatesInstancesData=response.data.data;
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
        goDetails(process){
            console.log(process);
            this.$router.push({ name:'Proceso', params: { idInstanciaPlantilla: process.idInstanciaPlantilla } });
        },
        getPorcentageComplete(template){
            var pasosCompletos=template.pasos.filter((item)=>{
                if(item.estadoNavigation!=null){
                    if(item.estadoNavigation.nombre=="Aprobar"|item.estadoNavigation.nombre=="Aprobado"){
                        return item;
                    }
                }
            }).length;

            template.porcentageValue=pasosCompletos==0?0:(100/template.pasos.length)*pasosCompletos;
            template.porcentageValue=template.porcentageValue.toFixed(1);
            
            return template.porcentageValue;
        },
        async initializeAll(){
            await this.loadTemplatesIntances();
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