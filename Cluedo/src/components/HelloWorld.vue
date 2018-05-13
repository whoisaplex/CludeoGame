<template>
  <div class="lobbies-container">
    <div v-if="!LobbyCreated" class="Lobbies">
      <h1>Lobbies</h1>
      <div class="Lobby" v-for="lobby in Lobbies">
        <p>{{lobby}}</p>
        <button @click="joinLobby(lobby)">Join Lobby</button>
      </div>
    </div>
    <div v-if="!LobbyCreated">
      <button @click.once="createLobby()">Create a Room</button>
      <input v-model="createLobbyInput" placeholder="Lobby Name"/>
    </div>
    <div>
      <p v-for="member in LobbyMembers">{{member}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: ['Lobbies', 'LobbyMembers'],
  data () {
    return {
      createLobbyInput: '',
      LobbyCreated: false
    }
  },
  methods: {
    createLobby(){
      this.$socket.emit('CreateLobby', this.createLobbyInput);
      this.LobbyCreated = true;
    },
    joinLobby(lobby){
      this.$socket.emit('JoinLobby', lobby);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .lobbies-container{
    width:100vw;
    display:flex;
    justify-content: space-around;
  }
  .Lobbies{
    width:400px;
    min-height:20px;
  }
  .Lobby{
    width:100%;
    min-height:50px;
    display:flex;
    align-items: center;
    background:#e8e8e8;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    margin-bottom:3px;
  }
  .Lobby p{
    width:calc(100% - 105px);
    text-align:left;
    padding-left:10px;
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
</style>
