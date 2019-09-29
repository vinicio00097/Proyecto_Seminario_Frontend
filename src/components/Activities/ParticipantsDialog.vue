<template>
    <v-dialog v-model="show" max-width="325">
        <v-card>
            <v-card-title v-if="from=='paso'">Participantes del paso</v-card-title>
            <v-card-title v-if="from=='tarea'">Participantes de la tarea</v-card-title>

            <v-card-text class="pb-0">
                <div class="subtitle-1" align="center">{{step.nombre}}</div>
                <v-list>
                    <v-list-item class="pa-0"
                    v-for="user in step.usuarios"
                    :key="user.idUsuario"
                    >
                        <div class="subtitle-1">{{user.nombres}} {{user.apellidos}}</div>
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
     from: String,
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
  created(){
  }
}
</script>
<style scoped>

</style>