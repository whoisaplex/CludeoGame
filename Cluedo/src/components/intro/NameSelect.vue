<template>
  <div class="main-container">
    <img src="../../assets/coner_peice.png" :class="{'slide-up-left': clicked}" class="cornerpeice top-left"/>
    <img src="../../assets/coner_peice.png" :class="{'slide-up-right': clicked}" class="cornerpeice top-right"/>
    <img src="../../assets/coner_peice.png" :class="{'slide-down-left': clicked}" class="cornerpeice bottom-left"/>
    <img src="../../assets/coner_peice.png" :class="{'slide-down-right': clicked}" class="cornerpeice bottom-right"/>
    <div class="middle-container">
      <h1 :class="{'slide-left': clicked}">Cluedo</h1>
      <h2 :class="{'slide-right': clicked}">Online</h2>
      <input :class="{'slide-left': clicked}" type="text" placeholder="Player Name" v-model="playername">
      <button @click="enter" :class="{'slide-right': clicked}">ENTER</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NameSelect',
  data () {
    return {
      playername: '',
      clicked: false
    }
  },
  methods:{
    enter(){
      if(this.playername !== ''){
        this.clicked = true;
        this.$socket.emit('setPlayerName', this.playername);
        const self = this;
        setTimeout(function(){
          self.$emit('showLobby');
        }, 2000);
      }
    }
  }
}
</script>


<style scoped>
  body{
  }
  .cornerpeice{
    width:150px;
    position: fixed;
  }
  .top-left{
    left:5px;
    top:5px;
    transform:rotateZ(270deg);
  }
  .top-right{
    right:5px;
    top:5px;
  }
  .bottom-left{
    left:5px;
    bottom:5px;
    transform:rotateZ(180deg);
  }
  .bottom-right{
    right:5px;
    bottom:5px;
    transform:rotateZ(90deg);
  }

  @keyframes test {
    0%{transform:translate(0%, 0%)}
    100%{transform:translate(100%, -100%)}
  }
  .main-container{
    width:100vw;
    height:100vh;
    display:flex;
    justify-content: center;
    align-items: center;
    background:#0c0c0c;
    overflow-x: hidden;
  }
  .middle-container{
    display:flex;
    width:50vw;
    height:50vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .middle-container h1{
    font-size:100px;
  }
  .middle-container h2{
    font-size:40px;
  }
  .middle-container h1, .middle-container h2{
    width:100%;
    text-align: center;
    color:#dad8d8;
  }
  .middle-container input{
    border:none;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
  .middle-container button{
    font-size:20px;
    cursor:pointer;
    border:none;
    background:#4CAF50;
    border-radius:5px;
    color:#dad8d8;
  }
  .middle-container input, .middle-container button{
    width:75%;
    box-sizing: border-box;
    padding: 20px 20px;
    margin:5px;
    font-weight: bold;
  }
  .slide-left{
    animation: slide-left 2s forwards;
  }
  .slide-right{
    animation: slide-right 2s forwards;
  }


  .slide-up-left{
    animation: slide-up-left 2s forwards;
  }
  .slide-up-right{
    animation: slide-up-right 2s forwards;
  }
  .slide-down-left{
    animation: slide-down-left 2s forwards;
  }
  .slide-down-right{
    animation: slide-down-right 2s forwards;
  }

  @keyframes slide-right{
    0%{transform:translateX(0vw);}
    100%{transform:translateX(75vw);}
  }

  @keyframes slide-left{
    0%{transform:translateX(0vw);}
    100%{transform:translateX(-75vw);}
  }


  @keyframes slide-up-left{
    0%{transform:translate(0vw, 0vh) rotateZ(270deg);}
    100%{transform:translate(-100%, -100%) rotateZ(270deg);}
  }
  @keyframes slide-up-right{
    0%{transform:translate(0vw, 0vh)}
    100%{transform:translate(100%, -100%)}
  }
  @keyframes slide-down-left{
    0%{transform:translate(0vw, 0vh) rotateZ(180deg);}
    100%{transform:translate(-100%, 100%) rotateZ(180deg);}
  }
  @keyframes slide-down-right{
    0%{transform:translate(0vw, 0vh) rotateZ(90deg);}
    100%{transform:translate(100%, 100%) rotateZ(90deg);}
  }


</style>
