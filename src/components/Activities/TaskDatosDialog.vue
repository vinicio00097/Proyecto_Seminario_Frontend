<template>
    <v-dialog v-model="show" max-width="300">
        <v-card>
            <v-card-title>Datos de la tarea</v-card-title>

            <v-card-text class="pb-0">
                <div class="subtitle-1" align="center">{{task.nombre}}</div>
                <v-list>
                    <v-list-item class="pa-0"
                    v-for="dato in task.datos_Pasos"
                    :key="dato.idInstanciaPlantillaDato"
                    >
                        <v-text-field
                            :readonly="dato.soloLectura=='1'"
                            v-if="dato.tipoDato==1"
                            type="text"
                            outlined
                            color="deep-orange"
                            :counter="50"
                            :label="dato.nombreCampo"
                            v-model="dato.datoString"
                            autocomplete="off"
                            required
                        ></v-text-field>
                        <v-text-field
                            :readonly="dato.soloLectura=='1'"
                            v-if="dato.tipoDato==2"
                            type="number"
                            outlined
                            color="deep-orange"
                            :counter="50"
                            :label="dato.nombreCampo"
                            v-model="dato.datoInteger"
                            autocomplete="off"
                            required
                        ></v-text-field>
                        <v-dialog
                            :disabled="dato.soloLectura=='1'"
                            v-if="dato.tipoDato==3"
                            ref="inputDateDialog"
                            v-model="inputDateDialog"
                            :return-value.sync="dato.datoDate"
                            persistent
                            full-width
                            width="290px"
                        >
                            <template v-slot:activator="{ on }">
                            <v-text-field
                                v-if="dato.tipoDato==3"
                                solo
                                v-model="dato.datoDate!=null?dato.datoDate=dato.datoDate.split('T')[0]:dato.datoDate" color="dark"
                                :label="dato.nombreCampo"
                                readonly
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker v-model="dato.datoDate" color="orange"> 
                            <div class="flex-grow-1"></div>
                            <v-btn text @click="inputDateDialog = false">Cancel</v-btn>
                            <v-btn text @click="()=>{
                                    $refs.inputDateDialog[0].save(dato.datoDate)
                                }">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn text @click.stop="show=false">Cerrar</v-btn>
                <!--<v-btn text @click.stop="save()">Guardar</v-btn>-->
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
     value: Boolean,
     task: []
  },
  data:()=>({
      inputDateDialog:false,
  }),
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
         this.$emit('input', value)
      }
    }
  },
  methods:{
      save(){
          this.show=false;
      }
  },
  created(){
      console.log(this.arrayDatos);
  }
}
</script>
<style scoped>

</style>