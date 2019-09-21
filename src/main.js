import StartPage from './components/StartPage'
import UsersPage from './components/UsersPage'
import TemplatesPage from './components/TemplatesPage'
import TemplateDetailPage from './components/TemplateDetailPage'
import MyProcessPage from './components/MyProcessPage'
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
      {path: '/Procesos',component: MyProcessPage,name:'Mis procesos'}
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
  },
}).$mount('#app')
