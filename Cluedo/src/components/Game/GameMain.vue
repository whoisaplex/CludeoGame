<template>
  <div>
    <div class="whoisplaying">
      <p>IT'S {{playerPlaying.NAME}} TURN TO PLAY</p>
    </div>
    <p class="toggleAccusationSheet"
      @click="toggleAccusation = !toggleAccusation"
      :style="{'right': toggleAccusation ? 'calc(30vw + 3px)' : '3px'}">?</p>

    <GameCards v-if="showCards && isQuestioned === false && showingGottenCard === false"
      :isQuestioned="isQuestioned"
      :Cards="PlayerData.PlayerCards"
      :gameData="gametex"
      class="card-container"
    />
    <GameCards v-if="isQuestioned"
      :HostID="HostId"
      :senderID="senderID"
      :isQuestioned="isQuestioned"
      :Cards="questionedData"
      :gameData="gametex"
      @noLongerQuestioned="changeQuestionedStatus"
      class="card-container"
    />
    <GameCards v-if="isQuestioned === false && showingGottenCard === true"
      :HostID="HostId"
      :showingGottenCard="showingGottenCard"
      :isQuestioned="isQuestioned"
      :Cards="[shownCardData.Cards]"
      :gameData="gametex"
      @hasConfirmed="changeShowingGottenCard"
      class="card-container"
    />

    <AccusationTab :HostId="HostId"
      :gameData="gametex"
      :playerData="PlayerData.PlayerCards"
      :playerHasTurn="PlayerData.playersTurn"
      class="Accusation-sheet-container"
      :style="{'right': toggleAccusation ? '0px' : '-30vw'}"
    />
    <div class="toggleCards" @click="toggleCards()"></div>

  </div>
</template>

<script>
import AccusationTab from './AccusationTab'
import GameCards from './GameCards'
import GameTextures from './GameTextures'
export default {
  name: 'GameMain',
  props: ['PlayerData', 'playerPlaying', 'HostId'],
  components: {
    'AccusationTab': AccusationTab,
    'GameCards': GameCards
  },
  data() {
    return {
      gametex: GameTextures,
      showCards: true,
      isQuestioned: false,
      questionedData: undefined,
      senderID: undefined,
      shownCardData: undefined,
      showingGottenCard: false,
      toggleAccusation: false
    }
  },
  methods:{
    toggleCards(){
      this.showCards = !this.showCards;
    },
    changeQuestionedStatus(){
      this.isQuestioned = false;
    },
    changeShowingGottenCard(){
      this.showingGottenCard = false;
    }
  },
  sockets: {
    questioning: function(data){
      this.isQuestioned = true;
      this.toggleAccusation = false;
      this.questionedData = data.Cards;
      this.senderID = data.Senderid;
    },
    SendGottenCard: function(data){
      this.shownCardData = data;
      this.showingGottenCard = true;
    }
  }
}
</script>

<style>
  body{
    background:#232323;
  }
  .whoisplaying{
    width:100vw;
    position:fixed;
    text-align: center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }
  .whoisplaying p{
    padding:10px 0px;
    background:rgba(76, 175, 80, 0.7);
    color:white;
  }
  .Accusation-sheet-container{
    width:30vw;
    min-height:100vh;
    background:#121212;
    position:fixed;
    right:-30vw;
    z-index:2;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    transition: all 1s;
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
  }
  .toggleAccusationSheet{
    position:fixed;
    font-size:30px;
    color:white;
    cursor:pointer;
    z-index:10;
    right:10px;
    top:3px;
    transition: all 1s;
  }
  @keyframes flyin {
    0%{transform: translateY(50vw);}
    100%{transform: translateY(0px);}
  }
</style>
