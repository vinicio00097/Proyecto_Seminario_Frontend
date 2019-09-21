<template>
    <v-dialog v-model="opened" @click:outside="hola()" fullscreen hide-overlay transition="scale-transition">
      <v-card>
        <v-toolbar color="deep-orange">
          <v-btn icon dark @click="closeActivity()">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-toolbar-items>
            <v-btn dark text @click="saveChanges()">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
      <v-btn dark @click="snackbar = true">Open Snackbar</v-btn>
      <v-snackbar
        v-model="snackbar"
      >
        {{ text }}
        <v-btn
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-dialog>
</template>
<script>

export default {
  data: ()=>({
    opened:false,
    snackbar:false,
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
    }
  },
  mounted(){
    this.opened=true;
  }
}
</script>