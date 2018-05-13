// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, 'http://localhost:5000');
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App :Lobbies="Lobbies" :LobbyMembers="LobbyMembers" :PlayerData="PlayerData"/>',
  data(){
    return {
      LobbyMembers: [],
      Lobbies: [],
      PlayerData: undefined
    }
  },
  sockets:{
    connect: function(){
      //this.$socket.emit('joinLobby', 'TEST');
    },
    Lobby: function(data){
      this.LobbyMembers = data;
    },
    AllLobies: function(data){
      this.Lobbies = data;
    },
    ChangeToLobby: function(data){
      router.push({ name: 'LobbyMain', params: { id: data }})
    },
    ReturnOfPlayerData: function(data){
      this.PlayerData = data;
      router.push({ name: 'GameMain', params: { id: '123' }});
    }
  }
})
