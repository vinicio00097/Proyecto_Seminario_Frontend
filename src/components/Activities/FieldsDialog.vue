<template>
    <v-dialog v-model="show" max-width="300">
        <v-card>
            <v-card-title>Campos de la plantilla</v-card-title>

            <v-card-text class="pb-0">
                <div class="subtitle-1" align="center">{{step.nombre}}</div>
                <v-list>
                    <v-list-item class="pa-0"
                    v-for="campo in step.datos_Pasos"
                    :key="campo.idPlantillaCampo"
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{campo.nombreCampo}}</v-list-item-title>
                            <v-list-item-subtitle>{{campo.tipoDatoNavigation.nombre}}</v-list-item-subtitle>
                        </v-list-item-content>
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
     step: []
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