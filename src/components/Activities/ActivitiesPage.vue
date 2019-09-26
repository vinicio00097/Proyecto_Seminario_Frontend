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
      <template v-slot:extension>
        <v-tabs
          v-model="tab1"
          align-with-title
          background-color="transparent"
          color="white"
          flat
          centered
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab v-for="tab in sections" :key="tab.id" :href="tab.href">
            {{tab.title}}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-tabs-items v-model="tab1">
      <v-tab-item value="myProcess">
        <MyProcessPage></MyProcessPage>
      </v-tab-item>
      <v-tab-item value="process">
        <AllProcessPage></AllProcessPage>
      </v-tab-item>
      <v-tab-item value="myTasks">
        <TasksPage></TasksPage>
      </v-tab-item>
    </v-tabs-items>
  </v-app>
</template>
<script>
import MyProcessPage from './MyProcessPage'
import AllProcessPage from './AllProcessPage'
import TasksPage from './TasksPage'
export default {
    data:()=>({
      tab1:"myProcess",
      sections:[
        {id:1,title:"Mis procesos",href:"#myProcess"},
        {id:2,title:"Procesos",href:"#process"},
        {id:3,title:"Mis tareas",href:"#myTasks"}
      ],
    }),
    components:{
      MyProcessPage,
      AllProcessPage,
      TasksPage
    }
}
</script>
<style scoped>

</style>