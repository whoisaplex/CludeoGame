<template>
  <div id="app">
    <router-view v-on:setPlayerPlaying="setPlayerPlaying($event)"
      :HostId="HostId"
      :playerPlaying="currentPlayerPlaying"
      :Lobbies="Lobbies"
      :LobbyMembers="LobbyMembers"
      :PlayerData="PlayerData"
    />
  </div>
</template>

<script>
export default {
  name: 'App',
  props: ['Lobbies', 'LobbyMembers', 'PlayerData'],
  data() {
    return {
      currentPlayerPlaying: '',
      HostId: ''
    }
  },
  created(){
    //this.$socket.emit('test', {name: 'Hello'})
  },
  methods: {
    setPlayerPlaying(data){
      this.HostId = data.findingIdentification;
      this.currentPlayerPlaying = data.playerPlaying;
    }
  },
  sockets: {
    changeWhoIsPlaying: function(data){
      this.currentPlayerPlaying = data;
    }
  }
}
</script>

<style>
*{
  padding:0px;
  margin:0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
