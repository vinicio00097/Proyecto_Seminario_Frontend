<template>
    <v-dialog v-model="show" fullscreen hide-overlay transition="scale-transition">
      <v-card>
        <v-toolbar color="deep-orange">
          <v-btn icon dark @click="show = false">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-toolbar-items>
            <v-btn dark text @click="show= false">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
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
    }
}
</script>