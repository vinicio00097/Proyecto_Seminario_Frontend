<template>
  <v-app>
    <v-app-bar 
      app
      flat
      :color="!isOpen?'deep-orange':'deep-orange'"
      >
      <v-app-bar-nav-icon @click="openCloseDrawer"></v-app-bar-nav-icon>
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
            v-for="action in app_bar_actions"
            :key="action.index"
            @click="() => {}"
          >
            <v-list-item-title>{{ action.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      floating
      :expand-on-hover="isOpen"
      v-model="isActive"
      disable-resize-watcher="true"
      disable-route-watcher="true"
      :permanent="isOpen"
      height="100%"
      app
    >
      <v-list shaped>
        <v-list-item two-line>
          <v-list-item-content align="center">
            <v-list-item-title class="headline uppercase">Proyecto Seminario</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mx-2" :inset="inset"></v-divider>
        <v-list-item>
          <v-list-item-avatar size="50">
            <v-img :src="userInfo.userProfileImg"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{userInfo.userName}}</v-list-item-title>
            <v-spacer/>
            <v-list-item-subtitle>{{userInfo.userEmail}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle align="center">{{userInfo.userLevel==1?"Administrador":"Estándar"}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mx-2" :inset="inset"></v-divider>
        <v-row class="pa-2"></v-row>
        <v-list-item
          v-for="item in routes"
          :key="item.title"
          link
          :to="item.link"
          active-class="deep-orange white--text"
          @click="isActive=!isActive"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-for="item in multiLevelRoutes"
          :key="item.title"
          :prepend-icon="item.icon"
          color="white"
        >
          <template v-slot:activator>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </template>
          <v-list-item
            v-for="child in item.childs"
            :key="child.title"
            link
            :to="child.link"
            active-class="deep-orange white--text"
            @click="isActive=!isActive"
          >
            <v-list-item-icon>
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        </v-list-group>
        <v-row class="pa-2"></v-row>
        <v-divider class="mx-2" :inset="inset"></v-divider>
        <v-subheader>Cuenta</v-subheader>
        <v-list-item
          link
          @click="isActive=!isActive;dialog = true;"
        >
          <v-list-item-icon>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-dialog
          v-model="dialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">Confirmación</v-card-title>

            <v-card-text>
              Desea cerrar sesión ?
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>

              <v-btn
                text
                @click="dialog = false;"
              >
                No
              </v-btn>

              <v-btn
                text
                @click="log_out()"
              >
                Si
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <transition name="fade-transition">
          <router-view/>
        </transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
/*import StartPage from './components/StartPage'
import UsersPage from './components/UsersPage'
import TemplatesPage from './components/TemplatesPage'
import MyProcessPage from './components/MyProcessPage'*/
import Vue from 'vue'

export default {
  name: 'App',
  data: () => ({
    app_bar_actions:[
      { index: 1,title:"Ajustes"},
      { index: 2,title:"Acerca de..."}
    ],
    userInfo:{
      userProfileImg: String,
      userName: String,
      userEmail: String,
      userLevel: String
    },
    routes: [
      { title: 'Inicio', icon: 'home',link:'/Inicio' },
      { title: 'Usuarios', icon: 'people' ,link:'/Usuarios'},
      { title: 'Plantillas', icon: 'grid_on' ,link:'/Plantillas'},
    ],
    multiLevelRoutes:[
      { title: 'Actividades', icon: 'dashboard',childs:[
        {title: 'Mis procesos',icon:'assignment_ind',link:'/Procesos'},
        {title: 'Procesos',icon:'settings',link:'/ListaProcesos'}
      ]}
    ],
    globalWidth:0,
    isOpen:true,
    isActive:true,
    dialog:false
  }),
  created() {
    this.globalWidth=window.innerWidth;
    if(this.globalWidth<650){
      this.isOpen=false;
    }else{
      this.isOpen=true;
    }
  },
  destroyed() {
    
  },
  beforeCreate(){
  },
  methods: {
    openCloseDrawer(){
      if(this.isActive){
        this.isActive=!this.isActive
      }else{
        this.isActive=!this.isActive
      }
    },
    log_out(){
      this.$axios.get(
        "https://localhost:44354/Home/Log_out",
        { withCredentials: true }
        ).then(response=>{
          document.location.reload(true);
      });
      this.dialog=false;
    },
  },
  mounted() {
    var oauth_session_claims=JSON.parse(atob(this.$cookies.get("oauth_session_token").split('.')[1]));
    var session_claims=JSON.parse(atob(this.$cookies.get("session_token").split('.')[1]));

    this.userInfo.userProfileImg=oauth_session_claims.picture;
    this.userInfo.userName=session_claims.user_name;
    this.userInfo.userEmail=oauth_session_claims.email;
    this.userInfo.userLevel=session_claims.user_level;

    window.onresize = () => {
      this.globalWidth=window.innerWidth;
      if(this.globalWidth<650){
        this.isOpen=false;
      }else{
        this.isOpen=true;
      }
    }
  },
};
</script>
