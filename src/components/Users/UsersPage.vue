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
        <v-row v-if="!isLoaded" align="center">
            <v-col align="center">
                <v-progress-circular
                :size="70"
                :width="7"
                color="deep-orange"
                indeterminate
                ></v-progress-circular>
            </v-col>
        </v-row>
        <v-row v-if="isLoaded" class="ma-0">
            <v-dialog
            v-model="dialog"
            max-width="325"
            :persistent="accion=='add'"
            >
                <v-card :loading="loaderCard">
                    <v-card-title v-if="accion=='delete'" class="headline">Confirmación</v-card-title>
                    <v-card-title v-if="accion=='add'" class="headline">Nuevo usuario</v-card-title>
                    <v-card-title v-if="accion=='edit'" class="headline">Edición usuario</v-card-title>

                    <v-card-text v-if="accion=='delete'">
                    Desea eliminar el usuario "{{selectedUser.usuarioEmail}}"?
                    </v-card-text>
                    <v-card-text v-if="accion=='add'||accion=='edit'">
                        <v-form
                        ref="userAddForm"
                        >
                        <v-text-field
                            outlined
                            color="deep-orange"
                            v-model="userForm.names"
                            :counter="50"
                            :rules="userForm.namesRules"
                            label="Nombres"
                            autocomplete="off"
                            required
                        ></v-text-field>

                        <v-text-field
                            outlined
                            color="deep-orange"
                            v-model="userForm.lastNames"
                            :counter="50"
                            :rules="userForm.lastNamesRules"
                            label="Apellidos"
                            autocomplete="off"
                            required
                        ></v-text-field>

                        <v-text-field
                            outlined
                            color="deep-orange"
                            v-model="userForm.email"
                            :rules="userForm.emailRules"
                            label="Correo eletrónico"
                            autocomplete="off"
                            required
                        ></v-text-field>

                        <v-select
                            item-color="deep-orange lighten-2"
                            outlined
                            color="deep-orange"
                            v-model="userForm.selectedRange"
                            :items="ranges"
                            item-text="nombre"
                            item-value="id"
                            :rules="userForm.selectedRangeRules"
                            label="Rangos"
                            autocomplete="off"
                            required
                            return-object
                        ></v-select>
                        </v-form>
                    </v-card-text>
                    <v-card-actions v-if="accion=='add'">
                        <div class="flex-grow-1"></div>

                        <v-btn
                            text
                            @click="dialog = false; $refs.userAddForm.reset();"
                        >
                            Cancelar
                        </v-btn>

                        <v-btn
                            text
                            @click="addUser()"
                        >
                            Guardar
                        </v-btn>
                    </v-card-actions>
                    <v-card-actions v-if="accion=='edit'">
                        <div class="flex-grow-1"></div>

                        <v-btn
                            text
                            @click="dialog = false; $refs.userAddForm.reset();"
                        >
                            Cancelar
                        </v-btn>

                        <v-btn
                            text
                            @click="updateUser()"
                        >
                            Guardar
                        </v-btn>
                    </v-card-actions>
                    <v-card-actions v-if="accion=='delete'">
                        <div class="flex-grow-1"></div>

                        <v-btn
                            text
                            @click="dialog = false"
                        >
                            No
                        </v-btn>

                        <v-btn
                            text
                            @click="deleteUser()"
                        >
                            Si
                        </v-btn>
                    </v-card-actions>
                    
                </v-card>
            </v-dialog>
            <v-col
                v-for="user in usersData"
                :key="user.idUsuario" xs="12"
                v-if="user.idUsuario!=$session_token.user_id"
                sm="6" md="4" lg="3" xl="2" cols="12">
                <v-card        
                max-width="400"
                class="mx-auto rounded-0"
                hover
                >
                <v-row class="ma-0">
                    <v-col class="pa-0" lg="9" cols="9">
                        <v-card-title>{{user.usuarioEmail}}</v-card-title>
                    </v-col>
                    <v-col class="pa-0">
                        <v-row class="ma-0">
                            <v-spacer/>
                            <v-btn @click="cardActionActivation('delete',user)" icon large>
                                <v-icon>
                                    clear
                                </v-icon>
                            </v-btn>
                        </v-row>
                    </v-col>
                </v-row>
                    <v-card-text>
                        <div class="subtitle-1 text--primary">Nombre</div>
                        {{user.nombres}} {{user.apellidos}}
                    </v-card-text>
                    <v-list-item>
                        <v-list-item-icon>
                        <v-btn icon>
                            <v-icon>verified_user</v-icon>
                        </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Rango</v-list-item-title>
                            <v-list-item-subtitle>{{user.rango=="1"?"Administrador":"Estándar"}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-layout row class="ma-0" justify-center>
                        <v-btn icon @click="cardActionActivation('edit',user)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-fab-transition >
            <v-btn
            color="deep-orange"
            dark
            fixed
            large
            bottom
            right
            fab
            v-show="isLoaded"
            @click="cardActionActivation('add')"
            >
                <v-icon>add</v-icon>    
            </v-btn>
        </v-fab-transition>

        <v-snackbar
        :color="usersSnackbar.style"
        v-model="usersSnackbar.active"
        :timeout="usersSnackbar.timeout"
        >
        {{ usersSnackbar.text }}
            <v-btn
            text
            @click="usersSnackbar.active = false"
            >
            Cerrar
            </v-btn>
        </v-snackbar>
    </v-app>
</template>
<script>
export default {
    data:()=>({
        usersData:[],
        ranges:[
            {id:"1",nombre:"Administrativo"},
            {id:"2",nombre:"Estándar"}
        ],
        selectedUser:Object,
        isLoaded:false,
        dialog:false,
        loaderCard:null,
        accion:String,
        usersSnackbar:{
            active:false,
            text:String,
            timeout:6000,
            style:String
        },
        userForm:{
            names:"",
            namesRules:[
                v => !!v || 'Nombres es requerido',
                v => (v && v.length <= 50) || 'Nombres debe ser menor o igual a 50',
            ],
            lastNames:"",
            lastNamesRules:[
                v => !!v || 'Apellidos es requerido',
                v => (v && v.length <= 50) || 'Apellidos debe ser menor o igual a 50',
            ],
            email: "",
            emailRules: [
                v => !!v || 'Correo electrónico es requerido',
                v => /.+@.+\..+/.test(v) || 'Correo electrónico debe ser valido',
            ],
            selectedRange:"",
            selectedRangeRules:[v => !!v || 'Rango es requerido']
        },
    }),
    methods:{
        async loadUsers(){
            await this.$axios.get(
                this.$webServicesBaseURL+"Home/Usuarios",
                {withCredentials:true}
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==31){
                        this.usersData=response.data.data;
                    }
                }
            });
        },
        async deleteUser(){
            this.loaderCard="deep-orange";

            await this.$axios.delete(
                this.$webServicesBaseURL+"Home/Usuarios/Delete/"+this.selectedUser.idUsuario,
                { withCredentials:true}
            ).then(response=>{
                if(response.status==200){
                    if(response.data.code==39){
                        this.usersData.splice(this.usersData.indexOf(this.selectedUser),1);

                        this.showSnackbar(this.selectedUser.nombres+" "+this.selectedUser.apellidos,"success",2);
                    }
                }
            }).catch(error=>{
                if(error.response!=null){
                    if(error.response.status==404){
                        if(error.response.data!=null){
                            if(error.response.data.code==30){
                                this.usersData.splice(this.usersData.indexOf(this.selectedUser),1);    
                            }
                            this.showSnackbar(error.response.data.message,"error",1000);
                        }else{
                            this.showSnackbar(error,"error",1000);
                        }
                    }else{
                        this.showSnackbar(error,"error",1000);
                    }
                }else{
                    this.showSnackbar(error,"error",1000);
                }
            });

            this.loaderCard=false;
            this.dialog=false;
        },
        async addUser(){
            if(this.$refs.userAddForm.validate()){
                let newUser={
                    nombres:this.userForm.names,
                    apellidos:this.userForm.lastNames,
                    usuarioEmail:this.userForm.email,
                    rango:this.userForm.selectedRange.id
                };

                this.loaderCard="deep-orange";

                await this.$axios.post(
                    this.$webServicesBaseURL+"Home/Usuarios/Create",
                    newUser,
                    {withCredentials:true}
                ).then(response=>{
                    if(response.status==200){
                        if(response.data.code==32){
                            newUser.idUsuario=response.data.data.idUsuario;
                            this.usersData.push(newUser);

                            this.$refs.userAddForm.reset();

                            this.showSnackbar(newUser.nombres+" "+newUser.apellidos,"success",1);
                        }
                    }
                }).catch(error=>{
                    if(error.response!=null){
                        if(error.response.status==404){
                            if(error.response.data!=null){
                                this.showSnackbar(error.response.data.message,"error",1000);
                            }else{
                                this.showSnackbar(error,"error",1000);
                            }
                        }else{
                            this.showSnackbar(error,"error",1000);
                        }   
                    }else{
                        this.showSnackbar(error,"error",1000);
                    }
                });

                this.loaderCard=false;
                this.dialog=false;
            }
        },

        async updateUser(){
            if(this.$refs.userAddForm.validate()){
                let updatedUser={
                    idUsuario:this.selectedUser.idUsuario,
                    nombres:this.userForm.names,
                    apellidos:this.userForm.lastNames,
                    usuarioEmail:this.userForm.email,
                    rango:this.userForm.selectedRange.id
                };

                this.loaderCard="deep-orange";

                await this.$axios.put(
                    this.$webServicesBaseURL+"Home/Usuarios/Edit/"+updatedUser.idUsuario,
                    updatedUser,
                    {withCredentials:true}
                ).then(response=>{
                    if(response.status==200){
                        if(response.data.code==33){

                            this.selectedUser.nombres=updatedUser.nombres;
                            this.selectedUser.apellidos=updatedUser.apellidos;
                            this.selectedUser.usuarioEmail=updatedUser.usuarioEmail;
                            this.selectedUser.rango=updatedUser.rango;

                            this.$refs.userAddForm.reset();

                            this.showSnackbar(this.selectedUser.nombres+" "+this.selectedUser.apellidos,"success",3);
                        }
                    }
                }).catch(error=>{
                    if(error.response!=null){
                        if(error.response.status==404){
                            if(error.response.data!=null){
                                if(error.response.data.code==30){
                                    this.usersData.splice(this.usersData.indexOf(this.selectedUser),1);    
                                }
                                this.showSnackbar(error.response.data.message,"error",1000);
                            }else{
                                this.showSnackbar(error,"error",1000);
                            }
                        }else{
                            this.showSnackbar(error,"error",1000);
                        }
                    }else{
                        this.showSnackbar(error,"error",1000);
                    }
                });

                this.loaderCard=false;
                this.dialog=false;
            }
        },
        async initializeAll(){
            await this.loadUsers();
            this.isLoaded=true;
        },
        cardActionActivation(accion,targetObject){
            this.accion=accion;
            this.selectedUser=targetObject;

            if(accion=="edit"){
                this.userForm.names=this.selectedUser.nombres;
                this.userForm.lastNames=this.selectedUser.apellidos;
                this.userForm.email=this.selectedUser.usuarioEmail;
                this.userForm.selectedRange=this.ranges.find(range=>range.id==this.selectedUser.rango);
            }

            this.dialog=true;
        },
        showSnackbar(text,style,indexAction){
            this.usersSnackbar.active=false;
            
            switch(indexAction){
                case 1:{
                    this.usersSnackbar.text="Usuario \""+text+"\" agregado.";
                }break;
                case 2:{
                    this.usersSnackbar.text="Usuario \""+text+"\" eliminado.";
                }break;
                case 3:{
                    this.usersSnackbar.text="Usuario \""+text+"\" actualizado.";
                }break;
            }
            
            this.usersSnackbar.active=true;
            this.usersSnackbar.style=style;
        }
    },
    created(){
        this.initializeAll();
    },
    mounted(){

    },
}
</script>