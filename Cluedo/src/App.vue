<template>
  <div id="app">
    <router-view :Lobbies="Lobbies" :LobbyMembers="LobbyMembers" :PlayerData="PlayerData"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: ['Lobbies', 'LobbyMembers', 'PlayerData'],
  data() {
    return {
      
    }
  },
  created(){
    //this.$socket.emit('test', {name: 'Hello'})
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
