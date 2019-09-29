<template>
    <v-dialog v-model="show" max-width="300">
        <v-card>
            <v-card-title>Datos del proceso</v-card-title>

            <v-card-text class="pb-0">
                <v-list>
                    <v-list-item class="pa-0"
                    v-for="dato in arrayDatos"
                    :key="dato.idInstanciaPlantillaDato"
                    >
                        <v-text-field
                            readonly
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
                            readonly
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
                            readonly
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
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
     value: Boolean,
     arrayDatos: []
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
}
</script>
<style scoped>

</style>