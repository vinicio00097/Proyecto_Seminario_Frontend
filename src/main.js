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

const router = new VueRouter({
  base:"/Home/",
  routes: [
      {path: '/', redirect:'Inicio'},
      {path: '/Inicio', component: StartPage,name:'Inicio'},
      {path: '/Usuarios',component: UsersPage,name:'Usuarios'},
      {path: '/Plantillas',component: TemplatesPage,name:'Plantillas',children:[
        {path: 'Detalle/:idPlantilla',component: TemplateDetailPage,name:'Plantilla'}
      ]},
      {path: '/Actividades',component: ActivitiesPage,name:'Actividades'},
      {path: '/Procesos',component: MyProcessPage,name:'Mis procesos',children:[
        {path: 'Detalle/:idInstanciaPlantilla',component: ProcessStatusPage,name:'Proceso'},  
      ]},
      {path: '/ListaProcesos',component: AllProcessPage,name:'Procesos'},
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
    ]
  },
}).$mount('#app')
