<template>
  <div>

    <AccusationTab :gameData="gametex" :playerData="PlayerData.PlayerCards" class="Accusation-sheet-container"/>

    <div class="toggleCards" @click="toggleCards()"></div>

    <!--
    <div v-if="showCards" class="card-container">
      <div v-for="card in PlayerData.PlayerCards" class="card">
        <div class="card-text">
          <p>{{card.item}}</p>
        </div>
        <div class="card-img" :style="{'background-image' : 'url('+ getCardImg(card.item, card.type) +')'}"></div>
        <div class="card-text rotated">
          <p>{{card.item}}</p>
        </div>
      </div>
    </div>
    -->

  </div>
</template>

<script>
import AccusationTab from './AccusationTab'
import GameTextures from './GameTextures'
export default {
  name: 'GameMain',
  props: ['PlayerData'],
  components: {
    'AccusationTab': AccusationTab
  },
  data() {
    return {
      gametex: GameTextures,
      showCards: true,
    }
  },
  methods:{
    getCardImg(item, type){
      let imgurl;
      switch(type){
        case 'Character':
          this.gametex.Characters.forEach(char => {
            if(char.item === item){imgurl = char.url;}
          });
          break;
        case 'Room':
          this.gametex.Rooms.forEach(rooms => {
            if(rooms.item === item){imgurl = rooms.url;}
          });
          break;
        case 'Weapon':
          this.gametex.Weapons.forEach(weapon => {
            if(weapon.item === item){imgurl = weapon.url;}
          });
          break;
      }
      return imgurl;
    },
    toggleCards(){
      this.showCards = !this.showCards;
    }
  }
}
</script>

<style>
  body{
    background:#232323;
  }

  .Accusation-sheet-container{
    width:30vw;
    min-height:100vh;
    background:#121212;
    position:fixed;
    right:0px;
    z-index:2;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }
  .Accusation-title{
    padding-left:10px;
    color:white;
  }
  .Characters-container{
    width:100%;
    min-height:10px;
    display:flex;
    flex-direction: column;
  }
  .Character{
    width:100%;
    background:#2b2b2b;
    margin: 2px 0px;
    color:white;
    padding:5px 0px;
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .Character p{
    padding-left:10px;
  }
  .Character button{
    margin-right:10px;
    padding:1px 10px;
    border:solid 2px #282828;
    background:#191919;
    color:white;
    outline:none;
    cursor:pointer;
  }


  .toggleCards{
    width:75px;
    height:75px;
    position: fixed;
    left:10px;
    bottom:10px;
    background:url('../../assets/cards.png');
    background-position: center;
    background-size: cover;
    cursor:pointer;
    z-index:10;
  }
  .card-container{
    width:100vw;
    height:100vh;
    display:flex;
    justify-content: center;
    align-items: center;
    position:fixed;
    animation: flyin 1s;
    z-index:3;
  }
  @keyframes flyin {
    0%{transform: translateY(50vw);}
    100%{transform: translateY(0px);}
  }
  .card{
    width:250px;
    height:350px;
    background:black;
    display:flex;
    flex-direction: column;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    transition: all .3s;
    margin: 0px 15px;
    cursor:pointer;
    border-radius: 10px;
  }
  .card:hover{
    transform:scale(1.1);
  }
  .card-img{
    height:230px;
    width:calc(100% - 80px);
    background:white;
    margin: 0px 40px;
  }
  .card-text{
    height:60px;
    display:flex;
    align-items: center;
  }
  .rotated{
    align-self: flex-end;
  }
  .card-text p{
    color:black;
    font-weight: bold;
    padding:5px 10px;
    background:white;
    border-radius: 0px 5px 5px 0px;
  }
  .rotated p{
    border-radius: 5px 0px 0px 5px;
  }

</style>
