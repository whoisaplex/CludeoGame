<template>
  <div class="main-container">
  <NameSelect v-if="!showLobby" v-on:showLobby="showLobby = true" />

  <div v-if="showLobby" class="lobbies-container">
    <div v-if="!LobbyCreated" class="Lobbies">
      <h1>Lobbies</h1>
      <div class="Lobby" v-for="lobby in Lobbies">
        <p>{{lobby.LobbyName}}</p>
        <p>{{lobby.LobbyCount}}/6</p>
        <button @click="joinLobby(lobby.LobbyName)">Join Lobby</button>
      </div>
    </div>
    <div v-if="!LobbyCreated" class="CreateLobby">
      <h1>Create Your Own Lobby</h1>
      <input v-model="createLobbyInput" placeholder="Lobby Name"/>
      <button @click.once="createLobby()">Create a Room</button>
    </div>
  </div>

  </div>
</template>

<script>
import NameSelect from '@/components/intro/NameSelect'
export default {
  name: 'HelloWorld',
  props: ['Lobbies', 'LobbyMembers'],
  components: {
    'NameSelect': NameSelect
  },
  data () {
    return {
      createLobbyInput: '',
      LobbyCreated: false,
      showLobby: false
    }
  },
  methods: {
    createLobby(){
      this.$socket.emit('CreateLobby', this.createLobbyInput);
      this.LobbyCreated = true;
    },
    joinLobby(lobby){
      this.$socket.emit('JoinLobby', lobby);
    },
  },
  sockets:{
    JoinedLobby(data){
      this.$router.push({ name: 'LobbyMain', params: {id: data}});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-container{
    width:100vw;
    height:100vh;
    background:#0c0c0c;
  }
  .lobbies-container{
    width:100vw;
    display:flex;
  }
  .Lobbies h1{
    width:calc(100% - 40px);
    padding:10px 10px;
    text-align: center;
    color:white;
    margin-bottom:10px;
  }
  .Lobbies{
    width:50%;
    min-height:20px;
    display:flex;
    flex-direction: column;
    align-items: center;
  }

  .Lobby{
    width:calc(100% - 40px);
    min-height:50px;
    display:flex;
    align-items: center;
    background:#e8e8e8;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    margin-bottom:3px;
    border-radius: 3px;
  }
  .Lobby p{
    width:calc(100% - 105px);
    text-align:left;
    padding-left:10px;
  }
  .Lobby p:last-of-type{
    width:50px;
  }
  .Lobby button{
    width:90px;
    height:40px;
    margin-right:5px;
    background:#5d96d8;
    border:none;
    border-radius:3px;
    color:#eaeaea;
    font-weight:bold;
    cursor:pointer;
  }

  .CreateLobby{
    width:50%;
    display:flex;
    flex-direction: column;
    align-items: center;
  }

  .CreateLobby h1{
    width:calc(100% - 40px);
    padding:10px 10px;
    text-align: center;
    color:white;
  }

  .CreateLobby input{
    width:calc(100% - 40px);
    margin-top:10px;
    padding:15px 10px;
  }

  .CreateLobby button{
    width:calc(100% - 40px);
    margin-top:10px;
    padding:15px 10px;
    box-sizing: content-box;
  }
</style>
