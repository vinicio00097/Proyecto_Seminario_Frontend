import StartPage from './components/Start/StartPage'
import UsersPage from './components/Users/UsersPage'
import TemplatesPage from './components/Templates/TemplatesPage'
import TemplateDetailPage from './components/Templates/TemplateDetailPage'
import MyProcessPage from './components/Activities/MyProcessPage'
import AllProcessPage from './components/Activities/AllProcessPage'
import ActivitiesPage from './components/Activities/ActivitiesPage'
import TasksPage from './components/Activities/TasksPage'
import ProcessStatusPage from './components/Activities/ProcessStatusPage'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(VueCookies);
Vue.use(VueAxios, axios)
Vue.use(VueRouter)

const cookieNativeJS=(cname)=>{
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const ifAuthorized = (to, from, next) => {
  if(Vue.prototype.$session_token==undefined){
    let session_token_claims=JSON.parse(atob(cookieNativeJS("session_token").split('.')[1]));
    
    if (session_token_claims.user_level==1) {
      next()
      return
    }
    next('/')
  }else{
    if (Vue.prototype.$session_token.user_level==1) {
      next()
      return
    }
    next('/')
  }
}

const router = new VueRouter({
  base:"/Home/",
  routes: [
      {path: '/', redirect:'Inicio'},
      {path: '/Inicio', component: StartPage,name:'Inicio'},
      {path: '/Usuarios',component: UsersPage,name:'Usuarios',beforeEnter:ifAuthorized},
      {path: '/Plantillas',component: TemplatesPage,name:'Plantillas',beforeEnter:ifAuthorized
      ,children:[
        {path: 'Detalle/:idPlantilla',component: TemplateDetailPage,name:'Plantilla',beforeEnter:ifAuthorized}
      ]},
      {path: '/Actividades',component: ActivitiesPage,name:'Actividades'},
      {path: '/Procesos',component: MyProcessPage,name:'Mis procesos',beforeEnter:ifAuthorized
      ,children:[
        {path: 'Detalle/:idInstanciaPlantilla',component: ProcessStatusPage,name:'Proceso',beforeEnter:ifAuthorized},  
      ]},
      {path: '/ListaProcesos',component: AllProcessPage,name:'Procesos',beforeEnter:ifAuthorized},
      {path: '/Tareas',component: TasksPage,name:'Mis tareas'},
  ],
})


new Vue({
  vuetify,
  router: router,
  render: h => h(App),
  beforeCreate(){
    this.$vuetify.theme.dark=true;
    Vue.prototype.$webServicesBaseURL="https://localhost:44354/";
    Vue.prototype.$axios=axios;
    Vue.prototype.$drawerState=false;
    Vue.prototype.$app_bar_actions=[
      { index: 1,title:"Ajustes"},
      { index: 2,title:"Acerca de..."}
    ];
    Vue.prototype.$session_oauthToken=JSON.parse(atob(this.$cookies.get("oauth_session_token").split('.')[1]));
    Vue.prototype.$session_token=JSON.parse(atob(this.$cookies.get("session_token").split('.')[1]));
  },
}).$mount('#app')
