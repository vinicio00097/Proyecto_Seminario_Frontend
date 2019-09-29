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
                        <v-text-field
                            :readonly="dato.soloLectura=='1'"
                            v-if="dato.tipoDato==3"
                            outlined
                            color="deep-orange"
                            :counter="50"
                            :label="dato.nombreCampo"
                            v-model="dato.datoDate"
                            autocomplete="off"
                            required
                        ></v-text-field>
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