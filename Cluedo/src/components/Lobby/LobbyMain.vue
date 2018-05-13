<template>
  <div class="Lobby-container">
    <h1>{{this.$route.params.id}} Game Lobby</h1>
    <div class="flex-player-container">
      <div class="player-container">
        <div v-for="member in LobbyMembers" class="player">
          <h3>{{member.playerName}}</h3>
          <button @click="changeStatus" class="buttonReady" :class="{'buttonUnready': member.playerLobbyStatus}" v-if="member.clientid === $socket.id">{{member.playerLobbyStatus ? 'Ready' : 'Unready'}}</button>
          <p v-if="member.clientid !== $socket.id" class="playerstatus" :class="{'playerstatusReady': member.playerLobbyStatus}">{{member.playerLobbyStatus ? 'Ready' : 'Unready'}}</p>
        </div>
      </div>
    </div>
    <div v-if="gameOwner" class="game-config-container">
      <div class="button-container">
        <button>Configure Game</button>
        <button @click="startgame()">Start Game</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LobbyMain',
  props: ['LobbyMembers'],
  data () {
    return {
      gameOwner: false
    }
  },
  created(){
    this.$socket.emit('LobbyCheck', this.$route.params.id)
  },
  methods:{
    changeStatus(){
      this.$socket.emit('changeStatus');
    },
    startgame(){
      let ready = true;
      this.LobbyMembers.forEach(member => {
        if(member.playerLobbyStatus === false) ready = false;
      });
      if(ready){
        let tempLobbyMembers = this.LobbyMembers;
        tempLobbyMembers.forEach((member, index) => {
          member.playerPosition = index;
        });
        this.$socket.emit('startgame', tempLobbyMembers);
      }else{
        console.log('not everyone is ready')
      }
    }
  },
  sockets: {
    LobbyCheckStatus: function(data){
      if(data.didPass === false) this.$router.push({ path: '/'});
      if(data.gameOwner) this.gameOwner = true;
    },
    PlayerData: function(data){
      //console.log(data)
    },
    sendGetPlayerData: function(data){
      this.$socket.emit('GetPlayerData', data.findingIdentification);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .Lobby-container{
    width:100vw;
    min-height:100vh;
    background: #1c1c1c;
  }
  h1{
    width:calc(100% - 40px);
    text-align:center;
    padding:10px 20px;
    color:#e2e2e2;
  }

  .flex-player-container{
    width:100vw;
    display:flex;
    justify-content: center;
    margin-top:50px;
  }
  .player-container{
    width:70vw;
    background:#383838;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
  .player{
    width:100%;
    display:flex;
    align-items: center;
    justify-content: space-between;
    border-bottom:solid 2px black;
  }
  .player:last-of-type{
    border-bottom:none;
  }
  .player h3{
    color:#e2e2e2;
    padding:10px 0px 10px 10px;
  }
  .playerstatus{
    color:red;
    padding-right:10px;
  }
  .playerstatusReady{
    color:#388E3C;
  }
  .game-config-container{
    width:100vw;
    display:flex;
    margin-top:25px;
    justify-content: center;
  }
  .button-container{
    width:70vw;
    display:flex;
    justify-content: space-between;
  }
  .button-container button{
    width:calc(50% - 20px);
    padding:10px;
    font-weight: bold;
    border:none;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    background:#388E3C;
    color:#e2e2e2;
    font-size:20px;
    cursor:pointer;
    outline:none;
    transition: background .4s;
  }
  .button-container button:hover{background:#2a6d2e;}
  .button-container button:first-of-type{background:rgba(255, 193, 7, 0.8);}
  .button-container button:first-of-type:hover{background:rgba(255, 193, 7, 0.7);}

  .buttonReady{
    padding:5px 10px;
    margin-right:5px;
    border:none;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    cursor:pointer;
    background:#D32F2F;
    color:#e2e2e2;
    outline:none;
  }
  .buttonUnready{
    background:#388E3C;
  }

</style>
