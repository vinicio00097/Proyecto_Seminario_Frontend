<template>
  <v-app>
    <v-app-bar 
      app
      flat
      color="deep-orange"
      >
      <v-app-bar-nav-icon @click="$emit('openClose')"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline">
        <span>{{this.$route.matched[0].name}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon >
        <v-icon>search</v-icon>
      </v-btn>
      <v-menu
        origin="center center"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="action in $app_bar_actions"
            :key="action.index"
            @click="() => {}"
          >
            <v-list-item-title>{{ action.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-row class="ma-0 pa-0" justify="center" align="center">
      <p class="title">Inicio</p>
    </v-row>
  </v-app>
</template>
<script>
export default {
    methods:{
      
    }
}
</script>